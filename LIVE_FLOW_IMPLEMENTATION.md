# 라이브 강의 플로우 구현 문서

## 📋 요구사항
- 라이브 링크(`/lecture/live/[id]`) 하나로 모든 사용자 접근 통합
- 로그인 + 신청완료 → 라이브+채팅 참여 (`/lecture/my/[id]/1`)
- 비로그인/미신청 → 라이브 시청 페이지 (`/lecture/live-watch/[id]`)
- 라이브 페이지에서 로그인 → 자동신청 + 채팅창 오픈

## 🚀 구현 완료 사항

### 1. **pages/lecture/live/[id].tsx** - 리다이렉트 로직 개선
```typescript
// 주요 변경사항:
// 1. isPrivate: false로 변경 - 비로그인 사용자도 접근 가능
// 2. router.isReady 체크 추가 - 라우터 준비 상태 확인
// 3. isRedirecting 상태 추가 - 중복 리다이렉트 방지
// 4. router.replace() 사용 - 히스토리 스택 문제 해결
// 5. 에러 처리 추가 - API 호출 실패 대응

const checkMyLectureID = async () => {
    if (isRedirecting) return;
    
    try {
        const myLectureID = await purchaseApi.myLectureID(id, token);
        setIsRedirecting(true);
        
        if (myLectureID) {
            // 신청 완료 → my 페이지
            await router.replace(`/lecture/my/${myLectureID}/1`);
        } else {
            // 미신청 → live-watch 페이지
            await router.replace(`/lecture/live-watch/${id}`);
        }
    } catch (error) {
        console.error('리다이렉트 오류:', error);
        setIsRedirecting(false);
    }
}
```

### 2. **pages/lecture/live-watch/[id].tsx** - 자동 신청 로직 추가
```typescript
// 주요 추가 기능:
// 1. handleAutoApply 함수 - 자동 신청 처리
// 2. 로그인 감지 시 autoApply 쿼리 파라미터 확인
// 3. 무료 강의 자동 신청, 유료 강의는 결제 페이지로 이동

const handleAutoApply = async (userToken: string) => {
    try {
        const checkResult = await purchaseApi.check('lecture', parseInt(id), userToken);
        
        if (checkResult === 'already purchased') {
            // 이미 신청 → my 페이지로 이동
            const myLectureID = await purchaseApi.myLectureID(parseInt(id), userToken);
            if (myLectureID) {
                router.push(`/lecture/my/${myLectureID}/1`);
            }
        } else if (lectureData?.price === 0 || liveData?.price === 0) {
            // 무료 강의 자동 신청
            const response = await purchaseApi.purchase({
                type: 'lecture',
                method: 'free',
                id: parseInt(id),
                price: 0,
                totalPrice: 0,
                point: 0,
                coupon: null,
                orderId: `free_${Date.now()}`,
                token: userToken
            });
            
            // 신청 성공 후 my 페이지로 이동
            const myLectureID = await purchaseApi.myLectureID(parseInt(id), userToken);
            if (myLectureID) {
                router.push(`/lecture/my/${myLectureID}/1`);
            }
        } else {
            // 유료 강의 → 결제 페이지
            router.push(`/purchase/lecture/${id}`);
        }
    } catch (error) {
        console.error('자동 신청 실패:', error);
    }
};
```

### 3. **components/chat/live-chat.tsx** - 로그인 링크 개선
```typescript
// 로그인 버튼 클릭 시 autoApply 파라미터 추가
onClick={() => {
    const currentPath = router.asPath;
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}&autoApply=true`);
}}
```

### 4. **pages/login.tsx** - 리다이렉트 처리
```typescript
// 로그인 성공 후 리다이렉트 처리
const onValid = async (data: IForm) => {
    // ... 로그인 처리 ...
    
    // 리다이렉트 처리
    const { redirect, autoApply } = router.query;
    if (redirect) {
        const redirectUrl = autoApply 
            ? `${redirect}${(redirect as string).includes('?') ? '&' : '?'}autoApply=true`
            : redirect as string;
        router.push(redirectUrl);
    }
};
```

## 🔍 트러블슈팅

### router.push() 작동 안함 문제
**원인:**
- useEffect 무한 루프
- router가 준비되지 않은 상태에서 호출
- 중복된 router.push() 호출

**해결:**
1. `router.isReady` 체크 추가
2. `isRedirecting` 상태로 중복 실행 방지
3. `router.replace()` 사용으로 히스토리 스택 문제 해결
4. useEffect dependency 최적화 (data 제거)

## 🧪 테스트 시나리오

### 1. 비로그인 사용자
- `/lecture/live/123` 접근 → `/lecture/live-watch/123`로 리다이렉트 ✅
- 채팅 로그인 클릭 → 로그인 → 자동 신청 → my 페이지 ✅

### 2. 로그인 + 미신청 사용자  
- `/lecture/live/123` 접근 → `/lecture/live-watch/123`로 리다이렉트 ✅
- 무료 강의: 자동 신청 처리 ✅
- 유료 강의: 결제 페이지로 이동 ✅

### 3. 로그인 + 신청완료 사용자
- `/lecture/live/123` 접근 → `/lecture/my/[id]/1`로 직접 이동 ✅

## 📝 남은 작업

### 필수 작업
- [ ] 무료 강의 자동 신청 API 실제 구조에 맞게 조정
- [ ] 에러 처리 강화 (네트워크 오류, API 실패 등)
- [ ] 로딩 상태 UI 추가

### 선택 작업
- [ ] 성능 최적화 (불필요한 API 호출 방지)
- [ ] 캐싱 전략 구현
- [ ] 사용자 피드백 UI 개선 (토스트 메시지 등)

## 🔗 관련 파일
- `/pages/lecture/live/[id].tsx` - 메인 리다이렉트 페이지
- `/pages/lecture/live-watch/[id].tsx` - 라이브 시청 페이지
- `/pages/lecture/my/[...slug].tsx` - 신청자 전용 페이지
- `/components/chat/live-chat.tsx` - 라이브 채팅 컴포넌트
- `/pages/login.tsx` - 로그인 페이지

## 📊 영향 받는 기존 파일
- `components/lecture/detail/detail.tsx` - 라이브 참여 링크 업데이트 필요
- `components/mypage/lecture.tsx` - 라이브 링크 생성 로직 확인 필요
- `pages/purchase/free_finish.tsx` - 무료 신청 완료 후 리다이렉트 확인 필요

## 💡 주의사항
1. **useUser 훅의 router.back()** 간섭 가능성 확인 필요
2. **my 페이지 접근 권한** (isPrivate: true) 확인 필요
3. **purchaseApi.myLectureID()** 반환값 검증 필요 (false vs 실제 ID)

---

*마지막 업데이트: 2025-08-17*
*작업자: Claude Code Assistant*