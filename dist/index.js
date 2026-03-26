// src/auth.ts
import { onAuthStateChanged } from "firebase/auth";
var observeAuth = (auth, callback) => {
  return onAuthStateChanged(auth, callback);
};

// src/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
var initFirebase = (config) => {
  if (getApps().length) return getApp();
  return initializeApp(config);
};

// src/useAuthQuery.ts
import { getAuth, onAuthStateChanged as onAuthStateChanged2 } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
function useAuthQuery() {
  const auth = getAuth();
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: () => new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged2(auth, (user) => {
        unsubscribe();
        resolve(user);
      }, (error) => {
        unsubscribe();
        reject(error);
      });
    }),
    staleTime: Infinity
  });
}
export {
  initFirebase,
  observeAuth,
  useAuthQuery
};
