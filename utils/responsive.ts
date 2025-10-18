
/**
 * 주어진 값(value)을 현재 스케일에 맞춰 조정합니다.
 * @param value 디자인 시안 기준의 값 (예: margin, padding, width 등)
 * @param scale useResponsiveScale에서 받은 스케일 값
 */
export const scaleValue = (value: number, scale: number): number => {
    return Math.round(value * scale);
  };
  