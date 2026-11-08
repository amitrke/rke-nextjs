import path from 'path';
import { fileURLToPath } from 'url';
import sentryNextjsConfig from '@sentry/nextjs/config';

const { withSentryConfig } = sentryNextjsConfig;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'play.google.com',
        pathname: '**',
      },
    ],
    minimumCacheTTL: 1500000
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },

  async redirects() {
    return [
      {
        source: '/users/:userid/profile',
        destination: '/user/:userid',
        permanent: true,
      },
      {
        source: '/album',
        destination: '/albums',
        permanent: true,
      },
      {
        // Legacy town pages, e.g. /town/education/iit-roorkee
        source: '/town/:category/:slug',
        destination: '/post/town/:slug',
        permanent: true,
      },
    ];
  },
}

const hasSentryAuthToken = Boolean(process.env.SENTRY_AUTH_TOKEN);

// Sentry error monitoring (see docs/error-monitoring.md). Runtime reporting only
// happens when NEXT_PUBLIC_SENTRY_DSN is set; source maps are only generated and
// uploaded when SENTRY_AUTH_TOKEN is set (with SENTRY_ORG / SENTRY_PROJECT).
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  telemetry: false,
  widenClientFileUpload: hasSentryAuthToken,
  sourcemaps: {
    disable: !hasSentryAuthToken,
  },
});
