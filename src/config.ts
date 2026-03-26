import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';

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
export const initFirebase = (config: FirebaseOptions): FirebaseApp => {
  if (getApps().length) return getApp();
  return initializeApp(config);
};
