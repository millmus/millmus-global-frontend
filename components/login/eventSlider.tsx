import { useState } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import Link from 'next/link';
import welcomeCoupon from "@public/login/welcomeCoupon.png";
import freeVideo from "@public/login/freeVideo.png";


interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const PrevArrow = ({ onClick }: ArrowProps) => (
  <div
    onClick={onClick}
    className='absolute inset-y-0 my-auto left-0 z-[1] flex aspect-square w-9 cursor-pointer items-center justify-center md:!hidden'
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  </div>
);
const NextArrow = ({ onClick }: ArrowProps) => (
  <div
    onClick={onClick}
    className='absolute inset-y-0 my-auto right-0 z-[1] flex aspect-square w-9 cursor-pointer items-center justify-center md:!hidden'
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  </div>
);

export default function EventSlider() {
  const [topBanner, setTopBanner] = useState<boolean | null>(null);
  const settings = {
    dots: true,
    speed: 800,
    fade: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <PrevArrow />,
    prevArrow: <NextArrow />,
    appendDots: (dots: any) => <ul>{dots}</ul>,
    customPaging: () => (
      <div className='aspect-square w-1.5 rounded-full bg-[#ffffff80]'></div>
    ),
  };

  const contents = [
    {
      text: "회원가입하고 무료특강 체험하기!",
      src: freeVideo,
    },
  ];

  return (contents &&
    <Slider {...settings}
      className="w-full bg-transparent text-white my-6 !overflow-visible"
      dotsClass='slick-dots absolute overflow-hidden inset-x-0 justify-center !flex md:!w-fit md:!left-1/2 md:!right-0 md:!-translate-x-1/2'
    >
      {contents.map((d, index) =>
        <div key={index} className="">
          <div className="flex flex-col relative h-full max-w-[1180px] mx-auto justify-center">
            <div className='relative h-[200px] w-auto my-auto'>
              <Image
                src={d.src}
                alt='Left Icon'
                layout='fill'
                objectFit='contain'
                quality={100}
              />
            </div>
            <div className="flex flex-col justify-center text-center font-bold">
              <div className="text-lg">{d.text}</div>
            </div>
          </div>
        </div>
      )}
    </Slider>
  )
}