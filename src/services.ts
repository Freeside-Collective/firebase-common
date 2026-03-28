/**
 * services.ts — Singleton Firebase service instances
 * ===================================================
 * Exports `app`, `db`, `storage`, `auth`, and `functions` for use by
 * context modules loaded inside the admin-client shell.
 *
 * **Contract:** The host application (admin-client or game-client) MUST
 * call `initializeApp()` before any context module is imported.  This
 * module calls `getApp()` which returns the already-initialised default
 * Firebase app.  If no app has been initialised yet, Firebase will throw
 * a clear error ("No Firebase App '[DEFAULT]' has been created").
 *
 * Emulator wiring is the host's responsibility — context modules just
 * call `getFirestore(app)` etc. and get whatever the host configured.
 */
import { getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import type { Functions } from 'firebase/functions';

/** The default Firebase application (must be initialised by the host). */
export const app: FirebaseApp = /* @__PURE__ */ getApp();

/** Firestore database instance. */
export const db: Firestore = /* @__PURE__ */ getFirestore(app);

/** Firebase Authentication instance. */
export const auth: Auth = /* @__PURE__ */ getAuth(app);

/** Firebase Cloud Storage instance. */
export const storage: FirebaseStorage = /* @__PURE__ */ getStorage(app);

/** Firebase Cloud Functions instance (us-central1). */
export const functions: Functions = /* @__PURE__ */ getFunctions(app, 'us-central1');
