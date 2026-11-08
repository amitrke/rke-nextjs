import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

// Reports errors thrown while rendering pages, in API routes, in
// getServerSideProps, and in getStaticProps during ISR revalidation.
// A no-op when Sentry was not initialised (no DSN).
export const onRequestError = Sentry.captureRequestError;
