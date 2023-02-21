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
}

const removeImports = require('next-remove-imports')()

module.exports = removeImports({})
module.exports = nextConfig
