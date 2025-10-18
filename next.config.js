/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['127.0.0.1', 'single-fire.s3.ap-northeast-2.amazonaws.com', '192.168.0.145'],
  },
};

module.exports = nextConfig;
