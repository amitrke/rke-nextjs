# Error Monitoring (Sentry + Discord alerts)

The site reports runtime errors to [Sentry](https://sentry.io) through `@sentry/nextjs`,
and Sentry posts an alert to Discord when a new error appears or an old one comes back.

Until the env vars below are set, Sentry is **off**: nothing is initialised and nothing is sent,
so local dev and preview builds behave exactly as before.

## What is covered

| Where the error happens | How it is captured | File |
| --- | --- | --- |
| Browser (React render errors, event handlers, unhandled promise rejections) | Sentry browser SDK global handlers + `_error` page | `instrumentation-client.ts`, `pages/_error.tsx` |
| API routes (`pages/api/*`) | Next.js `onRequestError` hook | `instrumentation.ts` |
| SSR / `getServerSideProps` | `onRequestError` + `_error` page | `instrumentation.ts`, `pages/_error.tsx` |
| `getStaticProps` during ISR revalidation | `onRequestError` | `instrumentation.ts` |
| Edge runtime (middleware, if added later) | Edge SDK | `sentry.edge.config.ts` |

Errors in `getStaticProps` at **build time** fail the Vercel deployment instead, and Vercel already
emails you about failed deployments.

Shared options live in `sentry.shared.ts`:

- `tracesSampleRate: 0.1`: only 10% of requests get performance traces (free tier friendly).
- Session Replay is **off**.
- `sendDefaultPii: false`: no IP addresses or cookies are sent.
- `environment` comes from Vercel's `VERCEL_ENV` (`production`, `preview`, `development`).

## 1. Create the Sentry project

1. Sign up or log in at <https://sentry.io> (the free "Developer" plan is enough).
2. **Projects → Create Project**, pick platform **Next.js**, name it e.g. `roorkee-web`.
   Skip the setup wizard; the code is already in this repo.
3. Copy the **DSN** from **Project Settings → Client Keys (DSN)**. It looks like
   `https://<key>@o<org-id>.ingest.<region>.sentry.io/<project-id>`.
   The DSN is safe to expose in the browser; it can only send events.
4. Note your **organization slug** (Settings → General) and **project slug**.

### Optional: readable stack traces (source maps)

Without source maps, browser stack traces point to minified code. To upload them at build time:

1. **Settings → Developer Settings → Organization Tokens → Create New Token**
   (or a User Auth Token with `project:releases` and `org:read` scopes).
2. Add `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` and `SENTRY_PROJECT` to Vercel (below).

If `SENTRY_AUTH_TOKEN` is not set, no source maps are generated or uploaded and the build is unchanged.

## 2. Set the environment variables in Vercel

Vercel dashboard → the rke-nextjs project → **Settings → Environment Variables**:

| Name | Value | Environments |
| --- | --- | --- |
| `NEXT_PUBLIC_SENTRY_DSN` | the DSN from step 1 | **Production** (add Preview too if you want preview errors) |
| `SENTRY_AUTH_TOKEN` | auth token (optional, source maps) | Production |
| `SENTRY_ORG` | organization slug | Production |
| `SENTRY_PROJECT` | project slug | Production |

Also check **Settings → Environment Variables → Automatically expose System Environment Variables**
is enabled (the default), so the browser can tag events with `NEXT_PUBLIC_VERCEL_ENV`.

`NEXT_PUBLIC_*` values are inlined at build time, so **redeploy** `master` after adding them
(Deployments → latest production deployment → ⋯ → Redeploy).

For local testing, put `NEXT_PUBLIC_SENTRY_DSN=...` in `.env.local` and run `yarn dev`.
Remove it again afterwards so local errors don't create alerts.

## 3. Send alerts to Discord

Use Sentry's built-in Discord integration.

1. In Sentry: **Settings → Integrations → Discord → Add Installation**. Authorise the Sentry bot
   for your Discord server (you need "Manage Server" permission there).
2. In Discord, create a channel such as `#site-errors`. Enable **Developer Mode**
   (User Settings → Advanced), right-click the channel → **Copy Channel ID**.
3. In Sentry: **Alerts → Create Alert → Issues**, project `roorkee-web`, environment `production`:
   - **When** (any of): "A new issue is created", "The issue changes state from resolved to
     unresolved" (regression), "The issue changes state from archived to escalating".
   - **Then**: "Send a notification to the Discord server" → pick your server, paste the channel ID.
   - **Action interval**: 5 minutes (or longer if it gets noisy).
   - Name it e.g. `New or regressed errors → Discord` and save.

A plain Discord *webhook URL* won't work directly: Sentry's generic WebHooks integration sends its
own JSON, which Discord rejects. If you can't add the bot, the default Sentry email alerts for new
issues are the fallback (Settings → Account → Notifications → Issue Alerts).

### Test it

After deploying with the DSN set, open the site, then in the browser console run:

```js
setTimeout(() => { throw new Error('Sentry test from roorkee.org'); });
```

The error should appear in Sentry → Issues within a minute, and a Discord message should follow.
Resolve the test issue in Sentry afterwards.

## Free tier notes

- The Developer plan includes 5k errors/month. If a single bug floods the quota, use
  **Issue → ⋯ → Archive / Ignore** or add a pattern to `ignoreErrors` in `instrumentation-client.ts`.
- To cut traces entirely, set `tracesSampleRate` to `0` in `sentry.shared.ts`.
