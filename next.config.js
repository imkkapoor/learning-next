/** @type {import('next').NextConfig} */

// to allow aws url as a valid source
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'vinayak-nextjs-demo-users-image.s3.us-east-2.amazonaws.com',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };

module.exports = nextConfig
