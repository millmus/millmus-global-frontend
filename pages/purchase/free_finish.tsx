import SEO from '@components/seo';
import Layout from '@layouts/sectionLayout';
import { lecturesApi, purchaseApi, usersApi } from '@libs/api';
import { useUser } from '@libs/client/useUser';
import axios from 'axios';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import kakaoIcon from '@public/kakao.png';
import Image from 'next/image';
import useSWR from 'swr';
import { ICard } from 'types';

interface IProps {
  id: number;
  name: string;
  type: string;
  price: number;
  point: number;
  coupon: any;
  merchant_uid: string;
  prevToken: string;
  option: string;
  islive: boolean;
  live_external_link: string;
  live_external_link_help: string;
}

const Finish: NextPage<IProps> = ({ id, name, type, price, point, coupon, merchant_uid, prevToken, option, islive, live_external_link, live_external_link_help }) => {
  const { token } = useUser({ isPrivate: true });
  const { data } = useSWR('/cms/main', () => lecturesApi.mainLectureList());

  const category = 'ongoing';
  const page = '1';

  const [myLectureList, setMyLectureList] = useState<any[]>([]);
  const [currentLecture, setCurrentLecture] = useState<any>(null);

  // 프리스쿨
  const [businessClassList, setBusinessClassList] = useState<ICard[]|null>(null);
  const [businessClassIds, setBusinessClassIds] = useState<number[]>([]);

  const custom_data = {
    id,
    name,
    type,
    price,
    total_price: 0,
    point,
    coupon,
    token: prevToken,
  };
  const router = useRouter();

  useEffect(() => {
    if (!data) return;

    console.log('data', data);
    const business_class = data.business_class;
    const businessCards: ICard[] = [];
    business_class.forEach((item: any) => {
      const card: ICard = {
        id: item.lecture.id,
        title: item.lecture.name,
        imageLink: item.main_thumbnail,
        link: `/lecture/detail/${item.lecture.id}`,
      }
      businessCards.push(card);
    });
    setBusinessClassList(businessCards);
    setBusinessClassIds(business_class.map((item: any) => item.lecture.id));
  }, [data])

  useEffect(() => {
    console.log('businessClassIds', businessClassIds, 'id', id);

    if (businessClassIds.includes(Number(id))) {
      console.log('프리스쿨');
    } else {
      console.log('프리스쿨 아님');
    }
  }, [businessClassIds])

  const getData = async () => {
    if (coupon) Object.assign(custom_data, { coupon: coupon });
    try {
      if (token === prevToken) {
        await purchaseApi.purchase({
          type,
          method: '0원결제',
          id,
          price,
          totalPrice: 0,
          point,
          coupon,
          orderId: merchant_uid,
          token,
          option,
        });

        // const myLectureList = await usersApi.myLectureList(category !== 'ongoing', page, token as string)
        // console.log('#111 myLectureList', myLectureList);
        // setMyLectureList(myLectureList.registered.results);

        // myLectureList.registered.next = null이 될때까지 데이터를 가져옴
        let page = 1;
        let myLectureList = [];
        while (true) {
          const myLectureList = await usersApi.myLectureList(category !== 'ongoing', page.toString(), token as string);

          console.log('id', id);
          console.log('myLectureList', myLectureList);
          
          // myLectureList.registered.results 의 모든 lecture_id 출력
          myLectureList.registered.results.forEach((item: any) => {
            console.log('item.lecture_id', item.lecture_id);
          });

          const currentLecture = myLectureList.registered.results.find((item: any) => Number(item.lecture_id) === Number(id));
          console.log('currentLecture', currentLecture);
          if (currentLecture) {
            setCurrentLecture(currentLecture);
            // 현재 강의가 있으면 종료
            break;
          }
          if (myLectureList.registered.next === null) break;
          page++;
        }

      } else {
        alert('결제가 취소되었습니다.');
        router.replace(`/purchase/${type}/${id}`);
      }
    } catch {
      router.replace('/');
    }
  };

  useEffect(() => {
    if (token) {
      getData();
    }
  }, [token]);

  // useEffect(() => {
  //   if (myLectureList.length > 0) {
  //     setCurrentLecture(myLectureList.find((item: any) => item.live_external_link === live_external_link));
  //   }
  // }, [myLectureList])

  useEffect(() => {
    console.log('currentLecture', currentLecture);
  }, [currentLecture])

  return (
    <>
      <SEO title='신청완료' />
      <Layout padding='pt-24 pb-48'>
        {!custom_data ? (
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
        ) : (
          !businessClassList ? (
            <>
              <div className='flex items-center justify-center h-[296px] text-stone-500 text-[14px]'>Loading..</div>
            </>
          ) : (<>
            <div className='flex justify-center text-[2.5rem] font-bold text-center sm:text-left md:text-3xl' style={{ wordBreak: 'keep-all' }}>
              {
                id == 198 ?
                  <><span className='contents sm:hidden'>밀레니얼머니스쿨</span><span className='hidden sm:contents'>밀머스</span> x 머니테이커 <br className='sm:hidden' />무료특강 신청 마지막 단계입니다!<br /></>
                  :
                  businessClassIds.includes(Number(id)) ? 
                    <>노베이스를 위한 프리스쿨<br className='sm:hidden' />영상보고 그대로 따라하세요!<br /></>
                    :
                    <>무료라이브 단톡방 <br className='sm:hidden' />지금 바로 입장하세요!<br /></>
              }
            </div>
            <div className='mt-4 flex justify-center font-light md:block'>
              {
                id == 198 ?
                  <>
                    ※ 아래 클릭해 정보입력 후 제출해야 복습영상, 무료전자책 2종, 단톡방을 제공합니다!
                  </>
                  :
                  businessClassIds.includes(Number(id)) ? 
                    <>※ 프리스쿨 영상은 결제없이 제공되는 초보 셀러를 위한 기본세팅 가이드입니다.</>
                    :
                    <>※ 무료특강은 결제없이 제공되는 알차고 안전한 무료서비스입니다.</>
              }
            </div>

            <div className='mt-20 flex flex-col justify-center gap-4'>
              {live_external_link ?
                <>
                  {live_external_link_help && <>
                    <div className='mb-2 flex justify-center font-light'>
                      입장코드 <span className="bg-[#ffeb00] font-medium mx-2 px-1 rounded-sm text-[#282e38]">{live_external_link_help}</span>
                    </div>
                  </>}
                  <Link href={live_external_link.startsWith('http') ? live_external_link : `https://${live_external_link}`}>
                    <a target='_blank' className='mx-auto'>
                      <div className='flex h-14 w-64 items-center justify-center rounded bg-[#ffeb00] font-medium text-[#282e38] transition-all hover:opacity-90'>
                        {
                          id == 198 ?
                            <>
                              필수! 무료혜택 받으러가기
                            </>
                            :
                            <>
                              <div className='flex flex-row gap-2 items-center'>
                                <Image
                                  src={kakaoIcon}
                                  width={40}
                                  height={40}
                                  alt='Kakao Icon'
                                  objectFit='cover'
                                  placeholder='blur'
                                  quality={100}
                                />
                                <span>단톡방 바로 입장</span>
                              </div>
                            </>
                        }
                      </div>
                    </a>
                  </Link>
                  
                </>
                :
                <Link href='/mypage/lecture/ongoing/1'>
                  <a className='mx-auto'>
                    <div className='flex h-14 w-64 items-center justify-center rounded bg-[#00e7ff] font-medium text-[#282e38] transition-all hover:opacity-90'>
                      {businessClassIds.includes(Number(id)) ? 
                        <>프리스쿨 영상 바로가기</> 
                        : 
                        <>무료특강 확인하기</>}
                    </div>
                  </a>
                </Link>
              }
              {currentLecture &&
                <>
                  <div className='flex flex-col justify-center gap-4'>
                    {(currentLecture.live_ended == '라이브 대기중' || currentLecture.live_ended == '라이브 진행중') ? <Link href={`/lecture/my/${currentLecture.id}/1`}>
                      <a target='_blank' className='mx-auto'>
                        <div className='flex h-14 w-64 items-center justify-center rounded bg-[#00e7ff] font-medium text-[#282e38] transition-all hover:opacity-90'>
                          <>
                            <div className='flex flex-row gap-2 items-center'>
                              <span>라이브 참여하기</span>
                            </div>
                          </>
                        </div>
                      </a>
                    </Link> : <Link href={`/lecture/my/${currentLecture?.id}/1`}>
                      <a target='_blank' className='mx-auto'>
                        <div className='flex h-14 w-64 items-center justify-center rounded bg-[#00e7ff] font-medium text-[#282e38] transition-all hover:opacity-90'>
                          <>
                            <div className='flex flex-row gap-2 items-center'>
                              <span>녹화본 다시보기</span>
                            </div>
                          </>
                        </div>
                      </a>
                    </Link>}
                  </div>
                </>
              }
            </div >
          </>)
        )}
      </Layout >
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      id: ctx.query?.id,
      name: ctx.query?.name,
      type: ctx.query?.type,
      price: ctx.query?.price,
      point: ctx.query?.point,
      coupon: ctx.query?.coupon,
      merchant_uid: ctx.query?.merchant_uid,
      prevToken: ctx.query?.token,
      option: ctx.query?.option ?? "",
      islive: ctx.query?.islive ?? false,
      live_external_link: ctx.query?.live_external_link ?? "",
      live_external_link_help: ctx.query?.live_external_link_help ?? "",
    },
  };
};

export default Finish;