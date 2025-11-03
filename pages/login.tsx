import EventSlider from '@components/login/eventSlider';
import SEO from '@components/seo';
import type { NextPage } from 'next';
import { useUser } from '@libs/client/useUser';
import GoogleBtn from '@components/login/googleBtn';

const Login: NextPage = () => {
  useUser({
    isPrivate: false,
  });

  return (
    <>
      <SEO
        title='로그인'
        description='밀레니얼 머니스쿨 로그인 페이지 입니다.'
      />
      <div className='mx-auto my-28 flex max-w-[32.5rem] flex-col items-center rounded-lg bg-[#373c46] p-[3.75rem] md:my-12 md:max-w-[330px] md:bg-transparent md:p-0'>
        <h1 className='text-2xl font-medium md:text-xl'>로그인</h1>

        {/* 슬라이더 */}
        <EventSlider />

        {/* SNS 로그인 */}
        <div className='mt-8 flex w-full justify-center'>
          <div className='w-[330px] space-y-2'>
            <GoogleBtn />
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className='mt-6 text-center text-sm text-[#cfcfcf]'>
          <p>Google 계정으로 간편하게 로그인하세요</p>
        </div>
      </div>
    </>
  );
};

export default Login;
