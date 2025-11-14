import EventList from '@components/event/eventList';
import SEO from '@components/seo';
import Layout from '@layouts/sectionLayout';
import { eventApi } from '@libs/api';
import type { GetServerSidePropsContext, NextPage } from 'next';
import useSWR from 'swr';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Event: NextPage<{ page: string }> = ({ page }) => {
  const { t } = useTranslation('seo');
  const { data } = useSWR(`/event?page=${page}`, () =>
    eventApi.eventList(page)
  );
  return (
    <>
      <SEO
        title={t('eventTitle')}
        description={t('eventDescription')}
      />
      <Layout padding='pt-24 pb-44 md:py-10'>
        <div className='mb-14 text-2xl font-bold md:mb-6 md:text-xl'>
          이벤트
        </div>
        <EventList data={data?.results} totalItems={data?.count} />
      </Layout>
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

export default Event;
