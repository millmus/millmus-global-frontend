import { useState } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import Link from 'next/link';

interface IProps {
  data: any[];
}

interface ArrowProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function Banner({ data }: IProps) {
  const slidesToShow = 3;
  while (data?.length <= slidesToShow) {
    data = [...data, ...data];
  } 
  const PrevArrow = ({ onClick }: ArrowProps) => (
    <div
      onClick={onClick}
      className='absolute top-1/2 left-12 z-[1] flex aspect-square w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white md:!hidden'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-5 w-5'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M15 19l-7-7 7-7'
        />
      </svg>
    </div>
  );

  const NextArrow = ({ onClick }: ArrowProps) => (
    <div
      onClick={onClick}
      className='absolute top-1/2 right-12 z-[1] flex aspect-square w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white md:!hidden'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-5 w-5'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={2}
      >
        <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
      </svg>
    </div>
  );
  const [oldSlide, setOldSlide] = useState(0),
    [newSlide, setNewSlide] = useState(0);
  const settings = {
    dots: true,
    centerMode: true,
    infinite: true,
    speed: 800,
    centerPadding: "0",
    slidesToShow: slidesToShow,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots: any) => <ul>{dots}</ul>,
    customPaging: () => (
      <div className='aspect-square w-1.5 rounded-full bg-[#ffffff80]'></div>
    ),
    beforeChange: (oldIndex:number, newIndex:number) => {
      setOldSlide(oldIndex);
      setNewSlide(newIndex);
    }
  };

  return (
    <div className='h-[700px] w-screen bg-black md:h-60'>
      {data && (
        <Slider
          className='!flex h-full items-center m-auto px-12 max-w-[1600px] md:px-1 md:max-w-[600px]'
          {...settings}
          dotsClass='slick-dots absolute inset-x-0 justify-center !bottom-[3rem] !flex md:!w-fit md:!left-1/2 md:!right-0 md:!-translate-x-1/2 md:!bottom-4'
        >
          {data?.map((i, ind) => {
            ind = ind%data.length;
            let data_length = data.length-1, 
              ind_gap = ind-newSlide,
              is_center = ind_gap==0 ? true : false;
            if (Math.abs(ind_gap)==data_length) ind_gap = -(ind_gap);
            return (
              <div key={i.order} className='relative'>
                <div className='relative justify-center flex h-[700px] max-w-[1180px] flex-col md:h-80 md:max-w-[330px]'>
                  <Link href={i.url}>
                    <a style={{
                        overflow: 'unset',
                        transition: ".5s transform",
                        zIndex: `${is_center ? 1 : 0}`,
                        transform: `${
                          is_center ?
                          "perspective(1000px) rotateY(0deg) scale(1.7)":
                          ind_gap <= -1 ?
                          "perspective(1000px) rotateY(40deg) scale(1)"
                          :
                          "perspective(1000px) rotateY(-40deg) scale(1)"
                        }`
                      }}>
                      <div className={`${is_center ? "shadow-[0_0_40px_black]" : "shadow-lg"} will-change-[filter]`}>
                        <img
                          src={i.img}
                          alt='Banner Image'
                          width="700px"
                          height="700px"
                        />
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            )
          })}
        </Slider>
      )}
    </div>
  );
}
