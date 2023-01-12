/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  eslint: {
    dirs: ['app', 'components', 'pages', 'lib', 'hooks'],
  },
  output: 'standalone',
}

module.exports = nextConfig
