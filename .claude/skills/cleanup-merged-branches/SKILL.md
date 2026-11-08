---
name: cleanup-merged-branches
description: Delete local and remote git branches in rke-nextjs that have already been merged into develop or master (including merged Dependabot and feature branches), never touching master, develop, the current branch, or anything with unmerged work. Use when the user asks to clean up, prune, or delete merged/stale branches.
---

# Clean up merged branches (rke-nextjs)

Deletes branches whose work is already in `origin/develop` or `origin/master`.
It only uses **safe deletes**: never force-delete, never delete a branch with
commits not in either of those.

## 0. Protected: never delete

`master`, `develop`, the currently checked-out branch, any branch checked out
in another worktree (`git worktree list`), `release/*`, `gh-pages`, and any
branch with an **open** PR (`gh pr list --state open --json headRefName`).

## 1. Update refs

```
git fetch --prune origin
```

Don't check out or pull anything. Work from `origin/develop` and
`origin/master`.

## 2. Find merged branches

**Merged by ancestry** (the repo uses merge commits). A branch counts if it is
merged into `origin/develop` **or** `origin/master`:

```
git branch --merged origin/develop --format='%(refname:short)'
git branch --merged origin/master  --format='%(refname:short)'
git branch -r --merged origin/develop --format='%(refname:short)'
git branch -r --merged origin/master  --format='%(refname:short)'
```

**Merged but not ancestors** (squash/rebase merges), via GitHub:

```
gh pr list --state merged --base develop --limit 200 --json headRefName,headRefOid
gh pr list --state merged --base master  --limit 200 --json headRefName,headRefOid
```

Count the branch only if its current tip equals the PR's `headRefOid`; if it
has moved on, keep it.

Many old issue-number branches exist (e.g. `54-weather-detail-page`,
`65-upgrade-nextjs-version-to-13`, `amitrke-patch-*`). Treat them like any
other: delete only if merged per the rules above; list the rest as "kept:
unmerged" so the user can decide. Never delete a branch just for being old.

Drop everything protected, strip `origin/` from remote names, ignore
`origin/HEAD`.

## 3. Delete

Local: `git branch -d <branch>`. If it refuses, keep it and report. **Never
use `-D`.**

Remote (only branches from step 2 still on `origin`):

```
git push origin --delete <branch>
```

One at a time; report failures (e.g. branch protection) without retrying or
bypassing. No wildcards or bulk deletes.

If the current branch is merged, don't delete it or switch away; list it under
"kept".

## 4. Report

Local deleted, remote deleted, kept and why (open PR, checked out, unmerged
commits, tip moved after merge, delete refused), and failures. If nothing was
merged, say so. Finish with `git fetch --prune origin`.

Remote deletion can't be undone from here, though the commits remain reachable
from `develop`/`master` history and GitHub can restore a branch from its merged
PR page.
