// import CategoryBanner from '@components/lecture/categoryBanner';
import Navigator from '@components/lecture/navigator';
import LectureList from '@components/lecture/lectureList';
import SEO from '@components/seo';
import { lecturesApi } from '@libs/api';
import type { GetServerSidePropsContext, NextPage } from 'next';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Banner from '@components/lecture/banner';
import { useEffect, useState } from 'react';
import { ICard } from 'types';
import MainBanner from '@components/MainBanner';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface IProps {
  category: string;
  page: string;
}

const Lectures: NextPage<IProps> = ({ category, page }) => {
  const router = useRouter();
  const { t } = useTranslation('seo');
  const { data: mainBanner } = useSWR('/cms/main_banner', () => lecturesApi.mainBannerList());
  const [mainBannerList, setMainBannerList] = useState<ICard[]>([]);

  const getSeoKeys = (cat: string) => {
    switch (cat) {
      case 'real-estate':
        return { titleKey: 'realEstateTitle', descKey: 'realEstateDescription', apiCategory: 'Real Estate' };
      case 'stock':
        return { titleKey: 'stockTitle', descKey: 'stockDescription', apiCategory: 'Stock' };
      case 'coin':
        return { titleKey: 'freeLiveTitle', descKey: 'freeLiveDescription', apiCategory: 'Free Live' };
      case 'online-business':
        return { titleKey: 'onlineBusinessTitle', descKey: 'onlineBusinessDescription', apiCategory: 'Online Business' };
      case 'master':
        return { titleKey: 'masterSeriesTitle', descKey: 'masterSeriesDescription', apiCategory: 'Master Series' };
      case 'premium':
        return { titleKey: 'premiumClassTitle', descKey: 'premiumClassDescription', apiCategory: 'Premium Class' };
      default:
        return { titleKey: '', descKey: '', apiCategory: '' };
    }
  };

  const { titleKey, descKey, apiCategory } = getSeoKeys(category);

  const { data, error } = useSWR(`/lectures/${category}/${page}`, () =>
    lecturesApi.lectureList(apiCategory, page)
  );

  if (error) {
    router.push('/');
  }

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

  return (
    <>
      <SEO
        title={t(titleKey)}
        description={t(descKey)}
      />
      {/* <CategoryBanner /> */}
      <div className='bg-[#000] flex flex-col items-center justify-center'>
        <div className='w-full max-w-[1024px] md:max-w-[330px] layout-overflow'>
          <MainBanner itemList={mainBannerList} />
        </div>
      </div>
      <div style={{ overflow: "hidden" }}>
        {/* <Navigator /> */}
        <LectureList
          title={apiCategory}
          data={category === 'premium' ? data?.results?.map((d: any) => { if (d.series) { d.id = d.series.ticket_id; } return d; }) : data?.results}
          totalItems={data?.count}
        />
      </div>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'seo'])),
      category: ctx.params?.category,
      page: ctx.params?.page,
    },
  };
};

export default Lectures;
