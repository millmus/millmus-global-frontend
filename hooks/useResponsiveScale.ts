
import { useState, useEffect } from 'react';

const useResponsiveScale = (baseWidth: number = 1920) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const calculatedScale = window.innerWidth / baseWidth;
      // scale 값은 최대 1까지만 (즉, 브라우저가 커지더라도 scale은 1을 넘지 않음)
      setScale(Math.min(calculatedScale, 1));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [baseWidth]);

  return scale;
};

export default useResponsiveScale;
