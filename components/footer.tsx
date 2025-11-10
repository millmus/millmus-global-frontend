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
import { useEffect, useState } from 'react';
import { FieldErrors, set, useForm } from 'react-hook-form';
import { lecturesApi } from '@libs/api';
import axios from 'axios';
import { scaleValue } from '../utils/responsive';
import useResponsiveScale from '../hooks/useResponsiveScale';
import { useTranslation } from 'next-i18next';

interface IApplyTutorForm {
  // 성함
  name: string;
  // 가입 핸드폰번호
  phone: string;
  // 이메일
  email: string;
  // 대표 SNS 주소
  sns: string;
  // 강의 주제
  subject: string;
  // 기존 강의 참고 링크
  reference: string;
  // 기존 강의가 런칭되어 있는 플랫폼
  oldPlatform: string;
}

export default function Footer() {
  const { t } = useTranslation('common');
  const scale = useResponsiveScale();

  const popupVar = {
    invisible: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  // 강시지원 팝업 상태관리
  const [showModal, setShowModal] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

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

  // Body scroll lock for modal
  useEffect(() => {
    if (showModal) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }
  }, [showModal]);

  async function sendSMS(to: string, name: string) {
    try {
      const response = await axios.post('/api/sendSms', {
        content: `${name}${t('smsNotification')}`, // SMS 내용
        subject: t('smsSubject'), // SMS 제목
        toNumbers: [to] // 수신 번호 리스트
      }, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`
        }
      });
    } catch (error) {
      console.error('Error sending SMS', error);
    }
  }

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IApplyTutorForm>({
    mode: 'onChange',
  });

  const onValid = (formData: IApplyTutorForm) => {
    try {
      console.log(formData);

      lecturesApi.applyTutor({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        sns: formData.sns,
        subject: formData.subject,
        reference: formData.reference,
        oldPlatform: formData.oldPlatform,
      })
      sendSMS('01020507491', formData.name);
      sendSMS('01041067638', formData.name);
      setShowModal(false);
      setShowConfirmPopup(true);
    } catch(error) {
      console.error(error);
    }
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  // 컨테이너 width에 따른 slidesToShow 결정
  const isMobile = containerWidth < 1280 ? true : false;

  return (
    <div
      className='pt-[6.5rem] pb-[7.5rem] md:py-10 bg-[#14161a] lg:!px-[12px]'
      style={{
        paddingLeft: `${scaleValue(100, scale)}px`,
        paddingRight: `${scaleValue(100, scale)}px`,
        paddingTop: `${scaleValue(110, scale)}px`,
        paddingBottom: `${scaleValue(110, scale)}px`,
        gap: `${scaleValue(100, scale)}px`,
      }}
    >
      {isMobile
      ? 
      <div>
        <div>
          {/* 로고 */}
          <Link href='/'>
            <a>
              <svg
                viewBox='0 0 178 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='w-44 md:w-36'
              >
                <g clipPath='url(#clip0_1639_5043)'>
                  <path
                    d='M0 18.2054V15.1867L3.85718 10.0619L0 4.93706V1.68164H8.67866V4.93706H3.63275L7.36169 10.0939L3.63275 15.1867H8.67866V18.2054H0Z'
                    fill='white'
                  />
                  <path
                    d='M9.65036 18.2054V15.1867H14.6963L10.9673 10.0939L14.6963 4.93706H9.65036V1.68164H18.329V4.93706L14.4718 10.0619L18.329 15.1867V18.2054H9.65036Z'
                    fill='white'
                  />
                  <path
                    d='M33.2891 9.32903H23.7473V1.00304H33.2891V9.32903ZM39.5879 17.3566V19.5343H26.0113V14.111H36.3004V12.9593H25.9891V10.8038H39.0749V16.1186H28.7858V17.3566H39.5879ZM30.5344 3.20045H26.5218V7.10696H30.5344V3.20045ZM39.0749 9.92586H36.256V0.0214844H39.0749V9.92586Z'
                    fill='white'
                  />
                  <path
                    d='M45.6745 12.7874C47.5316 12.7455 49.2826 12.637 51.2679 12.3188L51.5022 14.5828C48.962 15.0317 46.7843 15.0958 44.328 15.0958H42.9395V7.25811H47.1444V4.18519H42.9173V1.94339H49.877V9.48018H45.6721V12.7899L45.6745 12.7874ZM52.612 0.362536H55.2164V18.7655H52.612V9.00913H50.6687V6.70321H52.612V0.362536ZM59.2733 0V19.6608H56.6049V0H59.2733Z'
                    fill='white'
                  />
                  <path
                    d='M65.8705 12.4249C68.4526 12.3607 71.2493 12.1462 74.1324 11.5715L74.4308 13.9194C71.0792 14.6247 67.8139 14.8368 64.8248 14.8368H63.0738V1.87927H65.8705V12.4249ZM78.4655 0V19.6608H75.6466V0H78.4655Z'
                    fill='white'
                  />
                  <path
                    d='M92.1728 6.18952C91.6401 8.23896 89.6548 9.60525 87.1121 9.60525C84.165 9.60525 81.9453 7.72598 81.9453 5.07972C81.9453 2.43346 84.165 0.531994 87.1121 0.531994C89.6301 0.531994 91.6376 1.89828 92.1728 3.94772H95.3098V0.0214844H98.1287V9.86173H95.3098V6.18952H92.1728ZM87.1121 7.34125C88.5647 7.34125 89.6301 6.48793 89.6301 5.07725C89.6301 3.66657 88.5622 2.81325 87.1121 2.81325C85.662 2.81325 84.636 3.66657 84.636 5.07725C84.636 6.48793 85.662 7.34125 87.1121 7.34125ZM98.6836 17.2678V19.4455H85.1909V14.0025H95.332V12.8508H85.149V10.6953H98.1287V16.0322H87.9679V17.2703H98.6836V17.2678Z'
                    fill='white'
                  />
                  <path
                    d='M117.836 0.0214844V19.7242H115.017V9.05034H111.409V14.9002H102.057V1.75031H111.409V6.78881H115.017V0.0214844H117.836ZM108.635 3.95019H104.834V12.6806H108.635V3.94772V3.95019Z'
                    fill='white'
                  />
                  <path
                    d='M124.799 12.4249C127.381 12.3607 130.177 12.1462 133.06 11.5715L133.359 13.9194C130.007 14.6247 126.742 14.8368 123.753 14.8368H122.002V1.87927H124.799V12.4249ZM137.394 0V19.6608H134.575V0H137.394Z'
                    fill='white'
                  />
                  <path
                    d='M158.423 15.0069V17.2906H140.619V15.0069H158.423ZM156.608 11.6331C153.192 10.95 150.674 9.05096 149.414 6.55267C148.154 9.05096 145.658 10.9722 142.242 11.6331L141.046 9.26306C145.466 8.51579 147.919 5.39848 147.919 2.58204V1.17383H150.931V2.58204C150.931 5.46506 153.365 8.51579 157.804 9.26306L156.608 11.6331Z'
                    fill='white'
                  />
                  <path
                    d='M170.55 9.64976V10.9519H176.101V16.1606H165.02V17.3345H176.74V19.4481H162.243V14.1753H173.302V13.0852H162.201V10.9495H167.731V9.64729H160.302V7.42768H172.814C172.92 6.87278 172.984 6.35981 173.048 5.84683L162.204 6.31542L161.905 4.15993L173.179 3.90344C173.201 3.51871 173.201 3.17837 173.201 2.81584H162.463V0.640625H175.975V2.36945C175.975 3.86398 175.975 5.48676 175.635 7.43015H178.005V9.64976H170.554H170.55Z'
                    fill='white'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_1639_5043'>
                    <rect width='178' height='19.7249' fill='white' />
                  </clipPath>
                </defs>
              </svg>
            </a>
          </Link>
          {/* 로고 */}

          <nav className='mt-10 flex space-x-7 font-[400] md:mt-6 md:space-x-3 text-[12px]'>
            <Link href='/about-us'>
              <a className='text-[#c0c0c0]'>{t('aboutUs')}</a>
            </Link>

            <Link href='/terms-of-service'>
              <a className='text-[#c0c0c0]'>{t('termsOfService')}</a>
            </Link>

            <Link href='/refund-policy'>
              <a className='text-[#c0c0c0]'>{t('refundPolicy')}</a>
            </Link>

            <Link href='/privacy-policy'>
              <a className='text-[#c0c0c0]'>{t('privacyPolicy')}</a>
            </Link>
          </nav>

        </div>
        <div>
          <div
            className='md:w-[180px] w-[180px] mt-[20px] leading-none'
          >
            <a onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
            <Image
              src={ApplyTutor}
              alt='ApplyTutor'
              quality={100}
              placeholder='blur'
            />
            </a>
          </div>
          <div className='flex gap-x-4 mt-[20px]'>
            <Link href='https://www.instagram.com/millmus_official/'>
              <a target='_blank'>
                <div className='relative h-8 w-8'>
                  <Image
                    src={InstaIcon}
                    alt='Instagram Icon'
                    layout='fill'
                    objectFit='cover'
                    placeholder='blur'
                    quality={100}
                  />
                </div>
              </a>
            </Link>
            <Link href='https://www.facebook.com/profile.php?id=100026515401018'>
              <a target='_blank'>
                <div className='relative h-8 w-8'>
                  <Image
                    src={FBIcon}
                    alt='Instagram Icon'
                    layout='fill'
                    objectFit='cover'
                    placeholder='blur'
                    quality={100}
                  />
                </div>
              </a>
            </Link>
            <Link href='https://www.youtube.com/channel/UCW2r5R7Wn6Tc97JcZIjH-SQ'>
              <a target='_blank'>
                <div className='relative h-8 w-8'>
                  <Image
                    src={YoutubeIcon}
                    alt='Instagram Icon'
                    layout='fill'
                    objectFit='cover'
                    placeholder='blur'
                    quality={100}
                  />
                </div>
              </a>
            </Link>
            <Link href='https://blog.naver.com/millmus'>
              <a target='_blank'>
                <div className='relative h-8 w-8'>
                  <Image
                    src={BlogIcon}
                    alt='Instagram Icon'
                    layout='fill'
                    objectFit='cover'
                    placeholder='blur'
                    quality={100}
                  />
                </div>
              </a>
            </Link>
          </div>
        </div>
        <div>

          <div className='space-y-[10px] text-[#9e9e9e] mt-[20px] text-[12px] font-[400]'>
            <div>{t('companyName')}</div>
            <div>
              <div>
                {t('businessNumber')}
              </div>
              <div>
                {t('ceo')}ㅣ{t('businessRegistration')}
              </div>
            </div>
            <div>
              <div>
                {t('email')}
              </div>
              <div>
                {t('address')}
              </div>
            </div>
          </div>
          
        </div>
      </div>
      :
      <div className='flex justify-between md:block'>
        {/* 좌측 섹션 */}
        <div>
          {/* 로고 */}
          <Link href='/'>
            <a>
              <svg
                viewBox='0 0 178 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='w-44 md:w-36'
              >
                <g clipPath='url(#clip0_1639_5043)'>
                  <path
                    d='M0 18.2054V15.1867L3.85718 10.0619L0 4.93706V1.68164H8.67866V4.93706H3.63275L7.36169 10.0939L3.63275 15.1867H8.67866V18.2054H0Z'
                    fill='white'
                  />
                  <path
                    d='M9.65036 18.2054V15.1867H14.6963L10.9673 10.0939L14.6963 4.93706H9.65036V1.68164H18.329V4.93706L14.4718 10.0619L18.329 15.1867V18.2054H9.65036Z'
                    fill='white'
                  />
                  <path
                    d='M33.2891 9.32903H23.7473V1.00304H33.2891V9.32903ZM39.5879 17.3566V19.5343H26.0113V14.111H36.3004V12.9593H25.9891V10.8038H39.0749V16.1186H28.7858V17.3566H39.5879ZM30.5344 3.20045H26.5218V7.10696H30.5344V3.20045ZM39.0749 9.92586H36.256V0.0214844H39.0749V9.92586Z'
                    fill='white'
                  />
                  <path
                    d='M45.6745 12.7874C47.5316 12.7455 49.2826 12.637 51.2679 12.3188L51.5022 14.5828C48.962 15.0317 46.7843 15.0958 44.328 15.0958H42.9395V7.25811H47.1444V4.18519H42.9173V1.94339H49.877V9.48018H45.6721V12.7899L45.6745 12.7874ZM52.612 0.362536H55.2164V18.7655H52.612V9.00913H50.6687V6.70321H52.612V0.362536ZM59.2733 0V19.6608H56.6049V0H59.2733Z'
                    fill='white'
                  />
                  <path
                    d='M65.8705 12.4249C68.4526 12.3607 71.2493 12.1462 74.1324 11.5715L74.4308 13.9194C71.0792 14.6247 67.8139 14.8368 64.8248 14.8368H63.0738V1.87927H65.8705V12.4249ZM78.4655 0V19.6608H75.6466V0H78.4655Z'
                    fill='white'
                  />
                  <path
                    d='M92.1728 6.18952C91.6401 8.23896 89.6548 9.60525 87.1121 9.60525C84.165 9.60525 81.9453 7.72598 81.9453 5.07972C81.9453 2.43346 84.165 0.531994 87.1121 0.531994C89.6301 0.531994 91.6376 1.89828 92.1728 3.94772H95.3098V0.0214844H98.1287V9.86173H95.3098V6.18952H92.1728ZM87.1121 7.34125C88.5647 7.34125 89.6301 6.48793 89.6301 5.07725C89.6301 3.66657 88.5622 2.81325 87.1121 2.81325C85.662 2.81325 84.636 3.66657 84.636 5.07725C84.636 6.48793 85.662 7.34125 87.1121 7.34125ZM98.6836 17.2678V19.4455H85.1909V14.0025H95.332V12.8508H85.149V10.6953H98.1287V16.0322H87.9679V17.2703H98.6836V17.2678Z'
                    fill='white'
                  />
                  <path
                    d='M117.836 0.0214844V19.7242H115.017V9.05034H111.409V14.9002H102.057V1.75031H111.409V6.78881H115.017V0.0214844H117.836ZM108.635 3.95019H104.834V12.6806H108.635V3.94772V3.95019Z'
                    fill='white'
                  />
                  <path
                    d='M124.799 12.4249C127.381 12.3607 130.177 12.1462 133.06 11.5715L133.359 13.9194C130.007 14.6247 126.742 14.8368 123.753 14.8368H122.002V1.87927H124.799V12.4249ZM137.394 0V19.6608H134.575V0H137.394Z'
                    fill='white'
                  />
                  <path
                    d='M158.423 15.0069V17.2906H140.619V15.0069H158.423ZM156.608 11.6331C153.192 10.95 150.674 9.05096 149.414 6.55267C148.154 9.05096 145.658 10.9722 142.242 11.6331L141.046 9.26306C145.466 8.51579 147.919 5.39848 147.919 2.58204V1.17383H150.931V2.58204C150.931 5.46506 153.365 8.51579 157.804 9.26306L156.608 11.6331Z'
                    fill='white'
                  />
                  <path
                    d='M170.55 9.64976V10.9519H176.101V16.1606H165.02V17.3345H176.74V19.4481H162.243V14.1753H173.302V13.0852H162.201V10.9495H167.731V9.64729H160.302V7.42768H172.814C172.92 6.87278 172.984 6.35981 173.048 5.84683L162.204 6.31542L161.905 4.15993L173.179 3.90344C173.201 3.51871 173.201 3.17837 173.201 2.81584H162.463V0.640625H175.975V2.36945C175.975 3.86398 175.975 5.48676 175.635 7.43015H178.005V9.64976H170.554H170.55Z'
                    fill='white'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_1639_5043'>
                    <rect width='178' height='19.7249' fill='white' />
                  </clipPath>
                </defs>
              </svg>
            </a>
          </Link>
          {/* 로고 */}

          <nav className='mt-10 flex space-x-7 font-medium md:mt-6 md:space-x-3 md:text-sm'>
            <Link href='/about-us'>
              <a className='text-[#c0c0c0]'>{t('aboutUs')}</a>
            </Link>

            <Link href='/terms-of-service'>
              <a className='text-[#c0c0c0]'>{t('termsOfService')}</a>
            </Link>

            <Link href='/refund-policy'>
              <a className='text-[#c0c0c0]'>{t('refundPolicy')}</a>
            </Link>

            <Link href='/privacy-policy'>
              <a className='text-[#c0c0c0]'>{t('privacyPolicy')}</a>
            </Link>
          </nav>

          <div className='mt-[3.75rem] space-y-2 text-[#9e9e9e] md:mt-8 md:text-sm'>
            <div>{t('companyName')}</div>
            <div>
              {t('businessNumber')}ㅣ{t('ceo')}ㅣ{t('businessRegistration')}
            </div>
            <div>
              {t('email')} |
              {t('address')}
            </div>
          </div>
        </div>
        {/* 좌측 섹션 */}

        {/* 우측 섹션 */}
        <div>
          <div className='flex gap-x-4 md:mt-8'>
            <Link href='https://www.instagram.com/millmus_official/'>
              <a target='_blank'>
                <div className='relative h-8 w-8'>
                  <Image
                    src={InstaIcon}
                    alt='Instagram Icon'
                    layout='fill'
                    objectFit='cover'
                    placeholder='blur'
                    quality={100}
                  />
                </div>
              </a>
            </Link>
            <Link href='https://www.facebook.com/profile.php?id=100026515401018'>
              <a target='_blank'>
                <div className='relative h-8 w-8'>
                  <Image
                    src={FBIcon}
                    alt='Instagram Icon'
                    layout='fill'
                    objectFit='cover'
                    placeholder='blur'
                    quality={100}
                  />
                </div>
              </a>
            </Link>
            <Link href='https://www.youtube.com/channel/UCW2r5R7Wn6Tc97JcZIjH-SQ'>
              <a target='_blank'>
                <div className='relative h-8 w-8'>
                  <Image
                    src={YoutubeIcon}
                    alt='Instagram Icon'
                    layout='fill'
                    objectFit='cover'
                    placeholder='blur'
                    quality={100}
                  />
                </div>
              </a>
            </Link>
            <Link href='https://blog.naver.com/millmus'>
              <a target='_blank'>
                <div className='relative h-8 w-8'>
                  <Image
                    src={BlogIcon}
                    alt='Instagram Icon'
                    layout='fill'
                    objectFit='cover'
                    placeholder='blur'
                    quality={100}
                  />
                </div>
              </a>
            </Link>
          </div>
          <div
            className='md:w-[180px] w-[180px] mt-[30px] leading-none'
          >
            <a onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
            <Image
              src={ApplyTutor}
              alt='ApplyTutor'
              quality={100}
              placeholder='blur'
            />
            </a>
          </div>
        </div>
        {/* 우측 섹션 */}
      </div>}

      {showModal ? (
        <div
          onClick={() => setShowModal(false)}
          style={{ wordBreak: 'keep-all', zIndex: 9999 }}
          className='fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.6)]'
        >
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
              return;
            }}
            variants={popupVar}
            initial='invisible'
            animate='visible'
            exit='exit'
            className='flex flex-col w-[30rem] max-h-[85vh] gap-y-6 rounded bg-[#282e38] py-8 px-8 md:w-[25rem] md:max-h-[90vh]'
          >
            <div className="overflow-y-auto flex-1 min-h-0">
              <form onSubmit={handleSubmit(onValid, onInvalid)} className="space-y-3">
                <div>
                  <p className='text-[14px] font-[300] mb-2'>{t('instructorApplicationDescription')}</p>
                </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('nameLabel')}</label>
                <input
                  type="text"
                  {...register('name', {
                    required: t('nameRequired'),
                  })}
                  className="w-full text-[#cfcfcf] px-3 py-1 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('phoneLabel')}</label>
                <input
                  type="text"
                  maxLength={11}
                  {...register('phone', {
                    required: t('phoneRequired'),
                    pattern: {
                      value: /^\d{11}$/, // 숫자만 11자리인지 확인하는 정규식
                      message: t('phoneInvalid'),
                    },
                  })}
                  className="w-full text-[#cfcfcf] px-3 py-1 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('emailLabel')}</label>
                <input
                  type="text"
                  {...register('email', {
                    required: t('emailRequired'),
                  })}
                  className="w-full text-[#cfcfcf] px-3 py-1 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('snsLabel')}</label>
                <input
                  type="text"
                  {...register('sns', {
                    required: t('snsRequired'),
                  })}
                  className="w-full text-[#cfcfcf] px-3 py-1 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                />
                {errors.sns && <span className="text-red-500 text-sm">{errors.sns.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('subjectLabel')}</label>
                <input
                  type="text"
                  {...register('subject', {
                    required: t('subjectRequired'),
                  })}
                  className="w-full text-[#cfcfcf] px-3 py-1 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                />
                {errors.subject && <span className="text-red-500 text-sm">{errors.subject.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('referenceLabel')}</label>
                <input
                  type="text"
                  {...register('reference', {
                    required: t('referenceRequired'),
                  })}
                  className="w-full text-[#cfcfcf] px-3 py-1 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                />
                {errors.reference && <span className="text-red-500 text-sm">{errors.reference.message}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('platformLabel')}</label>
                <input
                  type="text"
                  {...register('oldPlatform', {
                    required: t('platformRequired'),
                  })}
                  className="w-full text-[#cfcfcf] px-3 py-1 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                />
                {errors.oldPlatform && <span className="text-red-500 text-sm">{errors.oldPlatform.message}</span>}
              </div>
              <div className='flex justify-center gap-x-8 font-bold md:gap-x-6'>
                  <button onClick={() => {}}>
                    <div
                      className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-black transition-all hover:opacity-90'
                    >
                      {t('submitApplication')}
                    </div>
                  </button>
                </div>
              </form>
            </div>
            
          </motion.div>
        </div >
      ) : null}
      {showConfirmPopup ? (
        <div
          onClick={() => setShowConfirmPopup(false)}
          style={{ wordBreak: 'keep-all' }}
          className='fixed top-[150px] left-0 z-50 flex h-[calc(100vh-150px)] w-screen items-center justify-center bg-[rgba(0,0,0,0.6)] md:top-1 md:h-full'
        >
          <motion.div
            onClick={(e) => {
              e.stopPropagation();
              return;
            }}
            variants={popupVar}
            initial='invisible'
            animate='visible'
            exit='exit'
            className='flex flex-col w-[20rem] gap-y-6 rounded bg-[#282e38] py-8 px-8 md:w-[25rem]'
          >
            <div className="space-y-4">
              <div>
                <p className='text-center'>{t('applicationSuccess')}</p>
              </div>
              <div className='flex justify-center gap-x-8 font-bold md:gap-x-6'>
                  <button onClick={() => {
                    setShowConfirmPopup(false);
                  }}>
                    <div
                      className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-black transition-all hover:opacity-90'
                    >
                      {t('confirm')}
                    </div>
                  </button>
                </div>
            </div>
            
          </motion.div>
        </div >
      ) : null}
    </div>
  );
}
