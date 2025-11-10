module.exports = {
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en', 'ja', 'zh'],
    localeDetection: false, // URL 기반 라우팅 사용
  },
  fallbackLng: {
    'en': ['ko'],
    'ja': ['ko'],
    'zh': ['ko'],
    'default': ['ko'],
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
