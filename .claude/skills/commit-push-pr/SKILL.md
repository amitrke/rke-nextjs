---
name: commit-push-pr
description: Commit the current changes, push the branch, and open a pull request following Roorkee.org's conventions (emoji-prefixed commit messages, feature-branch → develop → master flow, gh pr create with a Summary/Test plan body). Use whenever the user asks to commit, push, ship, or open a PR for work in rke-nextjs.
---

# Commit, push, and open a PR (rke-nextjs)

Use this whenever the user asks to commit work, push a branch, "ship" a change,
or open a pull request. Push and PR creation are visible to others, so don't
skip the confirmation gate in step 4.

## 1. Assess state first

Run in parallel:
- `git status` (never `-uall`)
- `git diff` (unstaged) and `git diff --staged`
- `git log --oneline -15` to match the current message style

Commit messages use a **gitmoji prefix** (see
https://gist.github.com/parmentf/035de27d6ed1dce0b36a), then an imperative
summary, e.g. `🐛 Show the newest news on the homepage`, `✨ Add album search`,
`🔧 Group react and next.js Dependabot updates`, `📝 Update docs`,
`♻️ Refactor PostService`. Use the emoji character, not the `:code:`.

Confirm nothing unexpected is staged (`.env.local`, secrets, `.next/`,
`node_modules/`). If a broad `git add` pulled in files you didn't expect, stop
and check them.

## 2. Pick the right branch

Branch model:
- Feature/fix work → its own branch → **PR into `develop`** (deploys to
  https://preview.roorkee.org via Vercel).
- Once verified on preview → **PR `develop` into `master`** → production
  (https://www.roorkee.org).

So:
- **On `master`**: stop. Never commit or push here directly. Ask the user.
- **On `develop` with ordinary feature/fix changes**: create a branch first,
  `git checkout -b <type>/<short-kebab-description>` (e.g.
  `fix/homepage-news-order`), then commit there.
- **On a feature branch already**: commit there.
- **Deliberate `develop` → `master` release PR**: stay on `develop`; the PR base
  is `master`.

If it's unclear which applies, ask rather than guess.

## 3. Commit

- Stage specific files by name. Avoid `git add -A` / `git add .`.
- Focus the message on *why*, not a restatement of the diff.
- Only commit when the user asked (or asked for the full commit→push→PR flow).
- End the message with the attribution trailer given in the session's
  system-reminder (if one is present).
- Never use `--no-verify`, never `--amend` unless asked. If a hook fails, fix
  the cause and make a new commit.
- Don't run `yarn build` just to verify (it's resource-intensive and only for
  explicit requests). `npx tsc --noEmit` and `yarn lint:fix` are the cheap
  checks that mirror CI.

## 4. Confirm before pushing

Show the user the branch, target base, and commit summary, and get an explicit
go-ahead, unless they already asked for the full commit→push→PR flow in the
triggering message, in which case proceed and narrate.

## 5. Push

```
git push -u origin <branch>
```

Never force-push without explicit instruction, and never force-push to
`master`/`develop`.

## 6. Open the PR

```
gh pr create --base <develop-or-master> --title "<emoji summary>" --body "$(cat <<'EOF'
## Summary
- <1-3 bullets: what changed and why>

## Test plan
- [ ] <how this was/should be verified>
EOF
)"
```

- Default base is `develop`; use `master` only for a deliberate release PR or
  when the user names it.
- Base the Summary on the whole diff, not just the latest commit.
- Append the PR-description attribution line from the session's
  system-reminder, if present.
- Return the PR URL.

## Worth mentioning when relevant

- CI on PRs: `typecheck.yml` (`npx tsc --noEmit`, on PRs to `master`/`develop`),
  `eslint.yml` and `codeql-analysis.yml` (PRs to `master`). Vercel also builds a
  preview for each PR.
- Firebase Functions live in a separate project (`rke-firebase-functions`) and
  deploy from their own pipeline, so a change here doesn't ship them.
