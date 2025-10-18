import Layout from '@layouts/sectionLayout';
import Image from 'next/image';
import Link from 'next/link';
import InstaIcon from '@public/icons/instagram.png';
import FBIcon from '@public/icons/facebook.png';
import BlogIcon from '@public/icons/naverblog.png';
import YoutubeIcon from '@public/icons/youtube.png';
import { motion } from 'framer-motion';

{/* 강사지원하기 이미지 */}
import ApplyTutor from '@public/home/강사 지원하기.png';
{/* 에듀테크산업협회 이미지 */}
import EduTech from '@public/home/에듀테크산업협회.png';
{/* 중소벤처기업부 이미지 */}
import SmallBusiness from '@public/home/중소벤처기업부.png';
{/* 한국여성벤처기업회 이미지 */}
import WomenBusiness from '@public/home/한국여성벤처기업회.png';
{/* DGB금융그룹 이미지 */}
import DGB from '@public/home/DGB금융그룹.png';
{/* 초기창업패키지 선정기업 이미지 */}
import InitialStartupPackage from '@public/home/초기창업패키지-선정기업.png';
{/* 중앙일보선정프리미엄클래스 이미지 */}
import PremiumClass from '@public/home/중앙일보선정프리미엄클래스.png';
import { useEffect, useState } from 'react';
import { FieldErrors, set, useForm } from 'react-hook-form';
import { lecturesApi } from '@libs/api';
import axios from 'axios';
import useResponsiveScale from '../hooks/useResponsiveScale';
import { scaleValue } from '../utils/responsive';

export default function Award() {
  const scale = useResponsiveScale();

  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const updateWindowWidth = () => {
      setContainerWidth(window.innerWidth);
      console.log(`window.innerWidth: ${window.innerWidth}`);
    };
  
    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  // 컨테이너 width에 따른 slidesToShow 결정
  const isMobile = containerWidth < 1280 ? true : false;
  const sizeXl = containerWidth < 1280 ? true : false;
  const sizeSm = containerWidth < 640 ? true : false;
  
  return (
    <div className='w-full bg-[#14161a]'>
      <div
          className='md:pb-10 bg-[#14161a] lg:!px-[12px]'
          style={{
            paddingLeft: `${scaleValue(100, scale)}px`,
            paddingRight: `${scaleValue(100, scale)}px`,
            paddingBottom: `${scaleValue(110, scale)}px`,
            gap: `${scaleValue(100, scale)}px`,
          }}
        >
        {sizeSm ? <div>
          <div className='flex md:flex-wrap flex-nowrap justify-between items-center'>
            <div
              className='md:w-[145px] w-[180px] my-[15px] leading-none'
            >
              <Image
                src={WomenBusiness}
                alt='WomenBusiness'
                quality={100}
                placeholder='blur'
              />
            </div>
            <div
                className='md:w-[100px] w-[125px] my-[15px] leading-none'
            >
              <Image
                src={EduTech}
                alt='EduTech'
                quality={100}
                placeholder='blur'
              />
            </div>
          </div>
          <div className='flex md:flex-wrap flex-nowrap justify-between items-center'>
            <div
                className='md:w-[145px] w-[200px] my-[15px] leading-none'
            >
              <Image
                src={DGB}
                alt='DGB'
                quality={100}
                placeholder='blur'
              />
            </div>
            <div
                className='md:w-[145px] w-[180px] my-[15px] leading-none'
            >
              <Image
                src={SmallBusiness}
                alt='SmallBusiness'
                quality={100}
                placeholder='blur'
              />
            </div>
          </div>
          <div className='flex md:flex-wrap flex-nowrap justify-between items-center'>
            <div
                className='md:w-[155px] w-[185px] my-[15px] leading-none'
            >
              <Image
                src={InitialStartupPackage}
                alt='InitialStartupPackage'
                quality={100}
                placeholder='blur'
              />
            </div>
            <div
                className='md:w-[145px] w-[165px] my-[15px] leading-none'
            >
              <Image
                src={PremiumClass}
                alt='PremiumClass'
                quality={100}
                placeholder='blur'
              />
            </div>
          </div>
        </div>
        : sizeXl ? <div>
        <div className='flex md:flex-wrap flex-nowrap justify-between items-center'>
          <div
            className='md:w-[145px] w-[180px] my-[15px] leading-none'
          >
            <Image
              src={WomenBusiness}
              alt='WomenBusiness'
              quality={100}
              placeholder='blur'
            />
          </div>
          <div
              className='md:w-[100px] w-[125px] my-[15px] leading-none'
          >
            <Image
              src={EduTech}
              alt='EduTech'
              quality={100}
              placeholder='blur'
            />
          </div>
          <div
              className='md:w-[145px] w-[200px] my-[15px] leading-none'
          >
            <Image
              src={DGB}
              alt='DGB'
              quality={100}
              placeholder='blur'
            />
          </div>
        </div>
        <div className='flex md:flex-wrap flex-nowrap justify-between items-center'>
          <div
              className='md:w-[145px] w-[180px] my-[15px] leading-none'
          >
            <Image
              src={SmallBusiness}
              alt='SmallBusiness'
              quality={100}
              placeholder='blur'
            />
          </div>
          <div
              className='md:w-[155px] w-[185px] my-[15px] leading-none'
          >
            <Image
              src={InitialStartupPackage}
              alt='InitialStartupPackage'
              quality={100}
              placeholder='blur'
            />
          </div>
          <div
              className='md:w-[145px] w-[165px] my-[15px] leading-none'
          >
            <Image
              src={PremiumClass}
              alt='PremiumClass'
              quality={100}
              placeholder='blur'
            />
          </div>
        </div>
      </div> : <div className='flex md:flex-wrap flex-nowrap justify-between items-center'>
          <div
            className='md:w-[145px] w-[180px] my-[15px] leading-none'
          >
            <Image
              src={WomenBusiness}
              alt='WomenBusiness'
              quality={100}
              placeholder='blur'
            />
          </div>
          <div
              className='md:w-[100px] w-[125px] my-[15px] leading-none'
          >
            <Image
              src={EduTech}
              alt='EduTech'
              quality={100}
              placeholder='blur'
            />
          </div>
          <div
              className='md:w-[145px] w-[200px] my-[15px] leading-none'
          >
            <Image
              src={DGB}
              alt='DGB'
              quality={100}
              placeholder='blur'
            />
          </div>
          <div
              className='md:w-[145px] w-[180px] my-[15px] leading-none'
          >
            <Image
              src={SmallBusiness}
              alt='SmallBusiness'
              quality={100}
              placeholder='blur'
            />
          </div>
          <div
              className='md:w-[155px] w-[185px] my-[15px] leading-none'
          >
            <Image
              src={InitialStartupPackage}
              alt='InitialStartupPackage'
              quality={100}
              placeholder='blur'
            />
          </div>
          <div
              className='md:w-[145px] w-[165px] my-[15px] leading-none'
          >
            <Image
              src={PremiumClass}
              alt='PremiumClass'
              quality={100}
              placeholder='blur'
            />
          </div>
        </div>}
      </div>
    </div>
  );
}
