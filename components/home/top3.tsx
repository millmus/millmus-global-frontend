import TopLectureList from '@components/topLectureList';
import Layout from '@layouts/sectionLayout';

interface IProps {
  realty: any[];
  stock: any[];
  business: any[];
  master: any[];
}

export default function Top3({ realty, stock, master, business }: IProps) {
  return (
    <Layout padding='py-24 md:py-10'>
      <div className='space-y-28 md:space-y-12'>
        {/* 부동산 Top3 강의 */}
        <TopLectureList
          title='부동산 TOP3 강의'
          data={realty}
          url='/lecture/real-estate/1'
        />
        {/* 부동산 Top3 강의 */}

        {/* 주식 Top3 강의 */}
        <TopLectureList
          title='주식 TOP3 강의'
          data={stock}
          url='/lecture/stock/1'
        />
        {/* 주식 Top3 강의 */}

        {/* 온라인창업 Top3 강의 */}
        <TopLectureList
          title='온라인창업 TOP3 강의'
          data={business}
          url='/lecture/online-business/1'
        />
        {/* 온라인창업 Top3 강의 */}
        
        {/* 마스터 시리즈 */}
        <TopLectureList
          title='마스터 시리즈 TOP3 강의'
          data={master}
          url='/lecture/master/1'
        />
        {/* 마스터 시리즈 */}
      </div>
    </Layout>
  );
}
