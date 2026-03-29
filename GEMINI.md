# GEMINI.md — Gemini Agent Configuration

> **Behavior:** Read `AGENTS.md` for full project context. The rules below are Gemini-specific operational constraints.

## Behavioral Rules

- **DO NOT** compliment the user, or provide content that is purely intended to encourage them emotionally
- **DO** think critically about changes, be pragmatic, and ask clarifying questions — do not be afraid to challenge the user
- **DO NOT** allow agent documentation to drift out of sync with the current reality of the codebase
- **DO** always update **ALL** relevant agent documentation (`AGENTS.md`, `GEMINI.md`) in **EVERY COMMIT**
- **ALWAYS** read a file before attempting to write to it — tooling rules will force this behavior and waste tokens if not followed
- **DO** execute frequent, detailed commits, with frequent pushes to `main`

---

## Commit Flow (MANDATORY)

This repository is a git submodule of `Freeside-Collective/straylight`. The correct sequence for **every** set of changes is:

```
1. Make changes inside this repo
2. git add + git commit  (with correct prefix — see Commit Format below)
3. git push origin main  <- push to THIS repo first
4. cd to straylight root
5. Update straylight docs: AGENT_BOARD.md, migration docs — record the new SHA
6. git add + git commit on straylight/dev  (pins new submodule SHA + doc updates)
7. git push origin dev
```

**DO NOT** commit code in this repo without immediately pushing to `origin main`.
Straylight pins SHAs — an unpushed commit is invisible to the orchestrator and breaks the version manifest.

**DO NOT** use deferred or batched doc-update schemes (no "systemUpdates" pattern).
Doc changes travel in the **same commit** as the code change that necessitated them.

---

## Commit Format

| Prefix | Use for |
|---|---|
| `(feat):` | New functionality |
| `(fix):` | Bug fixes, corrections |
| `(chore):` | Dependency updates, lockfile, tooling |
| `(doc):` | Documentation-only changes |

---

## Branch Strategy

- This repo uses a **single `main` branch**. All work lands directly on `main`.
- Straylight `dev` pins this repos `main` SHA -> preview deploy.
- Straylight `main` pins this repos `main` SHA -> production deploy.
- Do **NOT** create long-lived feature branches unless explicitly instructed.

---

## Documentation Rules

- `AGENTS.md` and `GEMINI.md` must be updated in the **same commit** as any change that affects project structure, key files, public API, or constraints.
- Every pushed commit must leave docs accurately reflecting the repo state at that SHA.
- The straylight `AGENT_BOARD.md` must be updated in the **same straylight commit** that pins the new SHA from this repo.

---

## What NOT To Do

- **DO NOT** commit `node_modules/`, `dist/`, or build artifacts
- **DO NOT** accumulate changes across logical units without committing between them
- **DO NOT** use `any` in TypeScript without an explicit justification comment
- **DO NOT** cross-import from other context module repos (use `@freeside-collective/*` packages or Firestore)
- **DO NOT** initialize Firebase in context modules — use `@freeside-collective/firebase-common` singletons
- **DO NOT** use `pnpm install --frozen-lockfile` if workspace lockfile has drifted; CI uses `--no-frozen-lockfile`
