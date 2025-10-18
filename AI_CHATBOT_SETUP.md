# AI 챗봇 기능 설정 가이드

## 구현 완료 사항

1. **AI 챗봇 버튼 컴포넌트** (`/components/chat/AIChatButton.tsx`)
   - 화면 우측 하단에 고정된 플로팅 버튼
   - 프로젝트의 주요 색상인 `#00e7ff` 사용
   - 호버 시 애니메이션 효과

2. **챗봇 모달 컴포넌트** (`/components/chat/AIChatModal.tsx`)
   - 프로젝트의 모달 패턴을 따른 디자인
   - 실시간 채팅 인터페이스
   - 메시지 전송 및 응답 표시
   - 로딩 애니메이션

3. **Gemini AI API 통합** (`/pages/api/chat/gemini.ts`)
   - Google Gemini AI API 연동
   - 한국어 응답 최적화
   - 에러 처리 및 사용자 친화적 메시지

## 설치 방법

### 1. 필요한 패키지 설치

```bash
npm install @google/generative-ai
```

### 2. Gemini API 키 발급

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에 접속
2. Google 계정으로 로그인
3. "Get API key" 클릭
4. 새 API 키 생성

### 3. 환경 변수 설정

`.env` 파일에 다음 내용 추가:

```env
GEMINI_API_KEY=발급받은_API_키_입력
```

## 사용 방법

1. 개발 서버 실행:
   ```bash
   npm run dev
   ```

2. 브라우저에서 프로젝트 열기

3. 화면 우측 하단의 채팅 버튼 클릭

4. 모달창에서 AI와 대화 시작

## 주요 기능

- **실시간 대화**: 사용자 질문에 대한 즉각적인 AI 응답
- **한국어 최적화**: 밀머스 플랫폼에 맞춘 한국어 응답
- **사용자 친화적 UI**: 프로젝트의 디자인 시스템과 일관된 인터페이스
- **에러 처리**: 네트워크 오류 시 사용자 친화적 메시지 표시

## 커스터마이징

### AI 응답 컨텍스트 변경

`/pages/api/chat/gemini.ts` 파일의 `context` 변수를 수정하여 AI의 응답 스타일을 변경할 수 있습니다:

```typescript
const context = `당신은 밀머스(밀레니얼머니스쿨) 교육 플랫폼의 친절한 AI 도우미입니다...`;
```

### 디자인 커스터마이징

- 버튼 위치: `/components/chat/AIChatButton.tsx`의 `fixed bottom-6 right-6` 클래스 수정
- 색상 변경: `bg-[#00e7ff]`를 원하는 색상으로 변경
- 모달 크기: `/components/chat/AIChatModal.tsx`의 `max-w-2xl h-[600px]` 수정

## 문제 해결

### API 키 오류
- `.env` 파일의 `GEMINI_API_KEY`가 올바르게 설정되었는지 확인
- 서버를 재시작하여 환경 변수 다시 로드

### 응답이 없는 경우
- 브라우저 콘솔에서 에러 메시지 확인
- 네트워크 연결 상태 확인
- API 사용량 제한 확인

## 보안 주의사항

- `GEMINI_API_KEY`는 절대 GitHub에 커밋하지 마세요
- `.env` 파일이 `.gitignore`에 포함되어 있는지 확인하세요
- 프로덕션 환경에서는 API 키를 환경 변수로 안전하게 관리하세요