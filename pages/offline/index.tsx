import Navigator from '@components/lecture/navigator';
import SEO from '@components/seo';
import { lecturesApi } from '@libs/api';
import type { NextPage } from 'next';
import Banner from '@components/lecture/banner';
import Best from '@components/lecture/best';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Lecture: NextPage = () => {
  const { t } = useTranslation('seo');
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
        title={t('bestClassTitle') as string}
        description={t('bestClassDescription') as string}
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
      ...(await serverSideTranslations(locale, ['common', 'seo'])),
    },
  };
}

export default Lecture;
