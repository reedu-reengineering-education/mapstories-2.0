/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  eslint: {
    dirs: ['app', 'components', 'pages', 'lib', 'hooks'],
  },
  output: 'standalone',
}

module.exports = nextConfig
