import TopLectureList from '@components/topLectureList';
import Layout from '@layouts/sectionLayout';
import { useRouter } from 'next/router';

interface IProps {
  realty_class: any[];
  stock_class: any[];
  coin_class: any[];
  business_class: any[];
  master_class: any[];
  premium_class: any[];
}

export default function Best({
  realty_class,
  stock_class,
  coin_class,
  business_class,
  master_class,
  premium_class,
}: IProps) {
  const router = useRouter();
  if (router.pathname === '/lecture') {
    return (
      <Layout padding='pt-24 pb-44 md:py-10'>
        <div className='space-y-28 md:space-y-12'>
          {/* 무료특강 Top3 강의 */}
          <TopLectureList
            title='무료특강'
            data={coin_class?.map((i) => i.lecture)}
            url='/lecture/coin/1'
          />
          {/* 무료특강 Top3 강의 */}

          {/* 부동산 Top3 강의 */}
          <TopLectureList
            title='부동산 TOP3 강의'
            data={realty_class?.map((i) => i.lecture)}
            url='/lecture/real-estate/1'
          />
          {/* 부동산 Top3 강의 */}

          {/* 주식 Top3 강의 */}
          <TopLectureList
            title='주식 TOP3 강의'
            data={stock_class?.map((i) => i.lecture)}
            url='/lecture/stock/1'
          />
          {/* 주식 Top3 강의 */}

          {/* 온라인창업 Top3 강의 */}
          <TopLectureList
            title='온라인창업 TOP3 강의'
            data={business_class?.map((i) => i.lecture)}
            url='/lecture/online-business/1'
          />
          {/* 온라인창업 Top3 강의 */}

          {/* 마스터 시리즈 */}
          <TopLectureList
            title='마스터 시리즈'
            data={master_class?.map((i) => i.lecture)}
            url='/lecture/master/1'
          />
          {/* 마스터 시리즈 */}
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout padding='pt-24 pb-44 md:py-10'>
        <div className='space-y-28 md:space-y-12'>
          {/* 프리미엄 스터디 */}
          <TopLectureList
            title='프리미엄클래스'
            data={premium_class?.map((i) => i.lecture)}
            url='/lecture/premium/1'
          />
          {/* 프리미엄 스터디 */}
        </div>
      </Layout>
    );
  }
}