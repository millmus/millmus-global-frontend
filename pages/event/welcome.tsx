import SEO from '@components/seo';
import Layout from '@layouts/sectionLayout';
import { eventApi } from '@libs/api';
import type { GetServerSidePropsContext, NextPage } from 'next';
import useSWR from 'swr';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Event: NextPage = () => {
  const { t } = useTranslation('seo');
  const router = useRouter();
  async function init() {
    const { data: myData } = await axios.get('/api/user');
    if (!myData?.token) {
      router.push('/login');
    } else {
      const { data: response } = await eventApi.createWelcomeCoupon(myData?.token);
      if (response?.msg == "already exist") {
        alert("이미 쿠폰을 받으셨습니다.");
      } else {
        alert("쿠폰이 발급되었습니다.");
      }
      router.push('/mypage/coupon/1');
    }
  }
  useEffect(() => {
    init();
  }, []);
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
      </Layout>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'seo'])),
    },
  };
};

export default Event;
