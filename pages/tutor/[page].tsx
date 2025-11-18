// import Banner from '@components/tutor/banner';
import TutorList from '@components/tutor/tutorList';
import SEO from '@components/seo';
import { lecturesApi } from '@libs/api';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Banner from '@components/lecture/banner';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Tutor: NextPage<{ page: string }> = ({ page }) => {
  const { t } = useTranslation('seo');
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
        title={t('clubMillmusTitle') as string}
        description={t('clubMillmusDescription') as string}
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
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'seo'])),
      page: ctx.params?.page,
    },
  };
};

export default Tutor;
