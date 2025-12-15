// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
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