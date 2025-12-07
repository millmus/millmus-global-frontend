import Header from '@components/mypage/header';
import LectureList from '@components/mypage/lectureList';
import Navigator from '@components/mypage/navigator';
import SEO from '@components/seo';
import Layout from '@layouts/sectionLayout';
import { usersApi } from '@libs/api';
import { cls } from '@libs/client/utils';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useUser } from '@libs/client/useUser';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

interface IProps {
  slug: string[];
}

const MyLectureList: NextPage<IProps> = ({ slug }) => {
  const { t } = useTranslation('mypage');
  const { token } = useUser({
    isPrivate: true,
  });
  const [category, page] = slug;
  const { data, error } = useSWR(
    token
      ? `/mypage/registered_lecture?category=${category}&page=${page}`
      : null,
    () => usersApi.myLectureList(category !== 'ongoing', page, token as string)
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

          <div className='grow overflow-x-hidden space-y-6 md:mt-8'>
            <div className='flex space-x-5 text-lg font-medium md:text-sm'>
              <Link href='/mypage/lecture/ongoing/1'>
                <a>
                  <div
                    className={cls(
                      category === 'ongoing'
                        ? ''
                        : 'cursor-pointer text-[#afafaf]',
                      'transition-all'
                    )}
                  >
                    {t('tabs.studying')}
                  </div>
                </a>
              </Link>

              <Link href='/mypage/lecture/completed/1'>
                <a>
                  <div
                    className={cls(
                      category === 'completed'
                        ? ''
                        : 'cursor-pointer text-[#afafaf]',
                      'transition-all'
                    )}
                  >
                    {t('tabs.completed')}
                  </div>
                </a>
              </Link>
            </div>

            <LectureList
              data={
                category === 'ongoing'
                  ? data?.registered.results
                  : data?.expired.results
              }
              totalItems={
                category === 'ongoing'
                  ? data?.registered.count
                  : data?.expired.count
              }
            />
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
      slug: ctx.params?.slug,
    },
  };
};

export default MyLectureList;
