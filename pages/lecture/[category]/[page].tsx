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

interface IProps {
  category: string;
  page: string;
}

const Lectures: NextPage<IProps> = ({ category, page }) => {
  const router = useRouter();
  const { data: mainBanner } = useSWR('/cms/main_banner', () => lecturesApi.mainBannerList());
  const [mainBannerList, setMainBannerList] = useState<ICard[]>([]);

  const categoryReq =
    category === 'real-estate'
      ? '부동산'
      : category === 'stock'
        ? '주식'
        : category === 'coin'
          ? '무료특강'
          : category === 'online-business'
            ? '온라인창업'
            : category === 'master'
              ? '마스터 시리즈'
              : category === 'premium'
                ? '프리미엄 스터디'
                : '';
  const categoryDescription =
    category === 'real-estate'
      ? '지금 바로 적용할 수 있는 실전 부동산 투자 클래스입니다.'
      : category === 'stock'
        ? '주식투자의 기본기를 탄탄하게 쌓을 수 있는 클래스입니다.'
        : category === 'coin'
          ? '무료특강 클래스입니다.'
          : category === 'online-business'
            ? '직장인도 도전할 수 있는 온라인창업 클래스의 모든 것.'
            : '';
  const { data, error } = useSWR(`/lectures/${category}/${page}`, () =>
    lecturesApi.lectureList(categoryReq === "무료특강" ? "코인" : categoryReq, page)
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
        title={`${categoryReq} 클래스 | 밀레니얼머니스쿨 - 밀머스`}
        description={categoryDescription}
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
          title={categoryReq == '프리미엄 스터디' ? '프리미엄클래스' : categoryReq}
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
      category: ctx.params?.category,
      page: ctx.params?.page,
    },
  };
};

export default Lectures;
