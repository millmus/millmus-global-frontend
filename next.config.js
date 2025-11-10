/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['127.0.0.1', 'single-fire.s3.ap-northeast-2.amazonaws.com', '192.168.0.145'],
  },
  i18n,
};

module.exports = nextConfig;
