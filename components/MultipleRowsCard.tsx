import React, { forwardRef } from 'react';
import Image from 'next/image';
import { ICard } from '../types';

interface Props extends ICard {
  mode?: 'default' | 'small';
}
const MultipleRowsCard = forwardRef<HTMLDivElement, Props>(
  ({ id, title, imageLink, link, mode='default' }, ref) => {
    return (
      <>
      { mode === 'default' ?
        <div className="flex flex-col gap-[15px] flex-[1.2]">
          {/* 이미지 컨테이너에 ref를 할당 */}
          <div
            ref={ref}
            className="relative"
            style={{
              width: '100%',
              aspectRatio: '692 / 488', // 원본 비율 유지
            }}
          >
            <Image
              src={imageLink}
              alt={title}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div> : <div className="flex flex-col flex-[1.2]">
          
          {/* 이미지 컨테이너에 ref를 할당 */}
          <div
            ref={ref}
            className="relative"
            style={{
              width: '100%',
              aspectRatio: '692 / 488', // 원본 비율 유지
            }}
          >
            <Image
              src={imageLink}
              alt={title}
              layout="fill"
              objectFit="cover"
              className='rounded-[4px]'
            />
          </div>
        </div>}
      </>
    );
  }
);

MultipleRowsCard.displayName = 'MultipleRowsCard';

export default MultipleRowsCard;
