// Browser-side Sentry setup. Next.js loads this file before the app starts,
// so client-side crashes (e.g. in the post editor) are reported.
import * as Sentry from '@sentry/nextjs';
import { SENTRY_DSN, sentryBaseOptions } from './sentry.shared';

if (SENTRY_DSN) {
  Sentry.init({
    ...sentryBaseOptions,
    // Session replay stays off (no replayIntegration) to stay inside the free tier.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    ignoreErrors: [
      // Noise from browser extensions and benign layout warnings.
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
    ],
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
