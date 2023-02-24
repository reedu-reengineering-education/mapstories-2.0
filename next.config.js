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
        hostname: 'localhost',
        port: '9000',
        pathname: '/mapstories20/**',
      }
    ],
  }
}

const removeImports = require('next-remove-imports')()
module.exports = removeImports({})
module.exports = nextConfig
