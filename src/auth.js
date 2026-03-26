import { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config';

export function useAuth(options = {}) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const devAuthRan = useRef(false);
  const { onUserChange } = options;

  useEffect(() => {
    if (import.meta.env.DEV && !import.meta.env.VITE_USE_PRODUCTION_FIREBASE) {
      if (!devAuthRan.current) {
        devAuthRan.current = true;
        signInWithEmailAndPassword(auth, 'dev@local.test', 'localdev123').catch((err) =>
          console.warn('[Auth] Dev signIn failed:', err.message),
        );
      }
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        if (onUserChange) await onUserChange(firebaseUser);
      } else {
        setUser(null);
        if (onUserChange) await onUserChange(null);
      }
      setIsLoading(false);
    });

    return () => unsub();
  }, [onUserChange]);

  return { user, isLoading };
}
