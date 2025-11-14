/**
 * 날짜 포맷 유틸리티
 * 다국어 환경에서 날짜를 로케일에 맞게 포맷팅
 */

/**
 * 로케일에 맞춰 법적 문서용 날짜 포맷팅
 * @param date - 포맷팅할 날짜 객체
 * @param locale - 로케일 (ko, en, ja, zh)
 * @returns 포맷팅된 날짜 문자열
 */
export const formatLegalDate = (date: Date, locale: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // 로케일별 매핑
  const localeMap: Record<string, string> = {
    ko: 'ko-KR',
    en: 'en-US',
    ja: 'ja-JP',
    zh: 'zh-CN',
  };

  const mappedLocale = localeMap[locale] || 'ko-KR';

  return new Intl.DateTimeFormat(mappedLocale, options).format(date);
};

/**
 * 주요 법적 문서 시행일자
 */
export const EFFECTIVE_DATES = {
  terms: new Date('2022-04-30'),
  privacy: new Date('2022-04-30'),
  refund: new Date('2022-04-30'),
} as const;

/**
 * 로케일에 맞춰 시행일자 문구 생성
 * @param date - 시행일자
 * @param locale - 로케일
 * @returns 완전한 시행일자 문구
 */
export const formatEffectiveDatePhrase = (
  date: Date,
  locale: string
): string => {
  const formattedDate = formatLegalDate(date, locale);

  const prefixes: Record<string, string> = {
    ko: '본 약관은 ',
    en: 'This policy is effective from ',
    ja: '本方針は',
    zh: '本政策自',
  };

  const suffixes: Record<string, string> = {
    ko: '부터 적용됩니다.',
    en: '.',
    ja: 'から適用されます。',
    zh: '起適用。',
  };

  const prefix = prefixes[locale] || prefixes.ko;
  const suffix = suffixes[locale] || suffixes.ko;

  return `${prefix}${formattedDate}${suffix}`;
};
