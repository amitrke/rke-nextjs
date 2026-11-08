// Shared Sentry options for the browser, Node.js and Edge runtimes.
// With no NEXT_PUBLIC_SENTRY_DSN set (local dev, preview builds), Sentry is
// never initialised, so it adds no runtime work. See docs/error-monitoring.md.

export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

export const sentryBaseOptions = {
  dsn: SENTRY_DSN,
  enabled: Boolean(SENTRY_DSN),
  environment:
    process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV || process.env.NODE_ENV,
  // Keep performance tracing low to stay inside Sentry's free tier.
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
};
