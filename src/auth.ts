import { Auth, onAuthStateChanged, Unsubscribe, User } from 'firebase/auth';

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
export const observeAuth = (
  auth: Auth,
  callback: (user: User | null) => void
): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};
