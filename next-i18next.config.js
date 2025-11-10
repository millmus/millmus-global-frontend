const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja', 'zh'],
    localeDetection: false, // URL 기반 라우팅 사용
  },
  // Vercel 배포 환경을 위한 명시적 경로 설정
  localePath: path.resolve('./public/locales'),
  fallbackLng: {
    'ja': ['en'],
    'zh': ['en'],
    'default': ['en'],
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
