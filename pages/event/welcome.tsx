import SEO from '@components/seo';
import Layout from '@layouts/sectionLayout';
import { eventApi } from '@libs/api';
import type { GetServerSidePropsContext, NextPage } from 'next';
import useSWR from 'swr';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Event: NextPage = () => {
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
        title='이벤트 | 밀레니얼머니스쿨 - 밀머스'
        description='따끈한 온오프 행사 소식을 바로 만나보세요!'
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
    },
  };
};

export default Event;
