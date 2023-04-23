/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  eslint: {
    dirs: ['src', 'lib', 'hooks'],
  },
  output: 'standalone',
  staticPageGenerationTimeout: 100,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

const removeImports = require('next-remove-imports')()

module.exports = removeImports({})
module.exports = nextConfig
