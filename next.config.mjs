/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
    ],
  },
  // CI will handle eslint and typescript errors
  eslint: {
    ignoreDuringBuilds: true, // Disable eslint during build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors
  }
};

export default nextConfig;
