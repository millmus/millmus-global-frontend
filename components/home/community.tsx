import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import useResponsiveScale from '../../hooks/useResponsiveScale';
import { scaleValue } from '../../utils/responsive';

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

// 캐싱으로 인한 문제를 피하기 위해서
// 이미지의 디렉토리를 추가해야한다.
const dir = '/home/community_imgs/250902/';
const images = [
  {src: "4.jpg", position: "top"}, 
  {src: "1.jpg", position: "top"}, 
  {src: "2.jpg", position: "top"}, 
  {src: "3.jpg", position: "top"}, 
  {src: "6.jpg", position: "top"}, 
  {src: "7.jpg", position: "top"}, 
  {src: "8.jpg", position: "top"},
  {src: "9.jpg", position: "top"},
  {src: "11.jpg", position: "top"},
  {src: "12.jpg", position: "top"},
  {src: "13.jpg", position: "top"},
  {src: "14.jpg", position: "top"},
  {src: "15.jpg", position: "top"},
  {src: "16.jpg", position: "top"},
  {src: "17.jpg", position: "top"},
  {src: "18.jpg", position: "top"},
  {src: "19.jpg", position: "top"},
  {src: "20.jpg", position: "top"},
  {src: "21.jpg", position: "top"},
  {src: "22.jpg", position: "top"},
  {src: "23.jpg", position: "top"},
  {src: "24.jpg", position: "top"},
  {src: "25.jpg", position: "top"},
  {src: "26.jpg", position: "top"},
  {src: "27.jpg", position: "top"},
];

const Cummunity = () => {
  const scale = useResponsiveScale();
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

  console.log('containerWidth:', containerWidth);

  // 컨테이너 width에 따른 slidesToShow 결정
  const isMobile = containerWidth < 1280 ? true : false;

  console.log('isMobile:', isMobile);

  // 화살표 컴포넌트: 이미지 높이의 절반 위치에 배치
  const PrevArrow = ({ onClick }: ArrowProps) => (
    <div
      onClick={onClick}
      style={{
        top: imageHeight ? `${imageHeight / 2}px` : '50%',
      }}
      className={`absolute left-[12px] z-[1] flex aspect-square w-7 -translate-y-1/2 cursor-pointer items-center justify-center`}
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
        top: imageHeight ? `${imageHeight / 2}px` : '50%',
      }}
      className={`absolute right-[12px] z-[1] flex aspect-square w-7 -translate-y-1/2 cursor-pointer items-center justify-center`}
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    autoplay: true,
    autoplaySpeed: 1500,
  };

  if (isMobile) {
    return (
      <div ref={sliderContainerRef}
        className="slider-container py-[20px]"
        style={{
            paddingLeft: `${scaleValue(30, scale)}px`,
            paddingRight: `${scaleValue(30, scale)}px`,
        }}
      >
      {images && (
        <Slider {...settings} className='px-[0px]' >
          {images.map((item, ind) => {
            // 첫 번째 카드에만 ref를 전달하여 이미지 컨테이너 높이를 측정
            if (ind === 0) {
              return (
                <div key={`slider-${ind}`}>
                  <div ref={imageContainerRef}>
                    <div
                      className="relative"
                      style={{
                        width: '100%',
                        aspectRatio: '232 / 152', // 원본 비율 유지
                      }}
                    >
                      <Image
                        src={`${dir}${item.src}`}
                        alt={item.src}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={`slider-${ind}`}>
                <div>
                  <div
                    className="relative"
                    style={{
                      width: '100%',
                      aspectRatio: '232 / 152', // 원본 비율 유지
                    }}
                  >
                    <Image
                      src={`${dir}${item.src}`}
                      alt={item.src}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      )}
    </div>
    )
  }

  return (
    <div className='relative overflow-hidden h-[470px] bg-center bg-[url("/home/community-bg.png")] md:h-[270px]'>
        <div
          className="absolute top-0 left-0 overflow-hidden whitespace-nowrap h-[470px] py-[3rem] md:h-[270px] md:py-[1rem]"
          style={{
            animationName: 'scroll',
            animationDuration: '100s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        >
          {
            [...images, ...images].map((d, ind) => 
              <div key={ind} 
                className="group inline-flex relative w-[580px] h-full items-center px-[15px] md:w-[300px]"
                >
                <Image
                  className="rounded transition-transform duration-300 group-hover:scale-110"
                  src={`${dir}${d.src}`}
                  alt='Image'
                  width={580}
                  height={380}
                  quality={80}
                  objectFit='cover'
                  objectPosition={d.position}
                  priority={true}
                />
              </div>
            )
          }
        </div>
    </div>
  );
}

export default Cummunity;