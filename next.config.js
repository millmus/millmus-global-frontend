/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['millmus-global-backend-storage.s3.ap-northeast-2.amazonaws.com', '127.0.0.1', 'localhost', 'single-fire.s3.ap-northeast-2.amazonaws.com', '192.168.0.145'],
  },
  i18n,
  // 환경변수 명시적 노출 (Vercel 빌드 시 필요)
  env: {
    NEXT_PUBLIC_MERCHANT_ID: process.env.NEXT_PUBLIC_MERCHANT_ID,
    NEXT_PUBLIC_PG: process.env.NEXT_PUBLIC_PG,
    NEXT_PUBLIC_CHANNEL_KEY: process.env.NEXT_PUBLIC_CHANNEL_KEY,
    NEXT_PUBLIC_PASS_PG: process.env.NEXT_PUBLIC_PASS_PG,
    NEXT_PUBLIC_PASS_CHANNEL_KEY: process.env.NEXT_PUBLIC_PASS_CHANNEL_KEY,
    NEXT_PUBLIC_PAYPAL_CHANNEL_KEY: process.env.NEXT_PUBLIC_PAYPAL_CHANNEL_KEY,
    NEXT_PUBLIC_PAYPAL_CURRENCY: process.env.NEXT_PUBLIC_PAYPAL_CURRENCY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // jsonwebtoken 호환성 문제 해결
      config.externals = config.externals || [];
      config.externals.push('jsonwebtoken');
    }
    return config;
  },
};

module.exports = nextConfig;
