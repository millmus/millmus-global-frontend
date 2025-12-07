import CouponList from '@components/mypage/couponList';
import Header from '@components/mypage/header';
import Navigator from '@components/mypage/navigator';
import SEO from '@components/seo';
import Layout from '@layouts/sectionLayout';
import { usersApi } from '@libs/api';
import { useUser } from '@libs/client/useUser';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

interface IProps {
  page: string;
}

const Coupon: NextPage<IProps> = ({ page }) => {
  const { t } = useTranslation('mypage');
  const { token } = useUser({
    isPrivate: true,
  });
  const { data, error } = useSWR(
    token ? `/mypage/coupon?page=${page}` : null,
    () => usersApi.myCouponList(page, token as string)
  );
  const router = useRouter();

  if (error) {
    router.push('/');
  }
  return (
    <>
      <SEO title='마이페이지' />

      <Layout padding='pt-20 pb-44 md:pt-4'>
        <Header />

        <div className='mt-[4.5rem] flex space-x-10 md:mt-0 md:block md:space-x-0'>
          <Navigator />

          <div className='grow md:mt-8'>
            <div className='space-y-6'>
              <div className='flex space-x-5'>
                <div className='text-lg font-medium'>{t('couponTitle')}</div>

                <Link href='/mypage/point/1'>
                  <a>
                    <div className='text-lg font-medium text-[#afafaf]'>
                      {t('pointTitle')}
                    </div>
                  </a>
                </Link>
              </div>

              <CouponList data={data?.results} totalItems={data?.count} />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const locale = ctx.locale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'mypage'])),
      page: ctx.params?.page,
    },
  };
};

export default Coupon;
