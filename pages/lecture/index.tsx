import Navigator from '@components/lecture/navigator';
import SEO from '@components/seo';
import { lecturesApi } from '@libs/api';
import type { NextPage } from 'next';
import Banner from '@components/lecture/banner';
import Best from '@components/lecture/best';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Lecture: NextPage = () => {
  const { data, error } = useSWR('/cms/class', () =>
    lecturesApi.topLectureList()
  );
  const router = useRouter();

  if (error) {
    router.push('/');
  }
  return (
    <>
      <SEO
        title='BEST 클래스 | 밀레니얼머니스쿨 - 밀머스'
        description='경제적 자유를 앞당기는 가장 인기 있는 클래스만 모았습니다.'
      />
      <Banner />
      <div style={{overflow: "hidden"}}>
        <Navigator />
        <Best {...data} />
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

export default Lecture;
