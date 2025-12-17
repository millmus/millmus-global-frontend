import SEO from '@components/seo';
import Layout from '@layouts/sectionLayout';
import { lecturesApi, purchaseApi } from '@libs/api';
import { useUser } from '@libs/client/useUser';
import axios from 'axios';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface IProps {
  imp_uid: string;
  merchant_uid: string;
  imp_success: string;
  option: string;
  payment_method: string;
}

type PaymentStatus = 'loading' | 'pending' | 'paid' | 'failed';

const Finish: NextPage<IProps> = ({ imp_uid, merchant_uid, imp_success, option, payment_method }) => {
  const { t } = useTranslation('purchase');
  const { token } = useUser({ isPrivate: true });
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const [refund_policy, set_refund_policy] = useState<any | null>();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const isPaypal = payment_method === 'paypal';
  const POLLING_INTERVAL = 3000; // 3 seconds
  const MAX_POLLING_COUNT = 20; // Max 60 seconds

  // Check payment status from PortOne API
  const checkPaymentStatus = async (): Promise<{ status: string; data: any }> => {
    const { data } = await axios.post('/api/payment', {
      imp_uid,
      merchant_uid,
      imp_success,
    });
    return { status: data.status, data };
  };

  // Process successful payment
  const processPayment = async (paymentData: any) => {
    const customData = JSON.parse(paymentData.custom_data);
    const {
      type,
      id,
      price,
      total_price,
      point,
      coupon,
      token: prevToken,
    } = customData;

    if (token === prevToken) {
      await purchaseApi.purchase({
        type,
        method: paymentData.pay_method,
        id,
        price,
        totalPrice: total_price,
        point,
        coupon,
        orderId: paymentData.merchant_uid,
        token,
        option
      });
      setData({ ...paymentData, custom_data: customData });
      setPaymentStatus('paid');

      const updatedData = await lecturesApi.detail(id);
      set_refund_policy(updatedData.refund_policy);
    } else {
      setPaymentStatus('failed');
      setErrorMessage('Token mismatch error');
    }
  };

  // Polling function for PayPal pending payments
  const pollPaymentStatus = async (pollingCount: number = 0) => {
    if (pollingCount >= MAX_POLLING_COUNT) {
      setPaymentStatus('failed');
      setErrorMessage('Payment verification timeout. Please check your payment status in MyPage.');
      return;
    }

    try {
      const { status, data: paymentData } = await checkPaymentStatus();

      if (status === 'paid') {
        await processPayment(paymentData);
      } else if (status === 'failed' || status === 'cancelled') {
        setPaymentStatus('failed');
        setErrorMessage(paymentData.fail_reason || 'Payment failed');
        const customData = JSON.parse(paymentData.custom_data);
        setTimeout(() => {
          router.replace(`/purchase/${customData.type}/${customData.id}`);
        }, 3000);
      } else {
        // Still pending, continue polling
        setPaymentStatus('pending');
        setTimeout(() => pollPaymentStatus(pollingCount + 1), POLLING_INTERVAL);
      }
    } catch (error) {
      setPaymentStatus('failed');
      setErrorMessage('Failed to check payment status');
    }
  };

  const getData = async () => {
    try {
      const { status, data: paymentData } = await checkPaymentStatus();
      const customData = JSON.parse(paymentData.custom_data);
      const { type, id, token: prevToken } = customData;

      // For PayPal, handle pending status with polling
      if (isPaypal) {
        if (status === 'paid') {
          await processPayment(paymentData);
        } else if (status === 'ready' || status === 'pending') {
          setPaymentStatus('pending');
          pollPaymentStatus(1);
        } else if (status === 'failed' || status === 'cancelled') {
          setPaymentStatus('failed');
          setErrorMessage(paymentData.fail_reason || 'Payment failed');
          setTimeout(() => {
            router.replace(`/purchase/${type}/${id}`);
          }, 3000);
        } else {
          // Unknown status, try polling
          setPaymentStatus('pending');
          pollPaymentStatus(1);
        }
      } else {
        // Non-PayPal: use existing synchronous logic
        if (imp_success === 'true' && token === prevToken) {
          await processPayment(paymentData);
        } else {
          router.replace(`/purchase/${type}/${id}`);
        }
      }
    } catch {
      setPaymentStatus('failed');
      setErrorMessage('Error processing payment');
      router.replace('/');
    }
  };

  useEffect(() => {
    if (token) {
      getData();
    }
  }, [token]);
  // Spinner component for reuse
  const LoadingSpinner = () => (
    <div className='flex items-center justify-center pt-40 pb-16'>
      <svg
        role='status'
        className='h-7 w-7 animate-spin fill-[#373c46] text-[#02cce2] md:h-6 md:w-6'
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
    </div>
  );

  // Pending UI for PayPal
  const PendingUI = () => (
    <div className='flex flex-col items-center justify-center pt-40 pb-16'>
      <LoadingSpinner />
      <div className='mt-8 text-center'>
        <div className='text-2xl font-bold text-[#00e7ff]'>
          {t('finish.pendingTitle') || 'Processing Payment...'}
        </div>
        <div className='mt-4 text-gray-400'>
          {t('finish.pendingMessage') || 'Please wait while we verify your PayPal payment.'}
        </div>
        <div className='mt-2 text-sm text-gray-500'>
          {t('finish.pendingNote') || 'This may take a few moments.'}
        </div>
      </div>
    </div>
  );

  // Failed UI
  const FailedUI = () => (
    <div className='flex flex-col items-center justify-center pt-40 pb-16'>
      <div className='text-6xl text-red-500'>!</div>
      <div className='mt-8 text-center'>
        <div className='text-2xl font-bold text-red-500'>
          {t('finish.failedTitle') || 'Payment Failed'}
        </div>
        <div className='mt-4 text-gray-400'>
          {errorMessage || t('finish.failedMessage') || 'There was an issue processing your payment.'}
        </div>
        <div className='mt-2 text-sm text-gray-500'>
          {t('finish.failedNote') || 'Redirecting to purchase page...'}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SEO title={t('finish.title')} />
      <Layout padding='pt-24 pb-48'>
        {paymentStatus === 'loading' ? (
          <LoadingSpinner />
        ) : paymentStatus === 'pending' ? (
          <PendingUI />
        ) : paymentStatus === 'failed' ? (
          <FailedUI />
        ) : !data ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className='flex justify-center text-[2.5rem] font-bold md:text-3xl'>
              {t('finish.complete')}
            </div>

            <div className='mt-4 flex justify-center font-light md:block'>
              {t('finish.receiptInfo')}{' '}
              <span className='text-[#ff8a00]'>{t('finish.paymentDocuments')}</span>
              {t('finish.receiptSuffix')}
            </div>

            <div className='mt-14 text-lg font-medium'>{t('finish.productInfo')}</div>

            <div className='mt-6 flex h-[3.75rem] items-center rounded-sm bg-[rgba(229,229,229,0.08)] text-lg font-medium text-[rgba(255,255,255,0.6)] md:hidden'>
              <div className='flex w-1/6 justify-center'>{t('finish.productName')}</div>
              <div className='flex w-1/6 justify-center'>{t('finish.paymentMethod')}</div>
              <div className='flex w-1/6 justify-center'>{t('finish.productPrice')}</div>
              <div className='flex w-1/6 justify-center'>{t('finish.discount')}</div>
              <div className='flex w-1/6 justify-center'>{t('finish.pointsUsed')}</div>
              <div className='flex w-1/6 justify-center'>{t('finish.totalAmount')}</div>
            </div>

            <div className='flex items-center border-b-2 border-[#4a4e57] py-14 text-lg md:hidden'>
              <div className='flex w-1/6 justify-center'>{data?.name} {option=="2"?t('finish.bundle'):null}</div>
              <div className='flex w-1/6 justify-center'>
                {data?.pay_method}
              </div>
              <div className='flex w-1/6 justify-center'>
                {data?.custom_data?.price?.toLocaleString()}
              </div>
              <div className='flex w-1/6 justify-center'>
                {(
                  data?.custom_data?.price - data?.custom_data?.total_price
                )?.toLocaleString()}
              </div>
              <div className='flex w-1/6 justify-center'>
                {data?.custom_data?.point
                  ? (+data?.custom_data?.point).toLocaleString()
                  : '-'}
              </div>
              <div className='flex w-1/6 justify-center'>
                {data?.custom_data?.total_price?.toLocaleString()}
              </div>
            </div>

            <div className='mt-6 hidden h-full space-y-2 border-b-2 border-t-2 border-[#4a4e57] py-8 text-lg font-medium text-[rgba(255,255,255,0.6)] md:block'>
              <div className='flex justify-start'>
                <div className='w-32'>{t('finish.productName')}</div>
                <div className='w-48 text-white'>{data?.name} {option=="2"?t('finish.bundle'):null}</div>
              </div>
              <div className='flex justify-start'>
                <div className='w-32'>{t('finish.paymentMethod')}</div>
                <div className='w-48 text-white'>{data?.pay_method}</div>
              </div>
              <div className='flex justify-start'>
                <div className='w-32'>{t('finish.productPrice')}</div>
                <div className='w-48 text-white'>
                  {data?.custom_data?.price?.toLocaleString()}
                </div>
              </div>
              <div className='flex justify-start'>
                <div className='w-32'>{t('finish.discount')}</div>
                <div className='w-48 text-white'>
                  {(
                    data?.custom_data?.price - data?.custom_data?.total_price
                  )?.toLocaleString()}
                </div>
              </div>
              <div className='flex justify-start'>
                <div className='w-32'>{t('finish.pointsUsed')}</div>
                <div className='w-48 text-white'>
                  {data?.custom_data?.point
                    ? (+data?.custom_data?.point).toLocaleString()
                    : '-'}
                </div>
              </div>
              <div className='flex justify-start'>
                <div className='w-32'>{t('finish.totalAmount')}</div>
                <div className='w-48 text-white'>
                  {data?.custom_data?.total_price?.toLocaleString()}
                </div>
              </div>
            </div>

            {refund_policy ? (
              <div className='mt-10'>
                <div className='rounded bg-[#373c46] p-10 md:p-6' style={{ maxWidth: '968px', margin: "auto" }}>
                  <div className='font-bold'>{t('finish.termsTitle')}</div>
                  <br />
                  <p className='text-white md:text-sm' style={{whiteSpace: 'break-spaces'}}>{refund_policy?.title}</p>
                  <br />
                  <div className='leading-7 md:text-sm' style={{whiteSpace: 'break-spaces'}}>
                  {refund_policy?.text}
                  </div>
                </div>
              </div>
            ) : null}

            <div className='mt-10 flex justify-center'>
              <Link href='/mypage/lecture/ongoing/1'>
                <a>
                  <div className='flex h-14 w-64 items-center justify-center rounded bg-[#00e7ff] font-medium text-[#282e38] transition-all hover:opacity-90'>
                    {t('finish.goToLecture')}
                  </div>
                </a>
              </Link>
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const locale = ctx.locale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'purchase'])),
      imp_uid: ctx.query?.imp_uid ?? '',
      merchant_uid: ctx.query?.merchant_uid ?? '',
      imp_success: ctx.query?.imp_success ?? '',
      option: ctx.query?.option ?? '',
      payment_method: ctx.query?.payment_method ?? '',
    },
  };
};

export default Finish;
