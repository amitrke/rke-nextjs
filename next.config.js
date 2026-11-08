// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { withSentryConfig } = require('@sentry/nextjs/config');

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
    ];
  },
}

const hasSentryAuthToken = Boolean(process.env.SENTRY_AUTH_TOKEN);

// Sentry error monitoring (see docs/error-monitoring.md). Runtime reporting only
// happens when NEXT_PUBLIC_SENTRY_DSN is set; source maps are only generated and
// uploaded when SENTRY_AUTH_TOKEN is set (with SENTRY_ORG / SENTRY_PROJECT).
module.exports = withSentryConfig(nextConfig, {
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
