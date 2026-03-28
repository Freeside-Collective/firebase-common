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
 * Configure via VITE_REALTIME_SERVER_URL (e.g., ws://localhost:4001/graphql)
 */
function getDefaultConfig(): GraphQLConfig {
  const isDev = typeof window !== 'undefined' && window.location?.hostname === 'localhost';
  const defaultPort = isDev ? '4001' : '443';
  const defaultHost = isDev ? 'localhost' : 'realtime-server-production.run.app';
  const defaultScheme = isDev ? 'http' : 'https';
  const wsScheme = isDev ? 'ws' : 'wss';

  const env = typeof globalThis !== 'undefined' ? (globalThis as Record<string, unknown>) : {};
  const envUrl = env['VITE_REALTIME_SERVER_URL'] as string | undefined;

  if (envUrl) {
    const wsUrl = envUrl.replace(/^http/, 'ws');
    return { httpUrl: envUrl, wsUrl };
  }

  return {
    httpUrl: `${defaultScheme}://${defaultHost}:${defaultPort}/graphql`,
    wsUrl: `${wsScheme}://${defaultHost}:${defaultPort}/graphql`,
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
