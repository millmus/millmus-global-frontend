import React, { useState, useEffect, useRef } from 'react';
import Timer from '@public/lecture/timer1.gif';
import Image from 'next/image';

interface IProps {
  discount_period: string;
  price: string;
  final_price: string;
  children: React.ReactNode;
}

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback; 
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current(); 
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function getKoreaNow(){
  const now = new Date(),
    utcNow = now.getTime() + (now.getTimezoneOffset() * 60 * 1000), 
    koreaTimeDiff = 9 * 60 * 60 * 1000,
    koreaNow = new Date(utcNow + koreaTimeDiff).valueOf();
  return koreaNow;
}

function getDday(discount_period: string){
  const dueDate = new Date(discount_period+"T23:59:59").valueOf();
  const koreaNow = getKoreaNow();
  if (dueDate <= koreaNow) return '';

  const diff = dueDate - koreaNow,
    diffDay = Math.floor(diff / (1000*60*60*24)),
    diffHour = Math.floor((diff / (1000*60*60)) % 24),
    diffMin = Math.floor((diff / (1000*60)) % 60),
    diffSec = Math.floor(diff / 1000 % 60);
  return `${diffDay}일 ${diffHour}시간 ${diffMin}분 ${diffSec}초`;
}

export default function Dday({ discount_period, price, final_price, children }: IProps) {
  const [dday, setDday] = useState('');
  useInterval(()=>{
    setDday(getDday(discount_period));
  }, 1000);

  const [isScrollingDown, setScrollDir] = useState(false);
  useEffect(() => {
    const threshold = 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      if (isScrollingDown) return;
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setScrollDir(scrollY > lastScrollY ? true : false);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  // }, []);
  }, [isScrollingDown]);

  return (
    dday.length > 0 ? 
    <>
      <div className={`
        fixed inset-x-0 right-[-10px] mx-auto max-w-[1140px] h-[60px] ${isScrollingDown?"bottom-[16px] md:bottom-[24px]":"bottom-[-80px]"} 
        z-[1] p-[10px] px-20 text-[14px] text-white text-center items-center rounded flex justify-between backdrop-blur-sm m-auto bg-black/70 transition-[bottom] duration-500 
        md:w-full md:inset-x-0 md:p-1 md:px-4 md:justify-center md:z-[10000001]`}>
        <div className="flex items-center gap-x-[20px]">
           <div className='relative h-[40px] w-[40px] md:hidden'>
            <Image
              src={Timer}
              alt='Timer Gif'
              width={40}
              height={40}
              objectFit='cover'
              quality={100}
              unoptimized={true}
            />
          </div>
          <div className="mr-1 w-[292.97px] md:w-[200px]">
            <b>얼리버드 할인 마감까지</b> <br/>
            <span className="text-[#00E7FF] shadow-[0_0_inset_#ffffff8f] font-bold">{dday} </span>
            남았어요!
          </div>
        </div>
        <div className="flex items-center w-[292.97px] md:w-[200px]">
          {children}
        </div>
      </div>
    </>
    :
    <></>
  )
}
