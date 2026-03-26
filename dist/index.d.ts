import { Auth, User, Unsubscribe } from 'firebase/auth';
import { FirebaseOptions, FirebaseApp } from 'firebase/app';
import { UseQueryResult } from '@tanstack/react-query';

/**
 * Observable for authentication state changes.
 *
 * @param {Auth} auth - The Firebase Auth instance to observe.
 * @param {(user: User | null) => void} callback - The callback triggered on state change.
 * @returns {Unsubscribe} The unsubscribe function.
 *
 * @example
 * const unsubscribe = observeAuth(auth, (user) => {
 *   console.log('User state changed:', user);
 * });
 */
declare const observeAuth: (auth: Auth, callback: (user: User | null) => void) => Unsubscribe;

/**
 * Initialize or get the default Firebase application instance.
 *
 * If an app instance is already initialized, it returns the existing one.
 *
 * @param {FirebaseOptions} config - The Firebase project configuration object.
 * @returns {FirebaseApp} The initialized FirebaseApp instance.
 *
 * @example
 * const app = initFirebase({
 *   apiKey: "...",
 *   authDomain: "...",
 *   // ...
 * });
 */
declare const initFirebase: (config: FirebaseOptions) => FirebaseApp;

/**
 * Hook to retrieve and reactively track the current Firebase authenticated user.
 *
 * Leverages TanStack Query for efficient server-state management.
 * Returns the `User` object or `null` if the user is unauthenticated.
 *
 * @returns {UseQueryResult<User | null, Error>} The query result object.
 *
 * @example
 * const { data: user, isLoading } = useAuthQuery();
 */
declare function useAuthQuery(): UseQueryResult<User | null, Error>;

export { initFirebase, observeAuth, useAuthQuery };
