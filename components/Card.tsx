import React, { forwardRef } from 'react';
import Image from 'next/image';
import { ICard } from '../types';

const Card = forwardRef<HTMLDivElement, ICard>(
  ({ id, title, imageLink, link }, ref) => {
    return (
      <div className="flex flex-col gap-[20px]">
        {/* 이미지 컨테이너에 ref를 할당 */}
        <div
          ref={ref}
          className="relative"
          style={{
            width: '100%',
            aspectRatio: '374 / 209', // 원본 비율 유지
          }}
        >
          <Image
            src={imageLink}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        {/* <div>
          <h3
            className="sm:text-[12px] lg:text-[16px] 2xl:text-[18px] text-[24px] text-[#ebebeb]"
            style={{ letterSpacing: '-0.05em' }}
          >
            {title}
          </h3>
        </div> */}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
