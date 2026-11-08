---
name: fix-failing-actions
description: Look through the most recent GitHub Actions runs for rke-nextjs, diagnose the failing ones, and fix the ones whose cause is in the repo (TypeScript, lint, lockfile, workflow config) on a branch with a PR. Use when the user asks to check CI, look at failing workflows/actions/builds, or fix broken pipelines.
---

# Diagnose and fix failing GitHub Actions runs (rke-nextjs)

Workflows in `.github/workflows/`: `typecheck.yml` (`npx tsc --noEmit`, PRs and
pushes to `master`/`develop`), `eslint.yml` (ESLint → SARIF, `master`), and
`codeql-analysis.yml`. Vercel builds/deploys separately (not in Actions). Find
real failures, fix what's fixable from the repo, and clearly report the rest.

## 1. Find recent failures

```
gh run list --limit 40 --json databaseId,workflowName,displayTitle,headBranch,event,conclusion,status,createdAt,url
```

Keep `failure` / `timed_out`. Ignore `cancelled`, `skipped`, in-progress. Then
**dedupe**: for each (workflow, branch) only the newest run matters. If a newer
run of the same workflow/branch succeeded, say it's already resolved and skip.

## 2. Diagnose each remaining failure

```
gh run view <id> --json jobs -q '.jobs[] | select(.conclusion=="failure") | {name, steps: [.steps[] | select(.conclusion=="failure") | .name]}'
gh run view <id> --log-failed | tail -n 80
```

Find the failing step and the real error line (yarn/npm `warn` lines are
noise). Classify:

- **Fixable in the repo**: TypeScript errors, ESLint errors, `yarn.lock` out of
  sync with `package.json` (`--frozen-lockfile` failure), broken workflow YAML,
  wrong Node version or paths.
- **Dependabot PR broken by the bump itself** (e.g. React/Next major with
  incompatible types or peers): not a repo bug. Report it and recommend
  holding/closing; don't hand-edit Dependabot branches. Note react/react-dom
  and next/eslint-config-next are grouped, so they should move together.
- **Infra / transient**: registry outages, runner failures, timeouts. Suggest
  `gh run rerun <id> --failed`; only rerun if the user says so.
- **Needs secrets or the user's accounts**: missing/expired secrets, Vercel or
  Firebase auth. Don't work around it; report what the user must refresh.
  Never print or add secret values.

## 3. Reproduce locally before fixing

Check out the failing ref and run what the workflow runs (confirm against the
workflow file, which is authoritative):

```
yarn install --frozen-lockfile
npx tsc --noEmit        # typecheck.yml
npx eslint .            # eslint.yml
```

**Do not run `yarn build`** unless the user asks (resource-intensive; none of
the Actions workflows need it). Confirm the failure reproduces, make the
smallest fix, re-run the same commands. If it won't reproduce, say so rather
than guess.

## 4. Ship fixes safely

- Never commit directly to `master` or `develop`, and never touch a Dependabot
  branch. Branch off the failing branch's base (normally `develop`):
  `git checkout -b fix/ci-<short-description> origin/develop`.
- If the failure is on a feature branch the user owns, fix there after telling
  them.
- Don't weaken CI to get green: no removing checks, `continue-on-error`,
  loosened lint rules, or `// @ts-ignore` blanket fixes unless explicitly asked.
- Commit and open the PR via the `commit-push-pr` skill (emoji commit message,
  base `develop`). One PR per distinct root cause.

## 5. Report

Table of failures: workflow, branch, run link, cause, outcome (fixed in PR link
/ needs user action / transient, rerun suggested / Dependabot bump
incompatible / already resolved). Don't claim a fix works until local
reproduction passes, and say CI on the PR still has to confirm it.
