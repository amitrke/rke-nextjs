# Firebase Modular Migration Checklist

This repository is already on Firebase Web SDK modular imports. This checklist tracks hardening and remaining cleanup for future upgrades.

## Current Status

- App uses modular SDK imports across auth, firestore, storage, database, and analytics wrappers.
- No active `firebase/compat` imports in source files.
- `firebase-admin` usage remains server-side only (expected and unchanged).

## Completed In This Pass

- Added ESLint guard to block `firebase/compat` imports.
- Updated remote config helper to explicit `getRemoteConfig(app)` usage with SSR-safe guard.
- Hardened Firestore wrapper methods:
  - Added input guards for ambiguous/invalid write and append operations.
  - Prevented mutation of incoming query params.
  - Added guard for missing `pathSegments` in `getDocument`.

## Operational Notes

- Seeing `@firebase/*-compat` entries in `yarn.lock` can be normal as transitive package content under `firebase`.
- Transitive presence does not mean compat APIs are used in app code.

## Next Optional Steps

- Add lightweight unit tests around `firebase/firestore.ts` wrapper behavior.
- Consider narrowing `FirestoreWriteParams` to a discriminated union for stricter compile-time safety.
- Keep running ESLint in CI to prevent regressions.
