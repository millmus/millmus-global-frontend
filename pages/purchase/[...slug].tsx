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

interface IProps {
  slug: string[];
  option: string;
}

const Purchase: NextPage<IProps> = ({ slug, option }) => {
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
  const [payMethod, setPayMethod] = useState<string | null>('uplus');
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
      alert('이미 구매한 강의입니다.');
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
      <SEO title='결제' />

      <Layout padding='py-24 md:py-4'>
        <div className='mb-14 text-2xl font-bold md:mb-4 md:text-center md:text-lg md:font-medium'>
          주문 결제
        </div>

        <div className='divide-y-2 divide-[#4a4e57] md:divide-[#282e38] md:bg-[#4a4e57] md:p-4'>
          <div>
            <div className='text-lg font-medium'>주문상품</div>

            {/* 상품정보 헤더 */}
            <div className='mt-6 flex h-[3.75rem] items-center rounded-sm bg-[rgba(229,229,229,0.08)] text-lg font-medium text-[rgba(255,255,255,0.6)] md:hidden'>
              <div className='flex w-1/5 justify-center'>상품정보</div>
              <div className='flex grow'>상품명</div>
              <div className='flex w-1/5 justify-center'>옵션</div>
              <div className='flex w-1/5 justify-center'>상품금액</div>
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
                {priceType ? (priceType === '1' ? '1개월' : '3개월') : '-'}
              </div>
              <div className='flex w-1/5 justify-center'>
                {price?.toLocaleString()} 원
              </div>
            </div>
            {/* 상품정보 Data */}

            {/* 상품정보 Data 모바일*/}
            <div className='hidden py-8 text-lg md:block'>
              <div className='flex grow text-base'>{lectureName()}</div>
              <div className='mt-4 flex justify-between'>
                <div className='text-sm text-[#cfcfcf]'>옵션</div>
                <div className=''>
                  {priceType ? (priceType === '1' ? '1개월' : '3개월') : '-'}
                </div>
              </div>
              <div className='mt-1 flex justify-between'>
                <div className='text-sm text-[#cfcfcf]'>상품금액</div>
                <div className='text-sm'>{price?.toLocaleString()} 원</div>
              </div>
            </div>
            {/* 상품정보 Data 모바일*/}
          </div>

          {data?.category != "코인" && <>
            <div className='pt-14 pb-6 text-lg font-medium'>결제 수단 선택</div>
            <div className='flex flex-col space-y-4 py-8 text-lg md:text-base'>
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
                <div>{'체크/신용카드 (무이자/할부 선택가능)'}</div>
              </div>
              {/* <div className='flex items-center space-x-3' onClick={() => handlePayMethod('trans')}> */}
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
              <><div className='pt-14 pb-6 text-lg font-medium'>
                [오프라인] 관련 상품은 회원가입 쿠폰 사용이 불가합니다.
                <br />온라인 클래스 수강시 사용할 수 있습니다.
              </div></>
            ) : (
              <>
                <div className='pt-14 pb-6 text-lg font-medium md:hidden'>
                  할인 혜택
                </div>
                <div className='flex items-start pt-6 pb-8 md:block'>
                    <div className='mr-12 pt-1.5 text-lg'>적용 가능한 쿠폰</div>

                    <div className='grow'>
                      <div className='flex items-center space-x-4 border-b-2 border-[#4a4e57] pb-6 md:mt-4'>
                        <div className='text-lg'>
                          <span className='font-bold'>{couponFilter(profile?.coupon).length}</span>장
                        </div>

                        <div
                          onClick={() => setCouponPopup(true)}
                          className='cursor-pointer rounded bg-[#4a4e57] py-2 px-4 md:bg-[#676a72]'
                        >
                          쿠폰적용
                        </div>
                      </div>

                      <div className='pt-8 md:hidden'>
                        <div className='text-lg text-[#00e7ff]'>{coupon.name}</div>

                        <div className='mt-4 text-lg'>
                          <span className='font-bold'>
                            {coupon.price?.toLocaleString()}
                          </span>
                          원 할인
                        </div>
                      </div>
                      {/* 모바일 */}
                      <div className='hidden pt-8 md:block md:pt-0'>
                        <div className='flex justify-between'>
                          <div className='text-[#cfcfcf]'>쿠폰번호</div>
                          <div className='text-lg text-[#00e7ff]'>{coupon.name}</div>
                        </div>
                        <div className='flex justify-between'>
                          <div className='text-[#cfcfcf]'>할인금액</div>
                          <div>
                            <span className='font-bold'>
                              {coupon.price?.toLocaleString()}
                            </span>{' '}
                            원
                          </div>
                        </div>
                      </div>
                      {/* 모바일 */}
                    </div>
                  </div>
              </>
            )}

            <div className='flex items-start py-8 md:block'>
                <div className='mr-12 text-lg'>적용 가능한 포인트</div>

                <div className='space-y-6 md:mt-4'>
                  <div className='text-lg md:text-base'>
                    총 <span className='font-bold'>{data?.category == "프리미엄 스터디" || data?.series ? profile?.offline_point : profile?.point}P</span> 보유
                  </div>

                  <div className='flex'>
                    <input
                      type='tel'
                      placeholder='사용 포인트 입력'
                      value={point}
                      onChange={(e) => handlePoint(e)}
                      className='h-10 w-36 rounded-l bg-[rgba(0,0,0,0.25)] pl-4 text-sm outline-none md:w-48'
                    />

                    <div
                      onClick={handleAllPoint}
                      className='-ml-0.5 flex h-10 w-24 cursor-pointer items-center justify-center rounded bg-[#4a4e57] md:bg-[#676a72] md:text-sm'
                    >
                      전액사용
                    </div>
                  </div>
                </div>
              </div>
          </>}

          <div className='pt-14 pb-6 text-lg font-medium'>결제 금액</div>
          <div className='space-y-4 py-8 text-lg'>
            <div className='flex items-center'>
              <div className='w-40'>상품 금액</div>
              <div>{price?.toLocaleString()}</div>
            </div>

            <div className='flex items-center'>
              <div className='w-40'>할인 금액</div>
              <div>-{totalDiscount?.toLocaleString()}</div>
            </div>

            <div className='flex items-center opacity-60'>
              <div className='w-40'>이벤트</div>
              <div>-{data?.discount?.toLocaleString()}</div>
            </div>

            <div className='flex items-center opacity-60'>
              <div className='w-40'>쿠폰</div>
              <div>-{coupon.price?.toLocaleString()}</div>
            </div>

            <div className='flex items-center opacity-60'>
              <div className='w-40'>포인트</div>
              <div>-{point === '' ? '0' : point}</div>
            </div>
          </div>
          <div className='flex items-start pt-4'>
            <div className='w-40 text-lg'>최종 결제 금액</div>

            <div className='flex text-lg'>
              <span className='font-bold'>{totalPrice?.toLocaleString()}</span>
              원
            </div>
          </div>
        </div>

        <div className='mt-20 flex justify-center md:mt-4'>
          <div
            onClick={data?.series && !data?.series?.is_plan && !(profile?.coupon?.filter((d: any) => d.reusable).length) ? handleProposalPayment : handlePayment}
            // onClick={data?.series && !data?.series?.is_plan && !(profile?.coupon?.filter((d: any) => d.reusable).length) ? handleProposalPayment : openModal}
            className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#00e7ff] font-medium text-[#282e38] transition-all hover:opacity-90'
          >
            {data?.category != "코인" ? "결제하기" : "신청하기"}
          </div>
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
                <div>🔍 <span className="underline">오프특강을 1회 이상 참석하셨나요?</span></div>
                <div>😞 <span className="underline">지난번 놓친 VOD가 아쉬우셨나요?</span></div>
              </div>
              <div className='cursor-default items-center rounded-xl bg-[#4a4e57]'>
                <div className='py-4 px-6 text-lg leading-loose md:text-base md:leading-relaxed'>
                  [마스터 멤버십] 가입하면 <br /><span className="bg-[#00e7ff] text-black px-1">최대 80% 저렴하게</span> 이용할 수 있어요!
                </div>
              </div>
              <div className='flex justify-center gap-x-8 md:gap-x-6'>
                <div
                  onClick={() => { router.push('/lecture/detail/83') }}
                  className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-black transition-all hover:opacity-90'
                >
                  멤버십 살펴보기
                </div>
                <div
                  onClick={() => { setSeriesPopup(false); handlePayment(); }}
                  className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#CFCFCF] text-black transition-all hover:opacity-90'
                >
                  기존결제 진행
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
                <div className='flex'><div className='mr-2'>※</div><div>(주)밀레니얼머니스쿨의 안전한 법인계좌로<br className='ml-sm:hidden' /> <span className='bg-[#00e7ff] font-bold px-1 text-black'>{totalPrice.toLocaleString()}원</span>을 입금하신 후 <br className='ml-2 sm:hidden' />아래 접수확인 버튼을 눌러 입금자명을 알려주세요!</div></div>
                <div className='flex'><div className='mr-2'>※</div><div>접수확인을 통해 현금영수증 또는 사업자 계산서 발행이 가능합니다.</div></div>
              </div>
              <div className='cursor-pointer items-center text-center rounded-xl bg-[#4a4e57] font-bold'
                onClick={() => {
                  navigator.clipboard
                    .writeText('국민은행 023501-04-274463 (주)밀레니얼머니스쿨')
                    .then(() => alert('계좌번호가 복사되었습니다.'));
                }}>
                <div className='py-4 px-6 text-lg leading-loose md:text-base md:leading-relaxed'>
                  국민은행 023501-04-274463<br />(주)밀레니얼머니스쿨
                </div>
              </div>
              <div className='flex justify-center gap-x-8 font-bold md:gap-x-6'>
                <button onClick={() => {
                  setBankAccountPopup(false)
                  setPayerNamePopup(true)
                }}>
                {/* <Link href='https://open.kakao.com/o/ssIO6xbg'>
                  <a target='_blank'> */}
                    <div
                      className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-black transition-all hover:opacity-90'
                    >
                      입금 후 접수확인하기
                    </div>
                  {/* </a>
                </Link> */}
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
                  <label className="block text-sm font-medium mb-2">강의 ID</label>
                  <input
                    type="text"
                    {...register('lecture_id', {
                      required: '강의 ID를 입력해주세요',
                    })}
                    className="w-full text-[#cfcfcf] px-3 py-2 bg-[#2b313a] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                    value={data?.id}
                    readOnly
                  />
                  {errors.lecture_id && <span className="text-red-500 text-sm">{errors.lecture_id.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">강의명</label>
                  <input
                    type="text"
                    {...register('lecture_name', {
                      required: '강의명을 입력해주세요',
                    })}
                    className="w-full text-[#cfcfcf] px-3 py-2 bg-[#2b313a] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                    value={lectureName()}
                    readOnly
                  />
                  {errors.lecture_name && <span className="text-red-500 text-sm">{errors.lecture_name.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">성함(필수)</label>
                  <input
                    type="text"
                    {...register('payer_name', {
                      required: '입금자명을 입력해주세요',
                    })}
                    className="w-full text-[#cfcfcf] px-3 py-2 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                  />
                  {errors.payer_name && <span className="text-red-500 text-sm">{errors.payer_name.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">가입 핸드폰번호(필수)</label>
                  <input
                    type="text"
                    maxLength={11}
                    {...register('payer_phone', {
                      required: '핸드폰 번호를 입력해주세요',
                      pattern: {
                        value: /^\d{11}$/, // 숫자만 11자리인지 확인하는 정규식
                        message: '핸드폰 번호는 -없이 숫자 11자리로 입력해주세요',
                      },
                    })}
                    className="w-full text-[#cfcfcf] px-3 py-2 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                  />
                  {errors.payer_phone && <span className="text-red-500 text-sm">{errors.payer_phone.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">현금영수증 발급번호(선택)</label>
                  <input
                    type="text"
                    {...register('cash_receipt_number')}
                    className="w-full text-[#cfcfcf] px-3 py-2 bg-[#e5e5e514] border border-[#e5e5e514] rounded-lg shadow-sm focus:outline-none "
                  />
                  {errors.cash_receipt_number && <span className="text-red-500 text-sm">{errors.cash_receipt_number.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">사업자 계산서 발행시 사업자번호(선택)</label>
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
                        등록하기
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
                  <p className='text-center'>현금 입금내역과 제출정보를 확인 후 정상 접수됩니다.</p>
                  <p className='text-center mt-[5px]'>신청해주셔서 감사합니다!</p>
                </div>
                <div className='flex justify-center gap-x-8 font-bold md:gap-x-6'>
                    <button onClick={() => {
                      // 홈으로 이동
                      router.push('/');
                    }}>
                      <div
                        className='flex h-14 w-64 cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-black transition-all hover:opacity-90'
                      >
                        확인
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
                <div className='flex w-3/4 pl-4'>쿠폰명</div>
                <div className='flex grow justify-center'>할인금액</div>
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
  return {
    props: {
      slug: ctx.params?.slug,
      option: ctx.query?.option ?? '',
    },
  };
};

export default Purchase;
