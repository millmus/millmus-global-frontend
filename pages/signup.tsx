import SEO from '@components/seo';
import Input from '@components/input';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usersApi } from '@libs/api';
import useSWR from 'swr';

interface IForm {
  nickname: string;
  phoneNum: string;
  adAgree: boolean;
}

const Signup: NextPage = () => {
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
        setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title='회원가입'
        description='밀레니얼 머니스쿨 회원가입 페이지 입니다.'
      />
      <div className='mx-auto my-28 flex max-w-[32.5rem] flex-col items-center rounded-lg bg-[#373c46] p-[3.75rem] md:my-12 md:max-w-[330px] md:bg-transparent md:p-0'>
        <h1 className='text-2xl font-medium md:text-xl'>회원가입</h1>

        {/* 안내 메시지 */}
        <div className='mt-6 text-center text-sm text-[#cfcfcf]'>
          <p>Google 계정으로 로그인하셨습니다</p>
          <p className='mt-1'>추가 정보를 입력해주세요</p>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className='mt-8 w-full space-y-4'>
          {/* 닉네임 */}
          <Input
            type='text'
            label='닉네임'
            register={register('nickname', {
              required: '닉네임을 입력해주세요',
              minLength: {
                value: 2,
                message: '닉네임은 2자 이상이어야 합니다',
              },
              maxLength: {
                value: 20,
                message: '닉네임은 20자 이하여야 합니다',
              },
            })}
            error={errors?.nickname?.message}
          />

          {/* 전화번호 */}
          <Input
            type='tel'
            label='전화번호'
            register={register('phoneNum', {
              required: '전화번호를 입력해주세요',
              pattern: {
                value: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
                message: '올바른 전화번호를 입력해주세요',
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
              마케팅 정보 수신 동의 (선택)
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
            {loading ? '처리 중...' : '회원가입 완료'}
          </button>

          {/* 로그인 페이지로 돌아가기 */}
          <button
            type='button'
            onClick={() => router.replace('/login')}
            className='mt-2 w-full text-center text-sm text-[#cfcfcf] hover:text-white'
          >
            로그인 페이지로 돌아가기
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;
