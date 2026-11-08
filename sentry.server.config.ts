// Node.js-side Sentry setup (API routes, getStaticProps/ISR, getServerSideProps, SSR).
// Loaded from instrumentation.ts.
import * as Sentry from '@sentry/nextjs';
import { SENTRY_DSN, sentryBaseOptions } from './sentry.shared';

if (SENTRY_DSN) {
  Sentry.init(sentryBaseOptions);
}
