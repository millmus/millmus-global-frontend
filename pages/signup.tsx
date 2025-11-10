import SEO from '@components/seo';
import Input from '@components/input';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usersApi } from '@libs/api';
import useSWR from 'swr';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface IForm {
  nickname: string;
  phoneNum: string;
  adAgree: boolean;
}

const Signup: NextPage = () => {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const { type, id, name } = router.query;
  const { mutate } = useSWR('/api/user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>();

  useEffect(() => {
    // SNS 로그인 정보가 없으면 로그인 페이지로 리다이렉트
    if (!type || !id || !name) {
      router.replace('/login');
    }
  }, [type, id, name, router]);

  const onSubmit = async (data: IForm) => {
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      // SNS 회원가입 API 호출
      await usersApi.snsSignup({
        type: type as string,
        id: id as string,
        name: name as string,
        phoneNum: data.phoneNum,
        nickname: data.nickname,
        adAgree: data.adAgree,
      });

      // 회원가입 성공 후 자동 로그인
      const {
        data: { msg },
      } = await usersApi.loginNextApi({
        type: type as string,
        id: id as string,
      });

      if (!msg) {
        // 로그인 성공 - 사용자 정보 갱신 후 메인 페이지로 이동
        mutate();
        router.replace('/');
      }
    } catch (err: any) {
      console.error('회원가입 실패:', err);
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(t('signupError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title={t('signupPageTitle')}
        description={t('signupPageDescription')}
      />
      <div className='mx-auto my-28 flex max-w-[32.5rem] flex-col items-center rounded-lg bg-[#373c46] p-[3.75rem] md:my-12 md:max-w-[330px] md:bg-transparent md:p-0'>
        <h1 className='text-2xl font-medium md:text-xl'>{t('signupTitle')}</h1>

        {/* 안내 메시지 */}
        <div className='mt-6 text-center text-sm text-[#cfcfcf]'>
          <p>{t('signupInfoMessage1')}</p>
          <p className='mt-1'>{t('signupInfoMessage2')}</p>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className='mt-8 w-full space-y-4'>
          {/* 닉네임 */}
          <Input
            type='text'
            label={t('nickname')}
            register={register('nickname', {
              required: t('nicknameRequired'),
              minLength: {
                value: 2,
                message: t('nicknameMinLength'),
              },
              maxLength: {
                value: 20,
                message: t('nicknameMaxLength'),
              },
            })}
            error={errors?.nickname?.message}
          />

          {/* 전화번호 */}
          <Input
            type='tel'
            label={t('phoneNumber')}
            register={register('phoneNum', {
              required: t('phoneNumberRequired'),
              pattern: {
                value: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
                message: t('phoneNumberInvalid'),
              },
            })}
            error={errors?.phoneNum?.message}
          />

          {/* 약관 동의 */}
          <div className='flex items-start'>
            <input
              type='checkbox'
              id='adAgree'
              {...register('adAgree')}
              className='mt-1 h-4 w-4 cursor-pointer'
            />
            <label htmlFor='adAgree' className='ml-2 cursor-pointer text-sm text-[#cfcfcf]'>
              {t('marketingConsent')}
            </label>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className='rounded bg-red-500/10 p-3 text-center text-sm text-red-500'>
              {error}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type='submit'
            disabled={loading}
            className='mt-6 h-[3.75rem] w-full rounded bg-[#4285f4] font-medium text-white transition-colors hover:bg-[#357ae8] disabled:cursor-not-allowed disabled:opacity-50 md:h-14'
          >
            {loading ? t('processing') : t('signupComplete')}
          </button>

          {/* 로그인 페이지로 돌아가기 */}
          <button
            type='button'
            onClick={() => router.replace('/login')}
            className='mt-2 w-full text-center text-sm text-[#cfcfcf] hover:text-white'
          >
            {t('backToLogin')}
          </button>
        </form>
      </div>
    </>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
    },
  };
}

export default Signup;
