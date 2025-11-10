import Link from 'next/link';
import { navList } from './navList';
import { useRouter } from 'next/router';
import { cls } from '@libs/client/utils';
import TopBanner from '@components/home/topBanners';
import axios from 'axios';
import useSWR from 'swr';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { lecturesApi, usersApi } from '@libs/api';
import Image from "next/image";
import Magnifier from '@public/magnifier.png';
import MagnifierSmall from '@public/magnifier-small.png';
import notification from "@public/home/notification.png";
import notificationNew from "@public/home/notificationNew.png";
import NotificationList from '@components/mypage/notificationList';
import Toast from '@components/home/toast';
import useResponsiveScale from '../hooks/useResponsiveScale';
import { scaleValue } from '../utils/responsive';
import Freelive from '@public/freelive.png';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from './common/LanguageSwitcher';

const freeliveOriginWidth = 167;
const freeliveOriginHeight = 55;
const freeliveNewWidth = 90;
const freeliveNewHeight = freeliveNewWidth * (freeliveOriginHeight / freeliveOriginWidth);

export default function Header() {
  const { t } = useTranslation('common');
  const { data, mutate } = useSWR('/api/user');
  const router = useRouter();
  const [isOpened, setIsOpened] = useState(false);
  const [navListIndex, setNavListIndex] = useState(0);
  const scale = useResponsiveScale();

  // 초기 로딩 상태 관리 - undefined는 로딩중, null/object는 로딩 완료
  const isAuthLoading = data === undefined;

  const [containerWidth, setContainerWidth] = useState(0);

  // 1) State for managing search input & suggestions
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // (Mock) Example search function — replace with your own API call or filtering logic
  const mockSearchApi = async (query: string) => {
    try {
      const searchData = await lecturesApi.search(query);
      console.log('searchData', searchData);
      return searchData;
    } catch(e) {
      console.error(e);
    }
    return []
  };

  // 2) Handle input changes & fetch suggestions
  const onChangeSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);

    if (value.length > 0) {
      setShowSuggestions(true);
      try {
        const results = await mockSearchApi(value);
        setSuggestions(results);
      } catch (e) {
        console.error(e);
        setSuggestions([]);
      }
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // 3) Hide suggestions on outside events if needed
  //    For simplicity, we’ll hide them if the user navigates away.
  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setShowSuggestions(false);
    });
    return () => {
      router.events.off('routeChangeStart', () => {
        setShowSuggestions(false);
      });
    };
  }, [router.events]);
  
  useEffect(() => {
    const updateWindowWidth = () => {
      setContainerWidth(window.innerWidth);
      console.log(`window.innerWidth: ${window.innerWidth}`);
    };
  
    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  const handleLogout = async () => {
    await axios.post('/api/logout');
    mutate({ ok: false, token: null, profile: null });
  };

  useEffect(() => {
    router.events.on('routeChangeStart', () => setIsOpened(false));
    return () => {
      router.events.off('routeChangeStart', () => setIsOpened(false));
    };
  }, []);
  useEffect(() => {
    const pathname = router.asPath;
    pathname.startsWith("/offline") || pathname.startsWith("/lecture/premium") ? setNavListIndex(1) :
      pathname.startsWith("/event") ? setNavListIndex(2) :
        setNavListIndex(0);
  }, [router.asPath]);

  const mobileMenuVar = {
    invisible: {
      right: '-100vw',
    },
    visible: {
      right: 0,
      transition: {
        duration: 0.4,
      },
    },
    exit: {
      right: '-100vw',
      transition: {
        duration: 0.4,
      },
    },
  };
  const mobileTabVar = {
    invisible: {
      opacity: 0,
    },
    visible: {
      opacity: 0.4,
      transition: {
        duration: 0.3,
        delay: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0,
      },
    },
  };

  const [notificationOpen, setNotificationOpen] = useState(false);
  const { data: notificationData, mutate: notiMutate } = useSWR(
    data?.token ? `/mypage/notification/page=1` : null,
    () => usersApi.myNotificationList('1', data?.token as string)
  );

  useEffect(() => { /*
    * page 이동 시 닫기
    */
    if (notificationOpen) {
      setNotificationOpen(false);
    }
  }, [router.asPath]);

  useEffect(() => {
    mutate(data);
  }, [notificationData]);

  function notificationHandle() {
    setNotificationOpen(!notificationOpen);
    notiMutate(notificationData)
  };

  // 컨테이너 width에 따른 slidesToShow 결정
  // const isMobile = containerWidth < 1280 ? true : false;
  const isMobile = containerWidth < 768 ? true : false;

  return (
    <header className='sticky top-0 left-0 z-[9999] h-auto w-screen bg-[#14161a] shadow-md'>
      <TopBanner />
      <div
        className='md:py-[24px] bg-[#14161a] lg:!px-[12px] py-[30px]'
        style={{
          paddingLeft: `${scaleValue(100, scale)}px`,
          paddingRight: `${scaleValue(100, scale)}px`,
          gap: `${scaleValue(100, scale)}px`,
        }}
      >
        {isMobile ? <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-[20px]'>
            <div>
              {/* 햄버거 메뉴바 */}
              <svg
                onClick={() => setIsOpened(true)}
                xmlns='http://www.w3.org/2000/svg'
                className='hidden h-6 w-6 md:block'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
              {/* 햄버거 메뉴바 */}
            </div>
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
              </div>
            </div>
            {/* <div>
              <form onSubmit={() => {}} className="space-y-4">
              <div className='w-[200px] relative'>
                <input
                  type="text"
                  className="w-full text-[12px] text-[#cfcfcf] px-[5px] py-[2px] bg-[#e5e5e514] border border-[#e5e5e514] rounded-sm shadow-sm focus:outline-none "
                />
                <Link href='#'>
                  <div className={`absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center`}>
                    <Image
                      src={MagnifierSmall}
                      width={10}
                      height={10.5}
                      alt='MagnifierSmall'
                      quality={100}
                      placeholder='blur'
                    />
                  </div>
                </Link>
              </div>
              </form>
            </div> */}
        </div> : <div className='2xl:flex-col-reverse 2xl:space-y-reverse 2xl:space-y-[20px] flex justify-between'>
          <div className='flex justify-between items-center flex-1'>
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
            </div>
            <div className={`flex space-x-[45px] items-center`}>
              <Link href='/'><a>
                <h3>{t('home')}</h3>
                </a></Link>
              {/* 무료라이브 */}
              <Link href='/lecture/coin/1'>
                <a
                  className={cls(
                    router.pathname === '/lecture/coin' || router.asPath.startsWith("/lecture/coin")
                      ? 'text-black bg-white/[0.8]'
                      : '',
                    'border-2 content-center rounded-full px-3 ml-20 mr-10 md:ml-5 md:mr-3 md:whitespace-nowrap'
                  )}
                >
                  <div className='flex'>
                    <svg className='my-auto mr-1.5' width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="2.5" cy="2.5" r="2.5" fill="#FF0000" />
                    </svg>
                    <span className='pb-[1px]'>{t('freeLiveLabel').split('LIVE')[0]}<span className='text-[#FF0000]'>LIVE</span></span>
                  </div>
                </a>
              </Link>
              {/* 무료라이브 */}
              <Link href='/lecture/premium/1'><a>
                <h3>{t('premiumClass')}</h3>
                </a></Link>
              <Link href='/event/1'><a>
                <h3>{t('event')}</h3>
                </a></Link>
            </div>
          </div>
          <div className='flex flex-1 justify-end space-x-[45px]'>
            <div>
              <form onSubmit={() => {}} className="space-y-4">
              <div className='w-[300px] relative'>
              <input
                  type='text'
                  placeholder={t('searchPlaceholder') as string}
                  className='w-full text-[#cfcfcf] px-3 py-2 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none'
                  value={searchQuery}
                  onChange={onChangeSearch}
                  onFocus={() => {
                    if (searchQuery.length > 0) setShowSuggestions(true);
                  }}
                />
                <Link href='#'>
                  <div className={`absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center`}>
                    <Image
                      src={Magnifier}
                      alt='Magnifier'
                      quality={100}
                      placeholder='blur'
                    />
                  </div>
                </Link>
                {/* 검색 제안 목록 (데스크톱) */}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className='absolute left-0 mt-1 py-1 w-full bg-white text-black rounded shadow-lg z-50'>
                    {suggestions.map((item, index) => (
                      <li
                        key={index}
                        className='px-3 py-1 hover:bg-gray-200 cursor-pointer text-[14px]'
                      >
                        <Link href={`/lecture/detail/${item.id}`}>
                          <a>{item.name}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              </form>
            </div>
            {/* <div className='flex space-x-[15px]'>
              <Link href='/login'>
                <a className='flex h-[2.625rem] w-[6.25rem] items-center justify-center rounded-sm bg-[#ffffff2b]'>
                  로그인
                </a>
              </Link>

              <Link href='/signup'>
                <a className='flex h-[2.625rem] w-[6.25rem] items-center justify-center rounded-sm bg-[#00e7ff] leading-3 text-[#14161a]'>
                  회원가입
                </a>
              </Link>
            </div> */}

            <nav className='flex space-x-[15px]'>
              {isAuthLoading ? (
                // 로딩 중에는 빈 버튼 또는 로딩 표시 (깜빡임 방지)
                <>
                  <div className='flex h-[2.625rem] w-[6.25rem] items-center justify-center rounded-sm bg-[#ffffff1a]'>
                    <div className='h-2 w-16 bg-[#ffffff2b] animate-pulse rounded'></div>
                  </div>
                  <div className='flex h-[2.625rem] w-[6.25rem] items-center justify-center rounded-sm bg-[#00e7ff1a]'>
                    <div className='h-2 w-16 bg-[#00e7ff2b] animate-pulse rounded'></div>
                  </div>
                </>
              ) : data?.token ? (
                <>
                  <div className="relative h-[40px] w-[32px]">
                    <button onClick={notificationHandle}>
                      <Image
                        src={data?.profile?.unread_notification_count > 0 ? notificationNew : notification}
                        layout='fill'
                        objectFit='cover' />
                    </button>
                    {notificationOpen &&
                      <>
                        <div className="fixed inset-0" onClick={() => { setNotificationOpen(false) }}></div>
                        <div className="absolute right-0 pt-2 pb-4 px-4 w-[400px] rounded-xl bg-white text-black" onClick={(e) => { e.preventDefault() }}>
                          <NotificationList in_header={true} data={notificationData?.results?.slice(0, 3)} mutate={notiMutate} token={data?.token} totalItems={data?.count} />
                        </div>
                      </>
                    }
                  </div>
  
                  <Link href='/mypage/lecture/ongoing/1'>
                    <a className='flex h-[2.625rem] w-[6.25rem] items-center justify-center rounded-sm border border-[#00e7ff] leading-3 text-[#00e7ff]'>
                      {t('myLectures')}
                    </a>
                  </Link>

                  <Link href='/mypage/notification/1'>
                    <a className='flex h-[2.625rem] w-[6.25rem] items-center justify-center rounded-sm bg-[#00e7ff] leading-3 text-[#14161a]'>
                      {t('mypage')}
                    </a>
                  </Link>

                  <div
                    onClick={handleLogout}
                    className='flex h-[2.625rem] w-[6.25rem] cursor-pointer items-center justify-center rounded-sm bg-[#ffffff2b]'
                  >
                    {t('logout')}
                  </div>
                </>
              ) : (
                <>
                  <Link href='/login'>
                    <a className='flex h-[2.625rem] w-[6.25rem] items-center justify-center rounded-sm bg-[#ffffff2b]'>
                      {t('login')}
                    </a>
                  </Link>

                  <Link href='/signup'>
                    <a className='flex h-[2.625rem] w-[6.25rem] items-center justify-center rounded-sm bg-[#00e7ff] leading-3 text-[#14161a]'>
                      {t('signup')}
                    </a>
                  </Link>
                </>
              )}
            </nav>
            <div className='ml-4'>
              <LanguageSwitcher />
            </div>
          </div>
        </div>}
      </div>
      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isOpened && (
          <motion.div
            variants={mobileMenuVar}
            initial='invisible'
            animate='visible'
            exit='exit'
            className='fixed top-0 right-0 hidden h-screen w-screen overflow-y-scroll md:flex'
          >
            <motion.div
              onClick={() => setIsOpened(false)}
              variants={mobileTabVar}
              initial='invisible'
              animate='visible'
              exit='exit'
              className='grow bg-black opacity-40'
            />

            <motion.div className='flex w-80 flex-col justify-between bg-[#282e38] pt-10'>
              <div>
                {/* 로고 & X */}
                <div className='flex items-center justify-between pl-10 pr-6'>
                  {/* 로그인 상태 */}
                  <Link href='/'>
                  <svg
                    viewBox='0 0 178 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='md:w-40'
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
                  </Link>
                  {/* 로그인 상태 */}

                  <div onClick={() => setIsOpened(false)}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M6 18L18 6M6 6l12 12'
                      />
                    </svg>
                  </div>
                </div>
                {/* 로고 & X */}

                {/* <Link href='#'>
                <h3>홈</h3>
              </Link>
              <Link href='/lecture/coin/1'><a>
                <h3>무료라이브</h3>
                </a></Link>
              <Link href='/lecture/premium/1'><a>
                <h3>프리미엄클래스</h3>
                </a></Link>
              <Link href='#'>
                <h3>이벤트</h3>
              </Link> */}

                {/* 메뉴 */}
                <div className='mt-10'>
                  {isAuthLoading ? (
                    // 로딩 중 - 기본 메뉴만 표시
                    <>
                      <Link href='/lecture/coin/1'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('freeLive')}
                          </div>
                        </a>
                      </Link>

                      <Link href='/lecture/premium/1'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('premiumClass')}
                          </div>
                        </a>
                      </Link>

                      <Link href='/event/1'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('event')}
                          </div>
                        </a>
                      </Link>
                    </>
                  ) : data?.token ? (
                    // 로그인 상태
                    <>
                      <Link href='/lecture/coin/1'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('freeLive')}
                          </div>
                        </a>
                      </Link>

                      <Link href='/lecture/premium/1'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('premiumClass')}
                          </div>
                        </a>
                      </Link>

                      <Link href='/event/1'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('event')}
                          </div>
                        </a>
                      </Link>

                      <Link href='/mypage/lecture/ongoing/1'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('myLectures')}
                          </div>
                        </a>
                      </Link>

                      <Link href='/mypage/notification/1'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('mypage')}
                          </div>
                        </a>
                      </Link>
                    </>
                  ) : (
                    // 로그아웃 상태
                    <>
                      <Link href='/lecture/coin/1'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('freeLive')}
                          </div>
                        </a>
                      </Link>

                      <Link href='/lecture/premium/1'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('premiumClass')}
                          </div>
                        </a>
                      </Link>

                      <Link href='/event/1'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('event')}
                          </div>
                        </a>
                      </Link>

                      <Link href='/login'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('login')}
                          </div>
                        </a>
                      </Link>

                      <Link href='/signup'>
                        <a>
                          <div className='border-b border-[#373c46] pb-4 pl-10 pr-6 pt-5'>
                            {t('signup')}
                          </div>
                        </a>
                      </Link>
                    </>
                  )}
                </div>
                {/* 메뉴 */}

                {/* 이용약관 */}
                <div className='mt-28 space-y-3 pl-10 text-sm text-white opacity-60'>
                  <div>
                    <Link href='/about-us'>
                      <a>
                        <div>{t('aboutUs')}</div>
                      </a>
                    </Link>
                  </div>

                  <div>
                    <Link href='/terms-of-service'>
                      <a>
                        <div>{t('termsOfService')}</div>
                      </a>
                    </Link>
                  </div>

                  <div>
                    <Link href='/refund-policy'>
                      <a>
                        <div>{t('refundPolicy')}</div>
                      </a>
                    </Link>
                  </div>

                  <div>
                    <Link href='/privacy-policy'>
                      <a>
                        <div className='underline'>{t('privacyPolicy')}</div>
                      </a>
                    </Link>
                  </div>
                </div>
                {/* 이용약관 */}
              </div>

              {!isAuthLoading && data?.token && (
                <div
                  onClick={handleLogout}
                  className='flex h-16 w-full items-center space-x-3 bg-[#373c46] pl-10'
                >
                  <svg
                    width='16'
                    height='17'
                    viewBox='0 0 16 17'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='opacity-60 '
                  >
                    <path
                      d='M9 0H7V10H9V0ZM12.56 2.44L11.11 3.89C12.84 4.94 14 6.83 14 9C14 12.31 11.31 15 8 15C4.69 15 2 12.31 2 9C2 6.83 3.16 4.94 4.88 3.88L3.44 2.44C1.36 3.88 0 6.28 0 9C0 13.42 3.58 17 8 17C12.42 17 16 13.42 16 9C16 6.28 14.64 3.88 12.56 2.44Z'
                      fill='white'
                    />
                  </svg>

                  <div className='text-sm opacity-60 '>{t('logout')}</div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 모바일 메뉴 */}
    </header>
  );
}
