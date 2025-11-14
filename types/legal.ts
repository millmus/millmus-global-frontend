/**
 * 법적 문서 관련 TypeScript 타입 정의
 */

/**
 * 기본 법적 문서 구조
 */
export interface LegalDocument {
  pageTitle: string;
  pageDescription: string;
  effectiveDate: string;
  sections: LegalSection[];
}

/**
 * 법적 문서 섹션
 */
export interface LegalSection {
  title: string;
  content?: string;
  items?: string[];
  subsections?: LegalSubsection[];
}

/**
 * 법적 문서 하위 섹션
 */
export interface LegalSubsection {
  title?: string;
  content: string;
}

/**
 * 이용약관 문서 구조
 */
export interface TermsOfService extends LegalDocument {
  intro: string;
  articles: TermsArticle[];
}

/**
 * 이용약관 조항
 */
export interface TermsArticle {
  number: number;
  title: string;
  content: string[];
  subsections?: TermsSubsection[];
}

/**
 * 이용약관 하위 조항
 */
export interface TermsSubsection {
  number?: string;
  content: string;
}

/**
 * 환불정책 문서 구조
 */
export interface RefundPolicy extends LegalDocument {
  premiumClassGuidelines: string[];
  offlineRefund: RefundSection;
  onlineRefund: RefundSection;
  vodRefund: RefundSection;
}

/**
 * 환불정책 섹션
 */
export interface RefundSection {
  title: string;
  items: string[];
}

/**
 * 개인정보처리방침 문서 구조
 */
export interface PrivacyPolicy extends LegalDocument {
  articles: PrivacyArticle[];
  responsiblePerson: ResponsiblePerson;
  externalAuthorities: ExternalAuthority[];
}

/**
 * 개인정보처리방침 조항
 */
export interface PrivacyArticle {
  number: number;
  title: string;
  content: string[];
  table?: PrivacyTable;
}

/**
 * 개인정보 수집 항목 테이블
 */
export interface PrivacyTable {
  headers: string[];
  rows: PrivacyTableRow[];
}

/**
 * 개인정보 테이블 행
 */
export interface PrivacyTableRow {
  category: string;
  collectTime: string;
  items: string;
  purpose: string;
  retention: string;
}

/**
 * 개인정보보호 책임자
 */
export interface ResponsiblePerson {
  name: string;
  title: string;
  contact: string;
}

/**
 * 외부 감독기관
 */
export interface ExternalAuthority {
  name: string;
  url: string;
  phone: string;
}

/**
 * 법적 문서 번역 키 타입
 */
export type LegalDocumentKey =
  | 'pageTitle'
  | 'pageDescription'
  | 'effectiveDate'
  | `section${number}Title`
  | `section${number}Content`
  | `section${number}Item${number}`
  | `article${number}Title`
  | `article${number}Content`;

/**
 * 로케일 타입
 */
export type Locale = 'ko' | 'en' | 'ja' | 'zh';

/**
 * 법적 문서 타입
 */
export type LegalDocumentType = 'terms' | 'refund' | 'privacy';
