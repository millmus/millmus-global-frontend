import React, { useRef, useState, useEffect } from 'react';
import { ICard } from '../types';
import Slider from 'react-slick';
import MultipleRowsCard from './MultipleRowsCard';

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

interface Props {
  itemList: ICard[];
  // 좌우 화살표를 내부에 표시할지 외부에 표시할지 속성으로 받음
  showArrowInside?: boolean;
}

const MultipleRowsCardSlider = ({ itemList, showArrowInside=true }: Props) => {
  // 슬라이더 최상위 컨테이너의 width 측정을 위한 ref
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // 첫 번째 카드의 이미지 컨테이너 높이 측정을 위한 ref
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    const updateWindowWidth = () => {
      setContainerWidth(window.innerWidth);
      console.log(`window.innerWidth: ${window.innerWidth}`);
    };
  
    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  // 이미지 컨테이너의 높이를 업데이트
  useEffect(() => {
    const updateHeight = () => {
      if (imageContainerRef.current) {
        setImageHeight(imageContainerRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // 컨테이너 width에 따른 slidesToShow 결정
  const dynamicSlidesToShow = containerWidth < 1280 ? 2 : 4;

  // 아이템 수가 부족하면 복제 (react-slick이 원활히 동작하도록)
  while (itemList?.length <= dynamicSlidesToShow) {
    itemList = [...itemList, ...itemList];
  }

  // 화살표 컴포넌트: 이미지 높이의 절반 위치에 배치
  const PrevArrow = ({ onClick }: ArrowProps) => (
    <div
      onClick={onClick}
      style={{
        top: '50%',
      }}
      className={`absolute ${dynamicSlidesToShow === 2 ? 'left-[12px]' : showArrowInside ? 'left-[12px]' : '-left-0'} z-[1] flex aspect-square w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  );

  const NextArrow = ({ onClick }: ArrowProps) => (
    <div
      onClick={onClick}
      style={{
        top: '50%',
      }}
      className={`absolute ${dynamicSlidesToShow === 2 ? 'right-[12px]' : showArrowInside ? 'right-[12px]' : '-right-0'} z-[1] flex aspect-square w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );

  // 화살표 컴포넌트: 이미지 높이의 절반 위치에 배치
  const InnerPrevArrow = ({ onClick }: ArrowProps) => (
    <div
      onClick={onClick}
      style={{
        top: '50%',
      }}
      className={`absolute ${dynamicSlidesToShow === 2 ? 'left-[12px]' : showArrowInside ? 'left-[12px]' : '-left-0'} z-[1] flex aspect-square w-[19px] -translate-y-1/2 cursor-pointer items-center justify-center`}
    >
      <svg width="19" height="26" viewBox="0 0 19 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect opacity="0.7" width="19" height="25.0641" rx="3" transform="matrix(-1 0 0 1 19 0)" fill="black"/>
      <path d="M10.992 6.55456C10.56 6.24856 10.002 6.35656 9.714 6.78856L5.826 12.5126C5.628 12.8006 5.628 13.1606 5.826 13.4486L9.714 19.1726C10.002 19.6046 10.56 19.7126 10.992 19.4066L11.244 19.2446C11.676 18.9386 11.766 18.3986 11.478 17.9666L8.418 13.4486C8.22 13.1606 8.202 12.8006 8.4 12.5126L11.478 7.99456C11.766 7.56256 11.676 7.02256 11.244 6.71656L10.992 6.55456Z" fill="white"/>
      </svg>
    </div>
  );

  const InnerNextArrow = ({ onClick }: ArrowProps) => (
    <div
      onClick={onClick}
      style={{
        top: '50%',
      }}
      className={`absolute ${dynamicSlidesToShow === 2 ? 'right-[12px]' : showArrowInside ? 'right-[12px]' : '-right-[0px]'} z-[1] flex aspect-square w-[19px] -translate-y-1/2 cursor-pointer items-center justify-center`}
    >
      <svg width="19" height="26" viewBox="0 0 19 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect opacity="0.7" y="0.00256348" width="19" height="25.0641" rx="3" fill="black"/>
      <path d="M8.008 6.55713C8.44 6.25113 8.998 6.35913 9.286 6.79113L13.174 12.5151C13.372 12.8031 13.372 13.1631 13.174 13.4511L9.286 19.1751C8.998 19.6071 8.44 19.7151 8.008 19.4091L7.756 19.2471C7.324 18.9411 7.234 18.4011 7.522 17.9691L10.582 13.4511C10.78 13.1631 10.798 12.8031 10.6 12.5151L7.522 7.99713C7.234 7.56513 7.324 7.02513 7.756 6.71913L8.008 6.55713Z" fill="white"/>
      </svg>
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: dynamicSlidesToShow === 2 ? 1 : 2,
    prevArrow: dynamicSlidesToShow === 2 ? <InnerPrevArrow /> : showArrowInside ? undefined : <PrevArrow />,
    nextArrow: dynamicSlidesToShow === 2 ? <InnerNextArrow /> : showArrowInside ? undefined : <NextArrow />,
    rows: 1,
    slidesPerRow: 1,
  };

  return (
    <div ref={sliderContainerRef} className="slider-container">
      {itemList && (
        <Slider {...settings} className={`${dynamicSlidesToShow === 2 ? 'px-[0px]' : 'px-[50px]'}`}>
          {itemList.map((item, ind) => {
            // 첫 번째 카드에만 ref를 전달하여 이미지 컨테이너 높이를 측정
            if (ind === 0) {
              return (
                <div key={item.id}>
                  <div className={dynamicSlidesToShow === 2 ? 'p-[5px]': 'p-[10px]'} >
                    {item.imageLink && <MultipleRowsCard
                      ref={imageContainerRef}
                      id={item.id}
                      title={item.title}
                      imageLink={item.imageLink}
                      link={item.link}
                      mode={dynamicSlidesToShow === 2 ? 'small' : 'default'}
                    />}
                  </div>
                </div>
              );
            }
            return (
              <div key={item.id}>
                <div className={dynamicSlidesToShow === 2 ? 'p-[5px]': 'p-[10px]'}>
                  {item.imageLink && <MultipleRowsCard
                    id={item.id}
                    title={item.title}
                    imageLink={item.imageLink}
                    link={item.link}
                      mode={dynamicSlidesToShow === 2 ? 'small' : 'default'}
                  />}
                </div>
              </div>
            );
          })}
        </Slider>
      )}
    </div>
  );
};

export default MultipleRowsCardSlider;
