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
      { mode === 'default' ?<div className='flex sm:gap-[10px] lg:gap-[15px] 2xl:gap-[20px] gap-[25px]'>
        <div className="flex flex-col gap-[15px] flex-[1.2] px-[20px] py-[18px] rounded-[15px] bg-[#d5d5d5]">
          <div>
            <h3
              className="sm:text-[12px] lg:text-[16px] 2xl:text-[18px] text-[24px] text-[#000] font-bold"
              style={{ letterSpacing: '-0.05em' }}
            >
              {title}
            </h3>
          </div>
          {/* 이미지 컨테이너에 ref를 할당 */}
          <div
            ref={ref}
            className="relative"
            style={{
              width: '100%',
              aspectRatio: '430 / 180', // 원본 비율 유지
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
        <div className='flex-[1] flex flex-col gap-[10px] py-[10px]'>
          <div>
            <h4 className='font-bold text-[#ebebeb] sm:text-[12px] lg:text-[18px] 2xl:text-[24px] text-[30px]'>수강생 김*아님</h4>
          </div>
          <div>
            <p className='text-[#a1a1a1] sm:text-[12px] lg:text-[14px] 2xl:text-[16px] text-[20px]'>2024년 00월 우연히 강의를 발견해 0개월만에 억대 매출 달성! 순수익 30%의 어마어마한 결과를 직접 확인하세요</p>
          </div>
        </div>
      </div> : <div className="flex flex-col flex-[1.2] sm:p-[10px] p-[15px] rounded-[4px] bg-[#d5d5d5]">
          
          {/* 이미지 컨테이너에 ref를 할당 */}
          <div
            ref={ref}
            className="relative"
            style={{
              width: '100%',
              aspectRatio: '430 / 180', // 원본 비율 유지
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
          <div className='mt-[15px]'>
            <h3
              className="sm:text-[12px] lg:text-[16px] 2xl:text-[18px] text-[24px] text-[#000] font-bold leading-[1.3]"
              style={{ letterSpacing: '-0.05em' }}
            >
              {title}
            </h3>
          </div>
          <div className='mt-[10px]'>
            <p className='text-[#525252] sm:text-[12px] lg:text-[14px] 2xl:text-[16px] text-[20px] leading-[1.3]'>2024년 00월 우연히 강의를 발견해 0개월만에 억대 매출 달성! 순수익 30%의 어마어마한 결과를 직접 확인하세요</p>
          </div>
        </div>}
      </>
    );
  }
);

MultipleRowsCard.displayName = 'MultipleRowsCard';

export default MultipleRowsCard;
