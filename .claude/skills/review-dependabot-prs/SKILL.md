---
name: review-dependabot-prs
description: Triage open Dependabot pull requests for rke-nextjs and automatically merge every one that is not failing its PR checks (into develop), without asking per PR. Use whenever the user asks to review, triage, process, clear, or merge dependabot PRs or dependency updates in this repo.
---

# Triage and auto-merge Dependabot PRs (rke-nextjs)

Dependabot (`.github/dependabot.yml`) runs weekly for npm (`/`, target
**`develop`**, react/react-dom/@types and next/eslint-config-next grouped) and
for GitHub Actions. Policy: **merge everything that is not failing the checks
that run on PR creation.** No per-PR confirmation, and bump size (including
major) is not a reason to hold. Merging to `develop` only updates
https://preview.roorkee.org; production changes when `develop` is merged to
`master`.

## 1. List open Dependabot PRs

```
gh pr list --author "app/dependabot" --state open --limit 50 \
  --json number,title,baseRefName,mergeable,mergeStateStatus,statusCheckRollup,url
```

If none, say so and stop. The GitHub Actions ecosystem has no `target-branch`,
and security updates go to the default branch, so those PRs may target
`master`. **Retarget any PR whose base is `master` to `develop`** before
classifying, one at a time:

```
gh pr edit <n> --base develop
gh pr comment <n> --body "@dependabot rebase"
```

Never merge a Dependabot PR into `master`. Changing the base does not re-run
the checks, so the existing results are stale (they were run against `master`);
the `@dependabot rebase` rebuilds the branch on `develop` and triggers fresh
checks. Report retargeted PRs as pending this run, and they are classified
and merged normally on the next run. Skip and report any PR whose base is neither `develop` nor
`master`.

## 2. Classify each PR from `statusCheckRollup`

- **Failing**: any `CheckRun` with `FAILURE`, `TIMED_OUT`, `CANCELLED`,
  `ACTION_REQUIRED`, or a `StatusContext` with `FAILURE`/`ERROR` (this includes
  the Vercel preview build). **Don't merge.** Find the cause
  (`gh pr checks <n>`, `gh run view <run-id> --log-failed`) and report it in
  one line.
- **Pending**: any check not `COMPLETED`, or `mergeable` is `UNKNOWN`. Don't
  merge; report and suggest re-running the skill shortly. No polling/sleeping.
- **Conflicting**: `mergeable` is `CONFLICTING`. Don't merge; comment
  `@dependabot rebase` (`gh pr comment <n> --body "@dependabot rebase"`) and
  report.
- **Not failing**: every check is `SUCCESS`, `SKIPPED`, or `NEUTRAL` and the PR
  is `MERGEABLE`. **Merge.**

A PR with zero checks reported is pending, not passing.

## 3. Merge

```
gh pr merge <n> --merge
```

Use `--merge` (history uses merge commits, e.g. "Merge pull request #600
from ..."). Never use `--admin` to bypass failing or missing checks.

Merge one at a time. After each, re-check the rest with
`gh pr view <n> --json mergeable,mergeStateStatus`; PRs touching `yarn.lock`
commonly turn conflicting, so give those `@dependabot rebase` and leave them for
the next run.

## 4. Report

Short table: merged (number, package, from→to), failing (cause), pending,
conflicting/awaiting rebase, retargeted from `master`, skipped (other base). Call out merged
**major bumps** and any of `next`, `react`, `react-dom`, `firebase`,
`firebase-admin`, or `draft-js`/`react-draft-wysiwyg`, so the user can sanity
check the preview deploy before promoting to `master`. Also flag a lone
react or react-dom bump merged without its pair, since they must stay on the
same version.

Don't close PRs or comment `@dependabot ignore` unless asked.
