import { cls } from '@libs/client/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { usersApi } from '@libs/api';
import { useUser } from '@libs/client/useUser';
import { mutate } from 'swr';

interface IProps {
  title: string;
  payment_id?: string;
  closePopup: () => void;
}

export default function RefundPopup({ title, payment_id, closePopup }: IProps) {
  console.log('# title', title);
  console.log('# payment_id', payment_id);

  const [step, setStep] = useState(1); // 1: 확인, 2: 로딩, 3: 결과
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { token } = useUser({ isPrivate: true });

  const popupVar = {
    invisible: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const handleRefund = async () => {
    console.log('# handleRefund');
    console.log('# payment_id', payment_id);
    console.log('# token', token);

    if (!payment_id || !token) {
      setResult({ success: false, message: '결제 정보를 찾을 수 없습니다.' });
      setStep(3);
      return;
    }

    setStep(2);
    setIsLoading(true);

    try {
      const response = await usersApi.requestRefund(
        payment_id,
        '고객 요청에 의한 환불',
        token
      );
      
      setResult({ success: true, message: '환불이 성공적으로 처리되었습니다.' });
      setStep(3);
      
      // 결제 내역 새로고침
      mutate('/mypage/payment');
    } catch (error: any) {
      console.log('# catch');
      console.log('# error', error);
      const errorMessage = error.response?.data?.detail || '환불 처리 중 오류가 발생했습니다.';
      setResult({ success: false, message: errorMessage });
      setStep(3);
    } finally {
      console.log('# finally');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    console.log('# handleClose');
    console.log('# result', result);
    if (result?.success) {
      // 성공 시 페이지 새로고침
      window.location.reload();
    }
    closePopup();
  };


  

  return (
    <div
      onClick={step === 1 ? closePopup : undefined}
      className='fixed top-[150px] left-0 z-50 flex h-[calc(100vh-150px)] w-screen items-center justify-center bg-[rgba(0,0,0,0.6)]'
    >
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
          return;
        }}
        variants={popupVar}
        initial='invisible'
        animate='visible'
        exit='exit'
        className='w-[35rem] rounded bg-[#282e38] py-12 px-10'
      >
        {step !== 2 && (
          <div className='flex justify-end'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-9 w-9 cursor-pointer'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
              onClick={handleClose}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </div>
        )}

        {/* Step 1: 확인 */}
        {step === 1 && (
          <>
            <div className='text-center text-2xl font-medium'>환불 확인</div>
            <div className='mt-5 text-center text-[#cfcfcf]'>
              <div className='font-medium text-white mb-3'>{title}</div>
              <div>수강신청을 취소하고 환불받으시겠습니까?</div>
              <div className='text-sm mt-2 text-[#ffcc00]'>
                ※ 환불 시 수강 권한이 즉시 취소됩니다.
              </div>
            </div>
            <div className='mt-12 flex space-x-4'>
              <div
                onClick={closePopup}
                className='flex-1 flex cursor-pointer justify-center rounded bg-[#6b7280] py-4 text-lg font-medium text-white transition-all hover:opacity-90'
              >
                취소
              </div>
              <div
                onClick={handleRefund}
                className='flex-1 flex cursor-pointer justify-center rounded bg-[#dc2626] py-4 text-lg font-medium text-white transition-all hover:opacity-90'
              >
                환불하기
              </div>
            </div>
          </>
        )}

        {/* Step 2: 로딩 */}
        {step === 2 && (
          <>
            <div className='text-center text-2xl font-medium'>환불 처리 중</div>
            <div className='mt-8 flex justify-center'>
              <div className='animate-spin rounded-full h-16 w-16 border-4 border-[#00e7ff] border-t-transparent'></div>
            </div>
            <div className='mt-6 text-center text-[#cfcfcf]'>
              환불을 처리하고 있습니다.<br />
              잠시만 기다려주세요.
            </div>
          </>
        )}

        {/* Step 3: 결과 */}
        {step === 3 && result && (
          <>
            <div className={cls(
              'text-center text-2xl font-medium',
              result.success ? 'text-[#00e7ff]' : 'text-[#dc2626]'
            )}>
              {result.success ? '환불 완료' : '환불 실패'}
            </div>
            <div className='mt-5 text-center text-[#cfcfcf]'>
              {result.message}
            </div>
            {result.success && (
              <div className='mt-3 text-center text-sm text-[#ffcc00]'>
                환불금은 결제수단에 따라 3-5영업일 내 처리됩니다.
              </div>
            )}
            <div
              onClick={handleClose}
              className={cls(
                'mt-12 flex cursor-pointer justify-center rounded py-4 text-lg font-medium transition-all hover:opacity-90',
                result.success 
                  ? 'bg-[#00e7ff] text-[#282e38]' 
                  : 'bg-[#6b7280] text-white'
              )}
            >
              확인
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}