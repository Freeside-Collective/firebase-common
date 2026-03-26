import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

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
export function useAuthQuery(): UseQueryResult<User | null, Error> {
  const auth = getAuth();
  
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: () => new Promise<User | null>((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      }, (error) => {
        unsubscribe();
        reject(error);
      });
    }),
    staleTime: Infinity,
  });
}
