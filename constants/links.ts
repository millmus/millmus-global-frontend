/**
 * 외부 링크 상수
 * 법적 문서 및 전체 사이트에서 사용되는 외부 링크를 중앙 관리
 */

export const EXTERNAL_LINKS = {
  // 정부 기관
  kisa: {
    privacy: 'http://privacy.kisa.or.kr',
    phone: '118',
  },
  police: {
    cyber: 'http://cyberbureau.police.go.kr',
    phone: '182',
  },
  prosecution: {
    cyber: 'http://spo.go.kr',
    phone: '02-3480-3570',
  },
  kopico: {
    url: 'http://www.kopico.go.kr',
    phone: '1833-6972',
  },

  // 내부 링크
  internal: {
    termsOfService: '/terms-of-service',
    privacyPolicy: '/privacy-policy',
    refundPolicy: '/refund-policy',
  },
} as const;
