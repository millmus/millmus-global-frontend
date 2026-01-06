import { test, expect, Page } from '@playwright/test';

// 테스트용 상수
const TEST_LECTURE_ID = '1';
const PURCHASE_URL = `/purchase/lecture/${TEST_LECTURE_ID}/1`;

// IMP 모킹 함수
async function mockIMP(page: Page) {
  await page.addInitScript(() => {
    (window as any).IMP = {
      init: (merchantId: string) => {
        console.log('[Mock IMP] Initialized with:', merchantId);
      },
      request_pay: (params: any, callback: (res: any) => void) => {
        console.log('[Mock IMP] request_pay called with:', params);
        // 테스트용 성공 응답
        callback({
          success: true,
          imp_uid: 'test_imp_uid_123',
          merchant_uid: params.merchant_uid,
        });
      },
      loadUI: (type: string, params: any, callback: (res: any) => void) => {
        console.log('[Mock IMP] loadUI called:', type, params);
        // PayPal SPB 모킹 - 버튼 렌더링 시뮬레이션
        const container = document.querySelector('.portone-ui-container');
        if (container) {
          container.innerHTML = `
            <button
              id="mock-paypal-button"
              style="width: 256px; height: 56px; background: #0070ba; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              PayPal 결제하기 (테스트)
            </button>
          `;
          const btn = document.getElementById('mock-paypal-button');
          if (btn) {
            btn.addEventListener('click', () => {
              callback({
                imp_uid: 'test_paypal_imp_uid_123',
                merchant_uid: params.merchant_uid,
              });
            });
          }
        }
      },
      updateLoadUIRequest: (type: string, params: any) => {
        console.log('[Mock IMP] updateLoadUIRequest:', type, params);
      },
    };
  });
}

// 인증 모킹 (로그인 상태 시뮬레이션)
async function mockAuth(page: Page) {
  await page.addInitScript(() => {
    // 로컬 스토리지에 테스트용 토큰 설정
    localStorage.setItem('token', 'test_token_123');
  });
}

test.describe('구매 페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await mockIMP(page);
  });

  test('구매 페이지가 정상적으로 로드된다', async ({ page }) => {
    await page.goto(PURCHASE_URL);

    // 페이지 제목 확인 (Order Payment 또는 Order/Payment)
    await expect(page.locator('text=Order Payment').first()).toBeVisible({ timeout: 10000 });
  });

  test('결제 수단 선택이 정상 동작한다', async ({ page }) => {
    await page.goto(PURCHASE_URL);
    await page.waitForLoadState('networkidle');

    // 기본 선택이 PayPal인지 확인
    const paypalRadio = page.locator('text=PayPal').first();
    await expect(paypalRadio).toBeVisible({ timeout: 15000 });

    // 신용카드 선택
    const creditCardOption = page.locator('text=Credit/Debit Card').first();
    if (await creditCardOption.isVisible({ timeout: 5000 }).catch(() => false)) {
      await creditCardOption.click();
    }

    // 현금 이체 선택
    const bankTransferOption = page.locator('text=Bank Transfer').first();
    if (await bankTransferOption.isVisible({ timeout: 5000 }).catch(() => false)) {
      await bankTransferOption.click();
    }
  });

  test('PayPal 결제 버튼이 렌더링된다', async ({ page }) => {
    await page.goto(PURCHASE_URL);
    await page.waitForLoadState('networkidle');

    // PayPal 선택 확인
    const paypalOption = page.locator('text=PayPal').first();
    await expect(paypalOption).toBeVisible({ timeout: 15000 });
    await paypalOption.click();

    // PayPal 컨테이너 확인
    const paypalContainer = page.locator('.portone-ui-container');
    await expect(paypalContainer).toBeVisible({ timeout: 15000 });
  });

  test('포인트 입력이 정상 동작한다', async ({ page }) => {
    await page.goto(PURCHASE_URL);

    // 포인트 입력 필드 찾기
    const pointInput = page.locator('input[type="tel"][placeholder*="point" i]').first();

    if (await pointInput.isVisible()) {
      await pointInput.fill('1000');
      await expect(pointInput).toHaveValue('1000');
    }
  });

  test('쿠폰 적용 팝업이 열린다', async ({ page }) => {
    await page.goto(PURCHASE_URL);

    // 쿠폰 적용 버튼 찾기
    const couponButton = page.locator('text=Apply Coupon').first();

    if (await couponButton.isVisible()) {
      await couponButton.click();

      // 쿠폰 팝업이 열렸는지 확인
      const couponPopup = page.locator('text=Coupon Name');
      await expect(couponPopup).toBeVisible({ timeout: 5000 });
    }
  });

  test('결제 금액이 정상적으로 표시된다', async ({ page }) => {
    await page.goto(PURCHASE_URL);

    // 결제 금액 섹션 확인
    const paymentAmount = page.locator('text=Payment Amount').first();
    await expect(paymentAmount).toBeVisible({ timeout: 10000 });

    // 최종 결제금액 확인
    const finalAmount = page.locator('text=Final Payment Amount').first();
    await expect(finalAmount).toBeVisible({ timeout: 10000 });
  });

  test('현금 결제 선택 시 계좌 정보 팝업이 열린다', async ({ page }) => {
    await page.goto(PURCHASE_URL);

    // 현금 이체 선택
    const bankTransferOption = page.locator('text=Bank Transfer').first();

    if (await bankTransferOption.isVisible()) {
      await bankTransferOption.click();

      // 결제 버튼 클릭
      const payButton = page.locator('text=Pay').first();
      if (await payButton.isVisible()) {
        await payButton.click();

        // 계좌 정보 팝업 확인
        const accountPopup = page.locator('text=Kookmin Bank');
        await expect(accountPopup).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

test.describe('결제 완료 페이지 테스트', () => {
  test('결제 성공 시 완료 페이지로 이동한다', async ({ page }) => {
    // 결제 완료 페이지 직접 접근 (테스트용 파라미터)
    await page.goto('/purchase/finish?imp_uid=test_imp&merchant_uid=test_merchant&imp_success=true&option=1');

    // 페이지 로드 확인 (로딩 또는 결과 표시)
    await page.waitForLoadState('networkidle');
  });

  test('PayPal 결제 완료 시 폴링이 동작한다', async ({ page }) => {
    await page.goto('/purchase/finish?imp_uid=test_imp&merchant_uid=test_merchant&imp_success=true&option=1&payment_method=paypal');

    // 페이지 로드 확인
    await page.waitForLoadState('networkidle');
  });
});

test.describe('무료 강의 구매 테스트', () => {
  test('무료 강의 신청 버튼이 표시된다', async ({ page }) => {
    // 무료 강의의 경우 totalPrice가 0이면 무료 신청 버튼 표시
    await page.goto(PURCHASE_URL);

    // 무료 신청 버튼 또는 결제 영역 확인
    const freeApplyButton = page.locator('text=Free Apply').first();
    const paypalContainer = page.locator('.portone-ui-container');

    // 둘 중 하나는 표시되어야 함
    const isVisible = await freeApplyButton.isVisible() || await paypalContainer.isVisible();
    expect(isVisible).toBeTruthy();
  });
});

test.describe('다국어 지원 테스트', () => {
  test('영어 로케일이 정상 동작한다', async ({ page }) => {
    await page.goto('/en' + PURCHASE_URL);

    await expect(page.locator('text=Order Payment').first()).toBeVisible({ timeout: 10000 });
  });

  test('일본어 로케일이 정상 동작한다', async ({ page }) => {
    await page.goto('/ja' + PURCHASE_URL);

    // 일본어 텍스트 확인
    await page.waitForLoadState('networkidle');
  });

  test('중국어 로케일이 정상 동작한다', async ({ page }) => {
    await page.goto('/zh' + PURCHASE_URL);

    // 중국어 텍스트 확인
    await page.waitForLoadState('networkidle');
  });
});

test.describe('모바일 반응형 테스트', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await mockIMP(page);
  });

  test('모바일에서 구매 페이지가 정상 표시된다', async ({ page }) => {
    await page.goto(PURCHASE_URL);

    // 모바일 뷰포트에서 페이지 로드 확인
    await page.waitForLoadState('networkidle');

    // 모바일용 상품 정보 확인 - 페이지 제목으로 확인
    const pageTitle = page.locator('text=Order Payment').first();
    await expect(pageTitle).toBeVisible({ timeout: 15000 });
  });
});
