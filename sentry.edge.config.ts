// Edge-runtime Sentry setup (middleware / edge routes, if any are added).
// Loaded from instrumentation.ts.
import * as Sentry from '@sentry/nextjs';
import { SENTRY_DSN, sentryBaseOptions } from './sentry.shared';

if (SENTRY_DSN) {
  Sentry.init(sentryBaseOptions);
}
