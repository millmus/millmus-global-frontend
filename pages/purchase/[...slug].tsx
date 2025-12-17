import SEO from '@components/seo';
import Layout from '@layouts/sectionLayout';
import { communityApi, lecturesApi, purchaseApi } from '@libs/api';
import { cls, fbqProductTrack } from '@libs/client/utils';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { useUser } from '@libs/client/useUser';
import Link from 'next/link';
import PaymentTermsModal from '@components/PaymentTermsModal';
import { useForm, FieldErrors } from 'react-hook-form';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface IPayerForm {
  // 강의 ID
  lecture_id: number;
  // 강의명
  lecture_name: string;
  // 성함(필수)
  payer_name: string;
  // 가입 핸드폰번호(필수)
  payer_phone: string;
  // 현금영수증 발급번호(선택)
  cash_receipt_number: string;
  // 사업자 계산서 발행시 사업자번호(선택)
  business_number: string;
}


declare global {
  interface Window {
    IMP: any;
  }
}

// PayPal 결제 로딩 상태

interface IProps {
  slug: string[];
  option: string;
  // 서버에서 전달받는 환경변수 (Vercel 빌드 캐시 문제 해결)
  paypalChannelKey: string;
  paypalCurrency: string;
  merchantId: string;
}

const Purchase: NextPage<IProps> = ({ slug, option, paypalChannelKey, paypalCurrency, merchantId }) => {
  const { t } = useTranslation('purchase');
  const { token, profile } = useUser({
    isPrivate: true,
  });
  const [type, id, priceType] = slug;

  const { data: purchased } = useSWR(
    token ? `/payment/check/lecture/${id}` : null,
    () => purchaseApi.check('lecture', parseInt(id), `${token}`, option)
  );

  const coupon_lecture_id = '42',
    coupon_name = "희스토리 스터디전용 할인쿠폰";

  if (profile?.coupon !== undefined) {
    if (id == coupon_lecture_id) { // 할인할 오프 강의
      profile.coupon = profile.coupon.filter((d: any) => d.name == coupon_name)
    }
    else {
      profile.coupon = profile.coupon.filter((d: any) => d.name != coupon_name)
    }
  }

  const { data: tmpData } = useSWR(
    type === 'lecture' ? `/lectures/${id}` : '/community',
    type === 'lecture'
      ? () => lecturesApi.detail(id)
      : () => communityApi.communityList()
  );
  const data = tmpData && (
    type === 'lecture' ?
      option == '2' ? { ...tmpData, ...tmpData.series } : tmpData
      : tmpData[+id - 1]);
  const router = useRouter();
  const [payMethod, setPayMethod] = useState<string | null>('paypal');
  const [seriesPopup, setSeriesPopup] = useState(false);
  const [couponPopup, setCouponPopup] = useState(false);
  const [bankAccountPopup, setBankAccountPopup] = useState(false);
  const [coupon, setCoupon] = useState({
    id: null,
    name: '-',
    price: 0,
  });
  const [point, setPoint] = useState<string | number>('');
  const date = new Date();
  const orderId = `MID${date.getFullYear()}${(
    date.getMonth() +
    1 +
    ''
  ).padStart(2, '0')}${(date.getDate() + '').padStart(
    2,
    '0'
  )}-${date.getTime()}`;
  const price = priceType
    ? priceType === '1'
      ? data?.price
      : data?.price2
    : data?.price;
  const totalDiscount = data?.discount + +point + coupon.price;
  const totalPrice = price - totalDiscount < 0 ? 0 : price - totalDiscount;

  // 입금자명 입력 팝업
  const [payerNamePopup, setPayerNamePopup] = useState(false);
  // 입금자명 입력 확인 팝업
  const [payerNameConfirmPopup, setPayerNameConfirmPopup] = useState(false);

  const couponFilter = (coupons: any[] = []) => {
    // 
    if (option == "2") return data?.series?.is_plan ? [] : coupons.filter((d: any) => d.limit_to_tutor == data?.tutor.id);
    const filtered_coupons = coupons.filter((d: any) => {
      // (임시) 강의 1개 한정
      if (d.name == '가입 축하 쿠폰' && data?.id == 118) return false;

      if (d.limit_to_tutor == null) return true;
      else {
        return d.limit_to_tutor == data?.tutor.id
      }
    }).filter((d: any) => {
      if (d.name == '가입 축하 쿠폰' && data?.category == "프리미엄 스터디") return true;
      return data?.series ?
        data?.series?.is_plan ? null :
          data?.ticket_of ? d.reusable || (d.limit_to_tutor == data?.tutor?.id) : (d.limit_to_tutor == data?.tutor?.id) || null :
        !d.reusable && !d.limit_to_tutor
    });
    return filtered_coupons;
  }
  const lectureName = () => {
    const name = data?.name;
    if (option == "2") {
      return data?.series?.is_plan ? name + " (VIP)" : name + " (통합권)";
    }
    if (data?.series?.is_plan) {
      if (data?.id == data?.series?.vod_id) return name + " (BASIC)";
      if (data?.id == data?.series?.ticket_id) return name + " (PREMIUM)";
    }
    return name;
  }
  const handlePayMethod = (method: string) => {
    setPayMethod(method);
  };

  const handlePoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setPoint(+value);
  };
  const handleAllPoint = () => {
    const point = data?.category == "프리미엄 스터디" || data?.series ? profile?.offline_point : profile?.point;
    setPoint(point);
  }

  const handleProposalPayment = () => {
    if (data?.series) {
      if (data?.category == "프리미엄 스터디") {
        handlePayment();
        // openModal();
        return;
      }
      if (!data?.series?.is_plan) {
        setSeriesPopup(true);
        return;
      }
    }
  }
  const handlePayment = () => {
    if (purchased === 'already purchased') {
      alert(t('alreadyPurchased'));
      router.push(`/lecture/detail/${id}`);
      return;
    } else if (payMethod === 'cash') {
      setBankAccountPopup(true);
      return;
    }
    const { IMP } = window;
    IMP.init(process.env.NEXT_PUBLIC_MERCHANT_ID);

    // payMethod가 kakaopay, naverpay, samsung일 경우
    // pg = process.env.NEXT_PUBLIC_PASS_PG
    // channelKey = process.env.NEXT_PUBLIC_PASS_CHANNEL_KEY
    // 그 외에는
    // pg = process.env.NEXT_PUBLIC_PG
    // channelKey = process.env.NEXT_PUBLIC_CHANNEL_KEY
    const pg = payMethod === 'kakaopay' || payMethod === 'naverpay' || payMethod === 'samsung' ? process.env.NEXT_PUBLIC_PASS_PG : process.env.NEXT_PUBLIC_PG;
    const channelKey = payMethod === 'kakaopay' || payMethod === 'naverpay' || payMethod === 'samsung' ? process.env.NEXT_PUBLIC_PASS_CHANNEL_KEY : process.env.NEXT_PUBLIC_CHANNEL_KEY;

    const params = {
      channelKey: channelKey,
      pay_method: payMethod,
      pg: pg, // pg사
      merchant_uid: orderId, // 주문번호
      name: data?.name, // 상품명
      amount: totalPrice, // 금액
      buyer_email: profile?.email, // 이메일
      buyer_name: profile?.name, // 이름
      buyer_tel: profile?.phone_number.replace(
        /^(\d{2,3})(\d{3,4})(\d{4})$/,
        `$1-$2-$3`
      ), // 전화번호
      custom_data: {
        type,
        id: data?.id,
        price,
        total_price: totalPrice,
        point,
        coupon: coupon.id,
        option,
        token,
      }, // 커스텀 데이터
      // m_redirect_url: `http://localhost:3000/purchase/finish`, // 모바일 redirect url
      m_redirect_url: `https://millmus.com/purchase/finish?option=${option}`, // 모바일 redirect url
    };

    console.log('params', params);

    const callback = async (res: any) => {
      const { success, imp_uid, merchant_uid, error_msg, error_code } = res;
      if (success) {
        fbqProductTrack("Purchase", data, totalPrice);

        router.push(
          `/purchase/finish?imp_uid=${imp_uid}&merchant_uid=${merchant_uid}&imp_success=true&option=${option}`
        );
      } else {
        console.log('error', error_code, error_msg);
      }
    };

    if (totalPrice == 0) {
      router.push(
        `/purchase/free_finish?id=${id}&name=${data?.name}&type=${type}&price=${price}&point=${point}&islive=${data?.live_info}&coupon=${coupon.id ?? ""}&merchant_uid=${orderId}&token=${token}&option=${option}&live_external_link=${data?.live_external_link}&live_external_link_help=${data?.live_external_link_help}`
      );
      return;
    }
    IMP.request_pay(params, callback);
  };

  // PayPal SPB 초기화 상태
  const [paypalInitialized, setPaypalInitialized] = useState(false);

  // PayPal SPB 요청 데이터 생성
  const getPaypalRequestData = () => ({
    channelKey: paypalChannelKey,
    pay_method: 'paypal',
    merchant_uid: orderId,
    amount: totalPrice,
    currency: paypalCurrency || 'USD',
    name: data?.name || '',
    buyer_name: profile?.name || '',
    buyer_email: profile?.email || '',
    custom_data: {
      type,
      id: data?.id,
      price,
      total_price: totalPrice,
      point,
      coupon: coupon.id,
      option,
      token,
    },
    m_redirect_url: `https://millmus.com/purchase/finish?option=${option}&payment_method=paypal`,
    notice_url: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/payment/webhook/paypal/` : undefined,
  });

  // PayPal SPB 초기화 (IMP.loadUI 사용)
  const initPaypalSPB = () => {
    if (typeof window === 'undefined' || !window.IMP) {
      console.error('[PayPal SPB] IMP not loaded');
      return;
    }

    if (!paypalChannelKey) {
      console.error('[PayPal SPB] Channel key is missing');
      return;
    }

    if (!data || totalPrice <= 0) {
      return;
    }

    const { IMP } = window;
    IMP.init(merchantId);

    const requestData = getPaypalRequestData();

    IMP.loadUI('paypal-spb', requestData, (response: any) => {

      if (response.imp_uid) {
        // 결제 성공
        fbqProductTrack("Purchase", data, totalPrice);
        router.push(
          `/purchase/finish?imp_uid=${response.imp_uid}&merchant_uid=${response.merchant_uid}&imp_success=true&option=${option}&payment_method=paypal`
        );
      } else {
        // 결제 실패 또는 취소
        console.error('[PayPal SPB] Payment failed:', response.error_msg);
        if (response.error_msg) {
          alert(response.error_msg);
        }
      }
    });

    setPaypalInitialized(true);
  };

  // PayPal SPB 금액 업데이트
  const updatePaypalAmount = () => {
    if (typeof window === 'undefined' || !window.IMP || !paypalInitialized) {
      return;
    }

    const requestData = getPaypalRequestData();
    window.IMP.updateLoadUIRequest('paypal-spb', requestData);
  };

  // PayPal SPB 초기화 (payMethod가 paypal이고 데이터 준비 완료 시)
  useEffect(() => {
    if (payMethod === 'paypal' && data && totalPrice > 0 && paypalChannelKey && !paypalInitialized) {
      // 약간의 지연 후 초기화 (DOM이 렌더링된 후)
      const timer = setTimeout(() => {
        initPaypalSPB();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [payMethod, data, totalPrice, paypalChannelKey, paypalInitialized]);

  // PayPal SPB 금액 업데이트 (포인트, 쿠폰 변경 시)
  useEffect(() => {
    if (paypalInitialized && payMethod === 'paypal') {
      updatePaypalAmount();
    }
  }, [totalPrice, paypalInitialized, payMethod]);

  // 결제 수단 변경 시 PayPal 초기화 상태 리셋
  useEffect(() => {
    if (payMethod !== 'paypal') {
      setPaypalInitialized(false);
    }
  }, [payMethod]);

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


  useEffect(() => {
    if (point > 0) {
      let temp_price = data?.discount ? parseInt(price) - parseInt(data?.discount) : parseInt(price);
      temp_price = coupon?.price ? temp_price - coupon?.price : temp_price;
      if (point > temp_price) setPoint(temp_price);
    }
  }, [coupon]);

  useEffect(() => {
    if (point > 0) {
      let temp_price = data?.discount ? parseInt(price) - parseInt(data?.discount) : parseInt(price);
      temp_price = coupon?.price ? temp_price - coupon?.price : temp_price;
      if (point > temp_price) setPoint(temp_price);
      const temp_point = data?.category == "프리미엄 스터디" || data?.series ? profile?.offline_point : profile?.point;
      if (point > parseInt(temp_point)) setPoint(temp_point);
    }
  }, [point]);

  useEffect(() => {
    if (data) fbqProductTrack("InitiateCheckout", data, data?.price);
  }, [data]);


  const [isModalOpen, setIsModalOpen] = useState(false);


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const proceedWithPayment = () => {
      closeModal();
      handlePayment();
  };

  async function sendSMS(to: string, lectureName: string) {
    try {
      const response = await axios.post('/api/sendSms', {
        content: `회원님, 수강신청하신 ${lectureName} 정상접수가 완료되었습니다.\n\n현금입금의 경우 담당 클래스 매니저가 확인해 수강신청 얼리버드 마감일 바로 다음날(영업일 기준) 밀머스 홈페이지 내강의실에 강의배너를 업데이트해 드립니다.\n\n현금영수증 또는 계산서 발급은 개강일 이후 진행되며 별도 안내 드립니다.\n\n수강신청 마감 후 전체 공지가 제공될 때까지 조금 기다려주시면 감사하겠습니다!\n\n(주)밀레니얼머니스쿨 공식운영팀`, // SMS 내용
        subject: "[접수완료 알림]", // SMS 제목
        toNumbers: [to] // 수신 번호 리스트
      }, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`
        }
      });
    } catch (error) {
      console.error('Error sending SMS', error);
    }
  }

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IPayerForm>({
    mode: 'onChange',
  });

  const onValid = (formData: IPayerForm) => {
    try {
      purchaseApi.addPayerName({
        lecture_id: formData.lecture_id,
        payer_name: formData.payer_name,
        payer_phone: formData.payer_phone,
        cash_receipt_number: formData.cash_receipt_number,
        business_number: formData.business_number,
        token: token 
      });
      setPayerNamePopup(false);
      setBankAccountPopup(false);
      setPayerNamePopup(false);
      setPayerNameConfirmPopup(true);
      sendSMS(formData.payer_phone, formData.lecture_name);
    } catch(error) {
      console.error(error);
    }
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <>
      <SEO title={t('seoTitle')} />

      <Layout padding='py-24 md:py-4'>
        <div className='mb-14 text-2xl font-bold md:mb-4 md:text-center md:text-lg md:font-medium'>
          {t('orderPayment')}
        </div>

        <div className='divide-y-2 divide-[#4a4e57] md:divide-[#282e38] md:bg-[#4a4e57] md:p-4'>
          <div>
            <div className='text-lg font-medium'>{t('orderProduct')}</div>

            {/* 상품정보 헤더 */}
            <div className='mt-6 flex h-[3.75rem] items-center rounded-sm bg-[rgba(229,229,229,0.08)] text-lg font-medium text-[rgba(255,255,255,0.6)] md:hidden'>
              <div className='flex w-1/5 justify-center'>{t('productInfo')}</div>
              <div className='flex grow'>{t('productName')}</div>
              <div className='flex w-1/5 justify-center'>{t('option')}</div>
              <div className='flex w-1/5 justify-center'>{t('productPrice')}</div>
            </div>
            {/* 상품정보 헤더 */}

            {/* 상품정보 Data */}
            <div className='flex items-center py-8 text-lg md:hidden'>
              <div className='flex w-1/5 justify-center'>
                <div className='relative h-32 w-36'>
                  {data && (
                    <Image
                      src={data?.thumbnail}
                      alt='Lecture Thumbnail'
                      layout='fill'
                      objectFit='cover'
                      className='rounded'
                    />
                  )}
                </div>
              </div>
              <div className='flex grow'>{lectureName()}</div>
              <div className='flex w-1/5 justify-center'>
                {priceType ? (priceType === '1' ? t('month1') : t('month3')) : '-'}
              </div>
              <div className='flex w-1/5 justify-center'>
                {price?.toLocaleString()} {t('currency')}
              </div>
            </div>
            {/* 상품정보 Data */}

            {/* 상품정보 Data 모바일*/}
            <div className='hidden py-8 text-lg md:block'>
              <div className='flex grow text-base'>{lectureName()}</div>
              <div className='mt-4 flex justify-between'>
                <div className='text-sm text-[#cfcfcf]'>{t('option')}</div>
                <div className=''>
                  {priceType ? (priceType === '1' ? t('month1') : t('month3')) : '-'}
                </div>
              </div>
              <div className='mt-1 flex justify-between'>
                <div className='text-sm text-[#cfcfcf]'>{t('productPrice')}</div>
                <div className='text-sm'>{price?.toLocaleString()} {t('currency')}</div>
              </div>
            </div>
            {/* 상품정보 Data 모바일*/}
          </div>

          {data?.category != "코인" && <>
            <div className='pt-14 pb-6 text-lg font-medium'>{t('selectPaymentMethod')}</div>
            <div className='flex flex-col space-y-4 py-8 text-lg md:text-base'>
              {/* PayPal 결제 */}
              <div className='flex items-center space-x-3' onClick={() => handlePayMethod('paypal')}>
                <div
                  className={cls(
                    payMethod === 'paypal'
                      ? 'border-[#00e7ff]'
                      : 'border-[rgba(255,255,255,0.6)]',
                    'flex aspect-square w-4 items-center justify-center rounded-full border'
                  )}
                >
                  <div
                    className={cls(
                      payMethod === 'paypal' ? 'bg-[#00e7ff]' : '',
                      'flex aspect-square w-2 cursor-pointer items-center justify-center rounded-full transition-all'
                    )}
                  />
                </div>
                <div>{t('paypal')}</div>
              </div>
              {/* PayPal 결제 안내 */}
              {payMethod === 'paypal' && (
                <div className='ml-7 mt-2 text-sm text-gray-400'>
                  {t('paypalGuide')}
                </div>
              )}
              {/* 기존 결제 수단 - 체크/신용카드 */}
              <div className='flex items-center space-x-3' onClick={() => handlePayMethod('uplus')}>
                <div
                  className={cls(
                    payMethod === 'uplus'
                      ? 'border-[#00e7ff]'
                      : 'border-[rgba(255,255,255,0.6)]',
                    'flex aspect-square w-4 items-center justify-center rounded-full border'
                  )}
                >
                  <div
                    className={cls(
                      payMethod === 'uplus' ? 'bg-[#00e7ff]' : '',
                      'flex aspect-square w-2 cursor-pointer items-center justify-center rounded-full transition-all'
                    )}
                  />
                </div>
                <div>{t('creditCard')}</div>
              </div>
              {/* 기존 결제 수단 - 실시간 계좌이체 */}
              <div className='flex items-center space-x-3' onClick={() => handlePayMethod('cash')}>
                <div
                  className={cls(
                    payMethod === 'cash'
                      ? 'border-[#00e7ff]'
                      : 'border-[rgba(255,255,255,0.6)]',
                    'flex aspect-square w-4 items-center justify-center rounded-full border'
                  )}
                >
                  <div
                    className={cls(
                      payMethod === 'cash' ? 'bg-[#00e7ff]' : '',
                      'flex aspect-square w-2 cursor-pointer items-center justify-center rounded-full transition-all'
                    )}
                  />
                </div>
                <div>{t('bankTransfer')}</div>
              </div>
              {/* <div className='flex items-center space-x-3' onClick={() => handlePayMethod('kakaopay')}>
                <div
                  className={cls(
                    payMethod === 'kakaopay'
                      ? 'border-[#00e7ff]'
                      : 'border-[rgba(255,255,255,0.6)]',
                    'flex aspect-square w-4 items-center justify-center rounded-full border'
                  )}
                >
                  <div
                    className={cls(
                      payMethod === 'kakaopay' ? 'bg-[#00e7ff]' : '',
                      'flex aspect-square w-2 cursor-pointer items-center justify-center rounded-full transition-all'
                    )}
                  />
                </div>
                <div>카카오페이</div>
              </div>
              <div className='flex items-center space-x-3' onClick={() => handlePayMethod('naverpay')}>
                <div
                  className={cls(
                    payMethod === 'naverpay'
                      ? 'border-[#00e7ff]'
                      : 'border-[rgba(255,255,255,0.6)]',
                    'flex aspect-square w-4 items-center justify-center rounded-full border'
                  )}
                >
                  <div
                    className={cls(
                      payMethod === 'naverpay' ? 'bg-[#00e7ff]' : '',
                      'flex aspect-square w-2 cursor-pointer items-center justify-center rounded-full transition-all'
                    )}
                  />
                </div>
                <div>네이버페이</div>
              </div>
              <div className='flex items-center space-x-3' onClick={() => handlePayMethod('samsung')}>
                <div
                  className={cls(
                    payMethod === 'samsung'
                      ? 'border-[#00e7ff]'
                      : 'border-[rgba(255,255,255,0.6)]',
                    'flex aspect-square w-4 items-center justify-center rounded-full border'
                  )}
                >
                  <div
                    className={cls(
                      payMethod === 'samsung' ? 'bg-[#00e7ff]' : '',
                      'flex aspect-square w-2 cursor-pointer items-center justify-center rounded-full transition-all'
                    )}
                  />
                </div>
                <div>삼성페이</div>
              </div> */}
              {/* {data?.category == "프리미엄 스터디" &&
                <div className='flex items-center space-x-3' onClick={() => handlePayMethod('cash')}>
                  <div
                    className={cls(
                      payMethod === 'cash'
                        ? 'border-[#00e7ff]'
                        : 'border-[rgba(255,255,255,0.6)]',
                      'flex aspect-square w-4 items-center justify-center rounded-full border'
                    )}
                  >
                    <div
                      className={cls(
                        payMethod === 'cash' ? 'bg-[#00e7ff]' : '',
                        'flex aspect-square w-2 cursor-pointer items-center justify-center rounded-full transition-all'
                      )}
                    />
                  </div>
                  <div>실시간 계좌이체</div>
                </div>} */}
            </div>
          </>}

          {data?.category != "코인" && <>
            {(data?.category == "마스터 시리즈" && couponFilter(profile?.coupon).length == 0) ? (
              <><div className='pt-14 pb-6 text-lg font-medium whitespace-pre-line'>
                {t('offlineNotice')}
              </div></>
            ) : (
              <>
                <div className='pt-14 pb-6 text-lg font-medium md:hidden'>
                  {t('discountBenefits')}
                </div>
                <div className='flex items-start pt-6 pb-8 md:block'>
                    <div className='mr-12 pt-1.5 text-lg'>{t('availableCoupons')}</div>

                    <div className='grow'>
                      <div className='flex items-center space-x-4 border-b-2 border-[#4a4e57] pb-6 md:mt-4'>
                        <div className='text-lg'>
                          <span className='font-bold'>{couponFilter(profile?.coupon).length}</span>{t('sheets')}
                        </div>

                        <div
                          onClick={() => setCouponPopup(true)}
                          className='cursor-pointer rounded bg-[#4a4e57] py-2 px-4 md:bg-[#676a72]'
                        >
                          {t('applyCoupon')}
                        </div>
                      </div>

                      <div className='pt-8 md:hidden'>
                        <div className='text-lg text-[#00e7ff]'>{coupon.name}</div>

                        <div className='mt-4 text-lg'>
                          <span className='font-bold'>
                            {coupon.price?.toLocaleString()}
                          </span>
                          {t('currency')} {t('discountWon')}
                        </div>
                      </div>
                      {/* 모바일 */}
                      <div className='hidden pt-8 md:block md:pt-0'>
                        <div className='flex justify-between'>
                          <div className='text-[#cfcfcf]'>{t('couponNumber')}</div>
                          <div className='text-lg text-[#00e7ff]'>{coupon.name}</div>
                        </div>
                        <div className='flex justify-between'>
                          <div className='text-[#cfcfcf]'>{t('discountAmount')}</div>
                          <div>
                            <span className='font-bold'>
                              {coupon.price?.toLocaleString()}
                            </span>{' '}
                            {t('currency')}
                          </div>
                        </div>
                      </div>
                      {/* 모바일 */}
                    </div>
                  </div>
              </>
            )}

            <div className='flex items-start py-8 md:block'>
                <div className='mr-12 text-lg'>{t('availablePoints')}</div>

                <div className='space-y-6 md:mt-4'>
                  <div className='text-lg md:text-base'>
                    {t('totalPoints')} <span className='font-bold'>{data?.category == "프리미엄 스터디" || data?.series ? profile?.offline_point : profile?.point}P</span> {t('pointsHeld')}
                  </div>

                  <div className='flex'>
                    <input
                      type='tel'
                      placeholder={t('form.enterPoints')}
                      value={point}
                      onChange={(e) => handlePoint(e)}
                      className='h-10 w-36 rounded-l bg-[rgba(0,0,0,0.25)] pl-4 text-sm outline-none md:w-48'
                    />

                    <div
                      onClick={handleAllPoint}
                      className='-ml-0.5 flex h-10 w-24 cursor-pointer items-center justify-center rounded bg-[#4a4e57] md:bg-[#676a72] md:text-sm'
                    >
                      {t('useAll')}
                    </div>
                  </div>
                </div>
              </div>
          </>}

          <div className='pt-14 pb-6 text-lg font-medium'>{t('paymentAmount')}</div>
          <div className='space-y-4 py-8 text-lg'>
            <div className='flex items-center'>
              <div className='w-40'>{t('productPrice')}</div>
              <div>{price?.toLocaleString()}</div>
            </div>

            <div className='flex items-center'>
              <div className='w-40'>{t('totalDiscount')}</div>
              <div>-{totalDiscount?.toLocaleString()}</div>
            </div>

            <div className='flex items-center opacity-60'>
              <div className='w-40'>{t('event')}</div>
              <div>-{data?.discount?.toLocaleString()}</div>
            </div>

            <div className='flex items-center opacity-60'>
              <div className='w-40'>{t('coupon')}</div>
              <div>-{coupon.price?.toLocaleString()}</div>
            </div>

            <div className='flex items-center opacity-60'>
              <div className='w-40'>{t('points')}</div>
              <div>-{point === '' ? '0' : point}</div>
            </div>
          </div>
          <div className='flex items-start pt-4'>
            <div className='w-40 text-lg'>{t('finalPaymentAmount')}</div>

            <div className='flex text-lg'>
              <span className='font-bold'>{totalPrice?.toLocaleString()}</span>
              {t('currency')}
            </div>
          </div>
        </div>

        {/* 결제하기 버튼 */}
        <div className='mt-20 flex justify-center md:mt-4'>
          {totalPrice === 0 ? (
            <div
              onClick={() => {
                router.push(
                  `/purchase/free_finish?id=${id}&name=${data?.name}&type=${type}&price=${price}&point=${point}&islive=${data?.live_info}&coupon=${coupon.id ?? ""}&merchant_uid=${orderId}&token=${token}&option=${option}&live_external_link=${data?.live_external_link}&live_external_link_help=${data?.live_external_link_help}`
                );
              }}
              className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#00e7ff] font-medium text-[#282e38] transition-all hover:opacity-90'
            >
              {t('freeApply')}
            </div>
          ) : payMethod === 'paypal' ? (
            <div className='flex flex-col items-center'>
              {/* PayPal SPB 버튼 컨테이너 - PortOne이 여기에 PayPal 버튼을 렌더링 */}
              <div
                className="portone-ui-container"
                data-portone-ui-type="paypal-spb"
                style={{ minWidth: '256px', minHeight: '56px' }}
              >
                {/* PayPal 버튼이 여기에 자동으로 생성됩니다 */}
                {!paypalInitialized && (
                  <div className='flex h-14 w-64 items-center justify-center rounded bg-gray-200 text-gray-500'>
                    {t('paypalLoading')}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={data?.series && !data?.series?.is_plan && !(profile?.coupon?.filter((d: any) => d.reusable).length) ? handleProposalPayment : handlePayment}
              className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#00e7ff] font-medium text-[#282e38] transition-all hover:opacity-90'
            >
              {data?.category != "코인" ? t('pay') : t('apply')}
            </div>
          )}
        </div>
      </Layout >

      <input type="hidden" id='phone_number' name="phone_number" value={profile?.phone_number} />
      {
        seriesPopup ? (
          <div
            onClick={() => setSeriesPopup(false)}
            className='fixed top-[150px] left-0 z-50 flex h-[calc(100vh-150px)] w-screen font-bold items-center justify-center bg-[rgba(0,0,0,0.6)] md:top-1 md:h-full'
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
              className='flex flex-col w-[30rem] gap-y-6 rounded bg-[#282e38] py-8 px-8 md:w-[25rem]'
            >
              <div className="flex flex-col gap-y-2">
                <div><span className="underline">{t('popup.attendedOffline')}</span></div>
                <div><span className="underline">{t('popup.missedVOD')}</span></div>
              </div>
              <div className='cursor-default items-center rounded-xl bg-[#4a4e57]'>
                <div className='py-4 px-6 text-lg leading-loose md:text-base md:leading-relaxed whitespace-pre-line'>
                  {t('popup.masterMembership')}
                </div>
              </div>
              <div className='flex justify-center gap-x-8 md:gap-x-6'>
                <div
                  onClick={() => { router.push('/lecture/detail/83') }}
                  className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-black transition-all hover:opacity-90'
                >
                  {t('popup.viewMembership')}
                </div>
                <div
                  onClick={() => { setSeriesPopup(false); handlePayment(); }}
                  className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#CFCFCF] text-black transition-all hover:opacity-90'
                >
                  {t('popup.proceedPayment')}
                </div>
              </div>
            </motion.div>
          </div >
        ) : null}

      {
        bankAccountPopup ? (
          <div
            onClick={() => setBankAccountPopup(false)}
            style={{ wordBreak: 'keep-all' }}
            className='fixed top-[150px] left-0 z-50 flex h-[calc(100vh-150px)] w-screen items-center justify-center bg-[rgba(0,0,0,0.6)] md:top-1 md:h-full'
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
              className='flex flex-col w-[30rem] gap-y-6 rounded bg-[#282e38] py-8 px-8 md:w-[25rem]'
            >
              <div className="flex flex-col gap-y-2">
                <div className='flex'><div className='mr-2'>※</div><div>{t('popup.bankTransferGuide', { amount: totalPrice.toLocaleString() })}</div></div>
                <div className='flex'><div className='mr-2'>※</div><div>{t('popup.receiptGuide')}</div></div>
              </div>
              <div className='cursor-pointer items-center text-center rounded-xl bg-[#4a4e57] font-bold'
                onClick={() => {
                  navigator.clipboard
                    .writeText('Kookmin Bank 023501-04-274463 Millennial Money School Co., Ltd.')
                    .then(() => alert(t('popup.accountCopied')));
                }}>
                <div className='py-4 px-6 text-lg leading-loose md:text-base md:leading-relaxed whitespace-pre-line'>
                  {t('popup.bankAccount')}
                </div>
              </div>
              <div className='flex justify-center gap-x-8 font-bold md:gap-x-6'>
                <button onClick={() => {
                  setBankAccountPopup(false)
                  setPayerNamePopup(true)
                }}>
                    <div
                      className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-black transition-all hover:opacity-90'
                    >
                      {t('popup.confirmDeposit')}
                    </div>
                </button>
              </div>
            </motion.div>
          </div >
        ) : null}

        {
        payerNamePopup ? (
          <div
            onClick={() => setPayerNamePopup(false)}
            style={{ wordBreak: 'keep-all' }}
            className='fixed top-[150px] left-0 z-50 flex h-[calc(100vh-150px)] w-screen items-center justify-center bg-[rgba(0,0,0,0.6)] md:top-1 md:h-full'
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
              className='flex flex-col w-[30rem] gap-y-6 rounded bg-[#282e38] py-8 px-8 md:w-[25rem]'
            >
              <form onSubmit={handleSubmit(onValid, onInvalid)} className="space-y-4">
                <div className='hidden'>
                  <label className="block text-sm font-medium mb-2">Lecture ID</label>
                  <input
                    type="text"
                    {...register('lecture_id', {
                      required: 'Lecture ID is required',
                    })}
                    className="w-full text-[#cfcfcf] px-3 py-2 bg-[#2b313a] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                    value={data?.id}
                    readOnly
                  />
                  {errors.lecture_id && <span className="text-red-500 text-sm">{errors.lecture_id.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('popup.lectureName')}</label>
                  <input
                    type="text"
                    {...register('lecture_name', {
                      required: 'Lecture name is required',
                    })}
                    className="w-full text-[#cfcfcf] px-3 py-2 bg-[#2b313a] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                    value={lectureName()}
                    readOnly
                  />
                  {errors.lecture_name && <span className="text-red-500 text-sm">{errors.lecture_name.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('popup.name')}</label>
                  <input
                    type="text"
                    {...register('payer_name', {
                      required: t('popup.enterDepositorName'),
                    })}
                    className="w-full text-[#cfcfcf] px-3 py-2 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                  />
                  {errors.payer_name && <span className="text-red-500 text-sm">{errors.payer_name.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('popup.phone')}</label>
                  <input
                    type="text"
                    maxLength={11}
                    {...register('payer_phone', {
                      required: t('popup.enterPhone'),
                      pattern: {
                        value: /^\d{11}$/,
                        message: t('popup.phoneFormat'),
                      },
                    })}
                    className="w-full text-[#cfcfcf] px-3 py-2 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                  />
                  {errors.payer_phone && <span className="text-red-500 text-sm">{errors.payer_phone.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('popup.cashReceiptNumber')}</label>
                  <input
                    type="text"
                    {...register('cash_receipt_number')}
                    className="w-full text-[#cfcfcf] px-3 py-2 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                  />
                  {errors.cash_receipt_number && <span className="text-red-500 text-sm">{errors.cash_receipt_number.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('popup.businessNumber')}</label>
                  <input
                    type="text"
                    {...register('business_number')}
                    className="w-full text-[#cfcfcf] px-3 py-2 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                  />
                  {errors.business_number && <span className="text-red-500 text-sm">{errors.business_number.message}</span>}
                </div>
                <div className='flex justify-center gap-x-8 font-bold md:gap-x-6'>
                    <button onClick={() => {}}>
                      <div
                        className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-black transition-all hover:opacity-90'
                      >
                        {t('popup.register')}
                      </div>
                    </button>
                  </div>
              </form>

            </motion.div>
          </div >
        ) : null}

{
        payerNameConfirmPopup ? (
          <div
            onClick={() => setPayerNameConfirmPopup(false)}
            style={{ wordBreak: 'keep-all' }}
            className='fixed top-[150px] left-0 z-50 flex h-[calc(100vh-150px)] w-screen items-center justify-center bg-[rgba(0,0,0,0.6)] md:top-1 md:h-full'
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
              className='flex flex-col w-[20rem] gap-y-6 rounded bg-[#282e38] py-8 px-8 md:w-[25rem]'
            >
              <div className="space-y-4">
                <div>
                  <p className='text-center'>{t('popup.depositConfirmation')}</p>
                  <p className='text-center mt-[5px]'>{t('popup.thankYou')}</p>
                </div>
                <div className='flex justify-center gap-x-8 font-bold md:gap-x-6'>
                    <button onClick={() => {
                      router.push('/');
                    }}>
                      <div
                        className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-black transition-all hover:opacity-90'
                      >
                        {t('popup.confirm')}
                      </div>
                    </button>
                  </div>
              </div>

            </motion.div>
          </div >
        ) : null}

      {
        couponPopup ? (
          <div
            onClick={() => setCouponPopup(false)}
            className='fixed top-[150px] left-0 z-50 flex h-[calc(100vh-150px)] w-screen items-center justify-center bg-[rgba(0,0,0,0.6)] md:top-1 md:h-full'
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
              className='w-[30rem] rounded bg-[#282e38] py-8 px-4'
            >
              <div className='flex h-[3.75rem] items-center rounded-sm bg-[#4a4e57]'>
                <div className='flex w-3/4 pl-4'>{t('popup.couponName')}</div>
                <div className='flex grow justify-center'>{t('discountAmount')}</div>
              </div>

              <div className='max-h-96 overflow-y-scroll'>
                {couponFilter(profile?.coupon).map((i: any) => (
                  <div
                    key={i.id}
                    onClick={() => {
                      setCoupon(i);
                      setCouponPopup(false);
                    }}
                    className='flex h-[3.75rem] cursor-pointer items-center rounded-sm transition-all hover:opacity-70'
                  >
                    <div className='flex w-3/4 pl-4'>{i.name}</div>
                    <div className='flex grow justify-center'>
                      {i.price?.toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : null
      }
      <PaymentTermsModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        proceedWithPayment={proceedWithPayment}
        refund_policy={data?.refund_policy}
      />
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const locale = ctx.locale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'purchase'])),
      slug: ctx.params?.slug,
      option: ctx.query?.option ?? '',
      // 환경변수를 런타임에 서버에서 전달 (Vercel 빌드 캐시 문제 해결)
      paypalChannelKey: process.env.NEXT_PUBLIC_PAYPAL_CHANNEL_KEY || '',
      paypalCurrency: process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || 'USD',
      merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID || '',
    },
  };
};

export default Purchase;
