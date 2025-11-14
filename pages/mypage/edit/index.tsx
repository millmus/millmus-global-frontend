import Header from '@components/mypage/header';
import Input from '@components/mypage/input';
import Navigator from '@components/mypage/navigator';
import SEO from '@components/seo';
import Layout from '@layouts/sectionLayout';
import { usersApi } from '@libs/api';
import { useUser } from '@libs/client/useUser';
import useMutation from '@libs/client/useMutation';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface IForm {
  name: string;
  nickname: string;
  phoneNum: string;
  password: string;
  passwordCheck: string;
  adAgree: boolean;
}

const EditProfile: NextPage = () => {
  const { t } = useTranslation(['mypage', 'seo']);
  const { token, profile } = useUser({
    isPrivate: true,
  });
  const [editMyInfos, { loading: editLoading }] = useMutation(
    usersApi.editInfos
  );
  const [withdrawUser, { loading: withdrawLoading }] = useMutation(
    usersApi.withdraw
  );
  const [pwTabOpen, setPwTabOpen] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showWithdrawCompleteModal, setShowWithdrawCompleteModal] = useState(false);
  const [withdrawalReason, setWithdrawalReason] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IForm>({
    mode: 'onChange',
  });
  const onValid = (data: IForm) => {
    try {
      const req = {
        ...(data.name && { name: data.name }),
        ...(data.nickname && { nickname: data.nickname }),
        ...(data.phoneNum && { phoneNum: data.phoneNum }),
        ...(data.password && { password: data.password }),
        adAgree: data.adAgree,
        token,
      };
      editMyInfos({ req });
      alert(t('mypage:profileUpdateSuccess'));
      const user_obj = {
        // profile: {
        //   mobileNumber: data.phoneNum,
        //   name: name,
        // },
        tags: ["Profile Update"],
        unsubscribeEmail: !(!!data.adAgree),
        unsubscribeTexting: !(!!data.adAgree),
      };
      // @ts-ignore
      window.ChannelIO('updateUser', user_obj, function onUpdateUser(error, user) {
        if (error) {
          console.error(error);
        }
      });
    } catch {
      alert(t('mypage:errorTitle'));
    }
  };
  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  const handleWithdraw = async () => {
    try {
      const req = {
        withdrawalReason,
        token,
      };
      await withdrawUser({ req });
      setShowWithdrawModal(false);
      setShowWithdrawCompleteModal(true);
    } catch (error) {
      console.error(t('mypage:deleteAccountError'), error);
      alert(t('mypage:deleteAccountError'));
    }
  };

  const handleWithdrawComplete = () => {
    setShowWithdrawCompleteModal(false);
    // // 로그아웃 처리
    // document.cookie = 'userToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // 메인 페이지로 이동
    window.location.href = '/';
  };

  useEffect(() => {
    setValue('name', profile?.name);
    setValue('nickname', profile?.nickname);
    setValue('phoneNum', profile?.phone_number);
    setValue('adAgree', profile?.ad_agree);
  }, [profile]);
  return (
    <>
      <SEO title={t('seo:mypagePageTitle')} />
      <Layout padding='pt-20 pb-44 md:pt-4'>
        <Header />

        <div className='mt-[4.5rem] flex space-x-10 md:mt-0 md:block md:space-x-0'>
          <Navigator />

          <div className='grow space-y-6 md:mt-8'>
            <div className='text-lg font-medium'>
              {!pwTabOpen ? t('mypage:personalInfoTitle') : t('mypage:passwordChangeTitle')}
            </div>

            <div className='divide-y divide-[#575b64] rounded-sm bg-[rgba(229,229,229,0.08)] p-10 md:p-4'>
              {!pwTabOpen ? (
                <>
                  <Input
                    type='text'
                    label={t('mypage:nameLabel')}
                    register={register('name', {
                      value: profile?.name,
                      required: t('mypage:nameRequired') as string,
                      minLength: {
                        message: t('mypage:nameMinLength') as string,
                        value: 2,
                      },
                      maxLength: {
                        message: t('mypage:nameMaxLength') as string,
                        value: 5,
                      },
                    })}
                    error={errors?.name?.message}
                  />

                  <Input
                    type='text'
                    label={t('mypage:nicknameLabel')}
                    register={register('nickname', {
                      value: profile?.nickname,
                      required: t('mypage:nicknameRequired') as string,
                      minLength: {
                        message: t('mypage:nicknameMinLength') as string,
                        value: 2,
                      },
                      maxLength: {
                        message: t('mypage:nicknameMaxLength') as string,
                        value: 8,
                      },
                    })}
                    error={errors?.nickname?.message}
                  />

                  <Input
                    type='tel'
                    label={t('mypage:phoneLabel')}
                    register={register('phoneNum', {
                      value: profile?.phone_number,
                      required: t('mypage:phoneRequired') as string,
                      validate: {
                        notPhoneNum: (value) => {
                          const regPhoneNum =
                            /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
                          if (regPhoneNum.test(value)) {
                            return true;
                          } else {
                            return t('mypage:phoneInvalid') as string;
                          }
                        },
                      },
                    })}
                    error={errors?.phoneNum?.message}
                    readOnly
                  />

                  <div className='flex h-20 items-center md:text-sm'>
                    <div className='w-44 font-medium opacity-60'>{t('mypage:passwordLabel')}</div>
                    <div
                      onClick={() => setPwTabOpen(true)}
                      className='cursor-pointer rounded bg-[#686e7a] px-4 py-2 transition-all hover:opacity-90 md:text-xs'
                    >
                      {t('mypage:changePasswordButton')}
                    </div>
                  </div>

                  <div className='flex h-20 items-center md:text-sm'>
                    <div className='w-44 font-medium opacity-60'>
                      {t('mypage:eventInfoLabel')}
                    </div>
                    <input
                      type='checkbox'
                      {...register('adAgree', {
                        value: profile?.ad_agree,
                      })}
                      className='mr-2.5 h-4 w-4 cursor-pointer appearance-none rounded-sm border bg-cover bg-center transition-all checked:border-none checked:bg-[url("/icons/check.png")]'
                    />
                    <div className='md:text-xs'>{t('mypage:eventConsentLabel')}</div>
                  </div>

                  <div className='flex h-20 items-center md:text-sm'>
                    <div className='w-44 font-medium opacity-60'>
                      {t('mypage:deleteAccountLabel')}
                    </div>
                    <div
                      onClick={() => setShowWithdrawModal(true)}
                      className='cursor-pointer rounded bg-gray-500 px-4 py-2 text-white transition-all hover:bg-gray-600 md:text-xs'
                    >
                      {t('mypage:deleteAccountLabel')}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='flex h-20 items-center md:text-sm'>
                    <div className='w-44 font-medium opacity-60'>
                      {t('mypage:currentPasswordLabel')}
                    </div>
                    <div>**********</div>
                  </div>

                  <Input
                    type='password'
                    label={t('mypage:newPasswordLabel')}
                    register={register('password', {
                      value: '',
                      required: t('mypage:newPasswordRequired') as string,
                      validate: {
                        notPw: (value) => {
                          const regPw =
                            /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
                          if (regPw.test(value)) {
                            return true;
                          } else {
                            return t('mypage:newPasswordPattern') as string;
                          }
                        },
                      },
                    })}
                    error={errors?.password?.message}
                  />

                  <Input
                    type='password'
                    label={t('mypage:confirmPasswordLabel')}
                    register={register('passwordCheck', {
                      value: '',
                      required: t('mypage:confirmPasswordRequired') as string,
                      validate: {
                        notPwCheck: (value) =>
                          value === watch('password') ||
                          (t('mypage:confirmPasswordMismatch') as string),
                      },
                    })}
                    error={errors?.passwordCheck?.message}
                  />
                </>
              )}
            </div>

            <div className='flex justify-end space-x-4'>
              {/* <div className='cursor-pointer rounded-sm bg-[rgba(255,255,255,0.17)] py-3 px-10 font-medium'>
                  취소
                </div> */}

              <div
                onClick={handleSubmit(onValid, onInvalid)}
                className='cursor-pointer rounded-sm bg-[#00e7ff] py-3 px-10 font-medium text-[#282e38]'
              >
                {editLoading ? (
                  <svg
                    role='status'
                    className='h-5 w-5 animate-spin fill-[#373c46] text-[#02cce2]'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                ) : (
                  t('mypage:saveButton')
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>

      {/* 회원탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='flex flex-col w-[30rem] gap-y-6 rounded bg-[#282e38] py-8 px-8 md:w-[25rem]'>
            <h3 className='text-lg font-medium text-[#cfcfcf] text-center'>
              {t('mypage:deleteAccountTitle')}
            </h3>
            <div className='text-center'>
              <p className='text-[#cfcfcf] leading-relaxed' dangerouslySetInnerHTML={{ __html: t('mypage:deleteAccountWarning').replace(/\n/g, '<br />') }} />
            </div>
            <div className='flex flex-col gap-y-4'>
              <div className='text-left'>
                <label className='block text-sm font-medium text-[#cfcfcf] mb-2'>
                  {t('mypage:deleteAccountReasonLabel')}
                </label>
                <textarea
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  placeholder={t('mypage:deleteAccountReasonPlaceholder') as string}
                  className='w-full h-24 px-3 py-2 bg-[#3a3f4a] border border-[#575b64] rounded text-[#cfcfcf] placeholder-gray-400 focus:outline-none focus:border-[#00e7ff] resize-none'
                />
              </div>
            </div>
            <div className='flex justify-center gap-x-4 font-bold'>
              <button
                onClick={handleWithdraw}
                disabled={withdrawLoading}
                className='flex h-12 w-24 cursor-pointer items-center justify-center rounded bg-red-500 text-white transition-all hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {withdrawLoading ? (
                  <svg
                    role='status'
                    className='h-5 w-5 animate-spin fill-white text-red-300'
                    viewBox='0 0 100 101'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                      fill='currentColor'
                    />
                    <path
                      d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                      fill='currentFill'
                    />
                  </svg>
                ) : (
                  t('mypage:yesButton')
                )}
              </button>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawalReason('');
                }}
                disabled={withdrawLoading}
                className='flex h-12 w-24 cursor-pointer items-center justify-center rounded bg-[#686e7a] text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {t('mypage:noButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원탈퇴 완료 모달 */}
      {showWithdrawCompleteModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='flex flex-col w-[30rem] gap-y-6 rounded bg-[#282e38] py-8 px-8 md:w-[25rem] text-center'>
            <h3 className='text-lg font-medium text-[#cfcfcf]'>
              {t('mypage:deleteAccountRequestTitle')}
            </h3>
            <p className='text-[#cfcfcf] leading-relaxed' dangerouslySetInnerHTML={{ __html: t('mypage:deleteAccountRequestMessage').replace(/\n/g, '<br />') }} />
            <div className='flex justify-center font-bold'>
              <button
                onClick={handleWithdrawComplete}
                className='flex h-12 w-32 cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-black transition-all hover:opacity-90'
              >
                {t('mypage:confirmButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['mypage', 'seo'])),
    },
  };
}

export default EditProfile;
