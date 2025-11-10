import FreeLiveList from '@components/FreeLiveList';
import FreeSchoolList from '@components/FreeSchoolList';
import Banner from '@components/home/banner';
import Best from '@components/home/best';
import Community from '@components/home/community';
import Customized from '@components/home/customized';
import Popup from '@components/home/popup';
import Top3 from '@components/home/top3';
import MainBanner from '@components/MainBanner';
import PremiumLiveList from '@components/PremiumLiveList';
import SalesVerificationRelayList from '@components/SalesVerificationRelayList';
// import SEO from '@components/seo';
import { lecturesApi } from '@libs/api';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useResponsiveScale from '../hooks/useResponsiveScale';
import { scaleValue } from '../utils/responsive';
import { set } from 'react-hook-form';
import { ICard } from '../types';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// interface IFallback {
//   data: any[];
// }

const Home: NextPage = () => {
  const scale = useResponsiveScale();
  const { data: mainBanner } = useSWR('/cms/main_banner', () => lecturesApi.mainBannerList());
  const { data: coinClass } = useSWR('/cms/coin_class', () => lecturesApi.coinClassList());
  const { data: premiumClass } = useSWR('/cms/premium_class', () => lecturesApi.premiumClassList());
  const { data } = useSWR('/cms/main', () => lecturesApi.mainLectureList());
  // 무료라이브
  const [coinClassList, setCoinClassList] = useState<ICard[]>([]);
  // 프리미엄라이브
  const [premiumClassList, setPremiumClassList] = useState<ICard[]>([]);
  const [bestClassList, setBestClassList] = useState<ICard[]>([]);
  // 프리스쿨
  const [businessClassList, setBusinessClassList] = useState<ICard[]>([]);
  // 매출인증 릴레이
  const [stockClassList, setStockClassList] = useState<ICard[]>([]);
  const [mainBannerList, setMainBannerList] = useState<ICard[]>([]);

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

  useEffect(() => {
    if (data) {
      const cards: ICard[] = [];
      const best_class = data.best_class;
      best_class.forEach((item: any) => {
        const card: ICard = {
          id: item.lecture.id,
          title: item.lecture.name,
          imageLink: item.lecture.image,
          link: `/lecture/detail/${item.lecture.id}`,
        }
        cards.push(card);
      });
      setBestClassList(cards);

      const business_class = data.business_class;
      const businessCards: ICard[] = [];
      business_class.forEach((item: any) => {
        const card: ICard = {
          id: item.lecture.id,
          title: item.lecture.name,
          imageLink: item.main_thumbnail,
          link: `/lecture/detail/${item.lecture.id}`,
        }
        businessCards.push(card);
      });
      setBusinessClassList(businessCards);

      const stock_class = data.stock_class;
      const stockCards: ICard[] = [];
      stock_class.forEach((item: any) => {
        const card: ICard = {
          id: item.order,
          title: item.order,
          imageLink: item.main_thumbnail,
          link: `#`,
        }
        stockCards.push(card);
      });
      setStockClassList(stockCards);
    }
  }, [data])

  useEffect(() => {
    if (mainBanner) {
      const cards: ICard[] = [];
      mainBanner.forEach((item: any) => {
        // https://millmus.com/lecture/detail/379
        // item.url은 위와 같은 형태이고
        // item.url에서 숫자만 추출하여 id로 사용
        const id = item.url.match(/\d+/g);


        const card: ICard = {
          // id: item.order,
          id: id,
          title: item.title,
          imageLink: item.img,
          link: item.url,
        }
        cards.push(card);
      });
      setMainBannerList(cards);
    }
  }, [mainBanner])

  useEffect(() => {
    if (coinClass) {
      const coin_class = coinClass;
      const coinCards: ICard[] = [];
      coin_class.forEach((item: any) => {
        const card: ICard = {
          id: item.lecture.id,
          title: item.lecture.name,
          imageLink: item.main_thumbnail,
          link: `/lecture/detail/${item.lecture.id}`,
        }
        coinCards.push(card);
      });
      setCoinClassList(coinCards);
    }
  }, [coinClass])

  useEffect(() => {
    if (premiumClass) {
      const premium_class = premiumClass;
      const premiumCards: ICard[] = [];
      premium_class.forEach((item: any) => {
        const card: ICard = {
          id: item.lecture.id,
          title: item.lecture.name,
          imageLink: item.main_thumbnail,
          link: `/lecture/detail/${item.lecture.id}`,
        }
        premiumCards.push(card);
      });
      setPremiumClassList(premiumCards);
    }
  }, [premiumClass])

  // 컨테이너 width에 따른 slidesToShow 결정
  const isMobile = containerWidth < 1280 ? true : false;

  return (
    <>
      <Head>
        <title>밀레니얼머니스쿨 - 끝까지 듣고 성과나는 프리미엄 클래스</title>
        <meta
          name='description'
          content='이커머스, 투자, 자기계발까지 각 분야 최고 멘토들의 무료라이브와 프리미엄 클래스로 차원이 다른 성장을 경험하세요!'
        />
        <meta
          property='og:title'
          content='밀레니얼머니스쿨 - 끝까지 듣고 성과나는 프리미엄 클래스'
        />
        <meta
          property='og:description'
          content='이커머스, 투자, 자기계발까지 각 분야 최고 멘토들의 무료라이브와 프리미엄 클래스로 차원이 다른 성장을 경험하세요!'
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/font-kopubworld@1.0.3/css/all.min.css"></link>
      </Head>

      {/* 최대 넓이는 1920 */}
      <div 
        style={{
          fontFamily: 'KoPubWorld Dotum',
          // fontWeight: 300,
          fontWeight: 400,
          // fontWeight: 700,
        }}
        // className={`max-w-[1920px] mx-auto`}
      >
        <MainBanner itemList={mainBannerList} />
        <div
          style={{
            paddingLeft: `${scaleValue(100, scale)}px`,
            paddingRight: `${scaleValue(100, scale)}px`,
            paddingTop: `${scaleValue(110, scale)}px`,
            paddingBottom: `${scaleValue(110, scale)}px`,
            gap: `${scaleValue(100, scale)}px`,
          }}
          className="flex flex-col lg:!px-[12px]"
        >
          <FreeLiveList itemList={coinClassList} />
          <PremiumLiveList itemList={premiumClassList} />
          <FreeSchoolList itemList={businessClassList} />
          <SalesVerificationRelayList itemList={stockClassList} /> 
        </div>
        <div
          style={{
            paddingLeft: `${isMobile ? scaleValue(100, scale) : 0}px`,
            paddingRight: `${isMobile ? scaleValue(100, scale) : 0}px`,
            paddingTop: `${isMobile ? scaleValue(100, scale) : 0}px`,
            paddingBottom: `${isMobile ? scaleValue(100, scale) : 0}px`,
            gap: `${scaleValue(100, scale)}px`,
          }}
          className="flex flex-col lg:!px-[12px] bg-[#000]"
        >
          <Community />
          <Popup />
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default Home;
