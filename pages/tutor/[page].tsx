// import Banner from '@components/tutor/banner';
import TutorList from '@components/tutor/tutorList';
import SEO from '@components/seo';
import { lecturesApi } from '@libs/api';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Banner from '@components/lecture/banner';

const Tutor: NextPage<{ page: string }> = ({ page }) => {
  const { data, error } = useSWR(`/lectures/tutor?page=${page}`, () =>
    lecturesApi.tutorList(page)
  );
  const router = useRouter();

  if (error) {
    router.push('/');
  }
  return (
    <>
      <SEO
        title='클럽밀머스 | 밀레니얼머니스쿨 - 밀머스'
        description='최고의 실전 고수들이 모인 멘토들의 커뮤니티입니다.'
      />
      <Banner />
      <div style={{maxWidth: '1024px', margin: "auto"}}>
        <TutorList
          title='클럽밀머스'
          data={data?.results}
          totalItems={data?.count}
        />
      </div>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      page: ctx.params?.page,
    },
  };
};

export default Tutor;
