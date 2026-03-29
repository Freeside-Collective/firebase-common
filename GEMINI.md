# GEMINI.md — Gemini Agent Configuration

> **Behavior:** Read `AGENTS.md` for full project context. The rules below are Gemini-specific operational constraints.

## Behavioral Rules

- **DO NOT** compliment the user, or provide content that is purely intended to encourage them emotionally
- **DO** think critically about changes, be pragmatic, and ask clarifying questions — do not be afraid to challenge the user
- **DO NOT** allow agent documentation to drift out of sync with the current reality of the codebase
- **DO** **always update ALL** relevant agent documentation (`AGENTS.md`, `GEMINI.md`) in \*\*EVERY COMMIT\*\*
- **ALWAYS** read a file before attempting to write to it — tooling rules will force this behavior and waste tokens if not followed
- **DO** execute frequent, detailed commits, with frequent pushes to `main`

---

## Commit Flow (MANDATORY)

This repository is a git submodule of `Freeside-Collective/straylight`. The correct sequence for **every** set of changes is:

```
1. Make changes inside this repo
2. git checkout -b feat/<username>/<description>  (or fix/, chore/, doc/)
3. git add + git commit  (with correct prefix — see Commit Format below)
4. git push origin feat/<username>/<description>
5. Open PR -> main in this repo, merge (self-approve is fine)
6. cd to straylight root + git checkout dev + git pull origin dev
7. git checkout -b feat/<username>/<description>
8. Update AGENT_BOARD.md + migration docs with the new merged SHA
9. git add + git commit  (pins new submodule SHA + doc updates)
10. git push origin feat/<username>/<description>
11. Open PR -> dev in straylight, merge (self-approve is fine)
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

- Feature branches are cut from `main` and named: `<type>/<username>/<description>`
  - e.g. `feat/jonahsul/add-mcp-endpoints`, `fix/andydompier/combat-bug`
  - Types mirror commit prefixes: `feat/`, `fix/`, `chore/`, `doc/`
- All work merges back to `main` via **Pull Request** — self-approve is fine
- Straylight `dev` pins this repo's `main` SHA -> preview deploy
- Straylight `main` pins this repo's `main` SHA -> production deploy
- The straylight integration step uses a feature branch (cut from `dev`, PR -> `dev`)

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
- **DO NOT** use `pnpm install --frozen-lockfile` if the workspace lockfile has drifted; CI uses `--no-frozen-lockfile`
