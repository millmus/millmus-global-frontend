import Layout from '@layouts/sectionLayout';
import { usersApi } from '@libs/api';
import { useUser } from '@libs/client/useUser';
import useSWR from 'swr';
import cookies from 'next-cookies';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext, NextPage } from 'next';
import SEO from '@components/seo';
import Header from '@components/mypage/header';
import Navigator from '@components/mypage/navigator';
import NotificationList from '@components/mypage/notificationList';

interface IProps {
  page: string;
}

const MyPurchaseList: NextPage<IProps> = ({ page }) => {
  const router = useRouter();
  const { token } = useUser({
    isPrivate: true,
  });
  const { data, error, mutate } = useSWR(
    token ? `/mypage/notification/page=${page}` : null,
    () => usersApi.myNotificationList(page, token as string)
  );
  if (error) router.push('/');
  return (
    <>
      <SEO title='마이페이지' />

      <Layout padding='pt-20 pb-44 md:pt-4'>
        <Header />

        <div className='mt-[4.5rem] flex space-x-10 md:mt-0 md:block md:space-x-0'>
          <Navigator />

          <div className='grow space-y-6 md:mt-8'>
            <NotificationList in_header={false} data={data?.results} mutate={mutate} token={token} totalItems={data?.count}/>
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { token } = cookies(ctx);
  return {
    props: {
      page: ctx.params?.page,
    },
  };
};

export default MyPurchaseList;
