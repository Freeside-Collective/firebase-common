# @freeside-collective/firebase-common

Shared Firebase initialization and authentication hooks for the Freeside RPG Platform.

## Architecture
- Centralizes `initializeApp`.
- Exported services: Auth, Firestore, Storage, Functions.
- Shared `useAuth` hook with generic support for custom user change handlers.

## Usage
```javascript
import { initFirebase, useAuth } from '@freeside-collective/firebase-common';
initFirebase();
const { user } = useAuth();
```
