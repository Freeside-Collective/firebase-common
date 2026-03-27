import { getFirestore } from 'firebase/firestore';
import { getAuth as _getAuth } from 'firebase/auth';
import { getStorage as _getStorage } from 'firebase/storage';
import { getFunctions as _getFunctions } from 'firebase/functions';

/**
 * These singletons rely on the host application (e.g. admin-client or game-client)
 * calling `initializeApp` synchronously before lazy-loading the context modules
 * that depend on this package.
 */
let _db: any, _auth: any, _storage: any, _functions: any;

try {
  _db = getFirestore();
  _auth = _getAuth();
  _storage = _getStorage();
  _functions = _getFunctions();
} catch (e) {
  console.warn('[firebase-common] Firebase not initialized prior to module evaluation. Using getters.');
}

export const db = new Proxy({}, { get: (_, prop) => Reflect.get(_db || getFirestore(), prop) });
export const auth = new Proxy({}, { get: (_, prop) => Reflect.get(_auth || _getAuth(), prop) });
export const storage = new Proxy({}, { get: (_, prop) => Reflect.get(_storage || _getStorage(), prop) });
export const functions = new Proxy({}, { get: (_, prop) => Reflect.get(_functions || _getFunctions(), prop) });
