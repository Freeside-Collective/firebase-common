/**
 * Apollo Client configuration for GraphQL WebSocket connections.
 *
 * @remarks
 * Provides a pre-configured Apollo Client for connecting to the realtime-server
 * via WebSocket. Supports both queries/mutations over HTTP and subscriptions
 * over WebSocket.
 *
 * @module graphql
 */
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

/**
 * Configuration for the GraphQL client.
 */
export interface GraphQLConfig {
  httpUrl: string;
  wsUrl: string;
  token?: string;
}

/**
 * Default configuration using environment variables.
 *
 * Uses localhost in development, production URL otherwise.
 */
function getDefaultConfig(): GraphQLConfig {
  const isDev = typeof window !== 'undefined' && window.location?.hostname === 'localhost';
  return {
    httpUrl: isDev
      ? 'http://localhost:4000/graphql'
      : 'https://realtime-server-production.run.app/graphql',
    wsUrl: isDev
      ? 'ws://localhost:4000/graphql'
      : 'wss://realtime-server-production.run.app/graphql',
  };
}

/**
 * Creates an Apollo Client instance configured for GraphQL over HTTP
 * and WebSocket subscriptions.
 *
 * @param config - Optional configuration overrides
 * @returns Configured ApolloClient instance
 */
export function createApolloClient(config?: Partial<GraphQLConfig>): ApolloClient<unknown> {
  const cfg = { ...getDefaultConfig(), ...config };

  const httpLink = new HttpLink({
    uri: cfg.httpUrl,
    headers: cfg.token ? { Authorization: `Bearer ${cfg.token}` } : {},
  });

  const wsLink = typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: cfg.wsUrl,
          connectionParams: cfg.token ? { authorization: `Bearer ${cfg.token}` } : {},
          retryAttempts: 5,
          shouldRetry: () => true,
        }),
      )
    : httpLink;

  const splitLink = typeof window !== 'undefined'
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        httpLink,
      )
    : httpLink;

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });
}

/**
 * Default Apollo Client instance.
 * Lazy-initialized on first use.
 */
let defaultClient: ApolloClient<unknown> | null = null;

/**
 * Gets the default Apollo Client instance.
 * Creates it on first call.
 *
 * @param config - Optional configuration overrides
 * @returns The default ApolloClient instance
 */
export function getApolloClient(config?: Partial<GraphQLConfig>): ApolloClient<unknown> {
  if (!defaultClient) {
    defaultClient = createApolloClient(config);
  }
  return defaultClient;
}

/**
 * Resets the default client instance.
 * Useful for testing or reconfiguring the client.
 */
export function resetApolloClient(): void {
  defaultClient = null;
}
