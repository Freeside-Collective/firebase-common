# @freeside-collective/firebase-common

Shared Firebase initialization and authentication utilities for the Freeside RPG Platform.

## Architecture

- `initFirebase(config)` — singleton Firebase app initialization (idempotent via `getApps()` check)
- `observeAuth(auth, callback)` — thin wrapper around `onAuthStateChanged` returning an unsubscribe handle
- `useAuthQuery()` — TanStack Query hook for reactive auth state tracking

## Exports

| Export | Module | Description |
|---|---|---|
| `initFirebase` | `config.ts` | Initialize or retrieve the default FirebaseApp |
| `observeAuth` | `auth.ts` | Observable wrapper for auth state changes |
| `useAuthQuery` | `useAuthQuery.ts` | React hook (TanStack Query) for current auth user |

## Dependencies

- `firebase` — Firebase JS SDK
- `@tanstack/react-query` — server-state management for `useAuthQuery`
- `@freeside-collective/schema` — workspace dependency (shared types)

## Usage

```typescript
import { initFirebase, observeAuth, useAuthQuery } from '@freeside-collective/firebase-common';

// Initialize Firebase (idempotent)
const app = initFirebase({ apiKey: '...', authDomain: '...' });

// React hook for auth state
const { data: user, isLoading } = useAuthQuery();

// Manual auth observation
const unsubscribe = observeAuth(auth, (user) => console.log(user));
```
