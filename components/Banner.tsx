import React, { forwardRef } from 'react';
import Image from 'next/image';
import { ICard } from '../types';

const Banner = forwardRef<HTMLDivElement, ICard>(
  ({ id, title, imageLink, link }, ref) => {
    return (
      <div>
        {/* 이미지 컨테이너에 ref를 할당 */}
        <div
          ref={ref}
          className="relative"
          style={{
            width: '100%',
            // aspectRatio: '1920 / 852', // 원본 비율 유지
            aspectRatio: '1920 / 681', // 원본 비율 유지
          }}
        >
          <Image
            src={imageLink}
            alt={title}
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    );
  }
);

Banner.displayName = 'Banner';

export default Banner;
