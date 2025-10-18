import { useState, useEffect } from 'react';
import Layout from '@layouts/sectionLayout';
import { gradeImg } from '@components/grade';
import { purchaseApi, usersApi } from '@libs/api';
import { cls, trimDate } from '@libs/client/utils';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import Dday from './dday';
import kakaoIcon from '@public/kakao.png';
import { motion } from 'framer-motion';

interface IProps {
  id: number;
  image: string;
  category: string;
  name: string;
  text: string;
  price: number;
  discount: number;
  discount_period: string;
  is_offline: boolean;
  sold_out: boolean;
  series: any;
  live_external_link: any;
  live_external_link_help: any;
  selectOption: (id: number, price_only: any) => void;
}

export default function Detail({
  id,
  image,
  category,
  name,
  text,
  price,
  discount,
  discount_period,
  is_offline,
  sold_out,
  series,
  live_external_link,
  live_external_link_help,
  selectOption,
}: IProps) {
  const options = [];
  if (series) {
    if (series?.is_plan) {
      options.push(...[
        'BASIC (ALL VOD)', 'PREMIUM (ALL OFFLINE)', 'VIP (ALL VOD + OFFLINE)'
      ]);
    } else { // 임시
      if (id == 193 || id == 194 || id == 212 || id == 213 || id == 224 || id == 225 || id == 229 || id == 230) options.push(...['라이브클래스 + 챌린지 패키지', '라이브클래스 ONLY']);
      else if (id == 220 || id == 221) options.push(...['오프클래스+챌린지 패키지', '온라인클래스+챌린지 패키지']);
      else if (id == 248 || id == 249) options.push(...['오프라인+줌라이브 패키지', 'VOD ONLY 패키지']);
      else if (series?.price == 0) options.push(...['오프클래스+VOD 패키지', 'VOD ONLY 패키지']);
      else options.push(...['현장참석권', 'VOD시청권', '현장+VOD 통합권']);
    }
  }
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [showPurchasedPopup, setShowPurchasedPopup] = useState(false);

  console.log('live_external_link', live_external_link);

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

  const purchaseLink = () => selectedOptionIndex == 2 ? `/purchase/lecture/${id}?option=${selectedOptionIndex}` : `/purchase/lecture/${id}`;
  const { data: myData } = useSWR('/api/user');
  const { data } = useSWR(
    myData?.token ? `/payment/check/lecture/${id}` : null,
    () => purchaseApi.check('lecture', id, myData?.token, selectedOptionIndex.toString())
  );
  console.log('myData', myData);
  console.log('data', data);


  const [myLectureList, setMyLectureList] = useState<any[]>([]);
  const [currentLecture, setCurrentLecture] = useState<any>(undefined);

  useEffect(() => {
    if (myData?.token) {
      const fetchMyLectureList = async () => {
        const category = 'ongoing';

        // myLectureList.registered.next = null이 될때까지 데이터를 가져옴
        let page = 1;
        let myLectureList = [];
        while (true) {
          const myLectureList = await usersApi.myLectureList(category !== 'ongoing', page.toString(), myData?.token);

          const currentLecture = myLectureList.registered.results.find((item: any) => Number(item.lecture_id) === Number(id));
          if (currentLecture) {
            setCurrentLecture(currentLecture);
            // 현재 강의가 있으면 종료
            break;
          }
          if (myLectureList.registered.next === null) break;
          page++;
        }

        // // 

        // const page = '1';
        // const myLectureList = await usersApi.myLectureList(category !== 'ongoing', page, myData?.token);

        // console.log('myLectureList', myLectureList);


      }

      if (data === 'already purchased') {
        fetchMyLectureList();
      }
    }
  }, [myData?.token, data]);

  useEffect(() => {
    if (myLectureList.length > 0) {
      console.log('myLectureList', myLectureList);
      setCurrentLecture(myLectureList.find((item: any) => item.live_external_link === live_external_link));
    }
  }, [myLectureList]);

  useEffect(() => {
    console.log('currentLecture', currentLecture);
  }, [currentLecture])

  const copyUrl = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => alert('링크가 복사되었습니다.'));
    // @ts-ignore
    window.fbq('track', 'AddToWishlist');
  };

  useEffect(() => {
    setSelectedOptionIndex(-1);
  }, []);
  return (
    <>
    <Layout padding='pt-24 md:pt-6'>
      <div className='flex justify-between md:block'>
        {/* 썸네일 */}
        <div className={cls(series ? 'h-[35.625rem]' : 'h-[33.625rem]', 'relative w-[35rem] md:h-[16.25rem] md:w-full')}>
          {image && (
            <Image
              src={image}
              alt='Detail Thumbnail'
              layout='fill'
              objectFit='contain'
              className='rounded-md'
              objectPosition='top'
            />
          )}
        </div>
        {/* 썸네일 */}

        {/* 강의 상세정보 */}
        <div className={cls(series ? 'h-[35.625rem]' : 'h-[33.625rem]', 'flex w-[26.75rem] flex-col justify-between md:w-full md:h-fit')}>
          {/* 카테고리 */}
          <div className='text-sm font-medium md:mt-6'>{category == "코인" ? "무료특강" : category}</div>
          {/* 카테고리 */}

          {/* 강의명 */}
          <div className='mt-[0.625rem] text-[1.75rem] font-medium md:mt-2 md:mb-6 md:text-xl'>
            {name}
          </div>
          {/* 강의명 */}

          {/* 간략 설명 */}
          <div className={cls(series ? 'max-h-40 overflow-y-auto' : '', 'whitespace-pre-wrap border-y-2 border-[#464c59] py-4 text-[#cfcfcf] md:py-4 md:text-sm')}>
            {text}
          </div>
          {/* 간략 설명 */}

          {/* 가격 */}
          {!series || (series && selectedOptionIndex >= 0) ? <>
            <div className='mt-4 flex h-20 w-full flex-col justify-center rounded bg-[rgba(0,184,204,0.4)] px-4'>
              <div className='flex justify-end text-sm font-medium text-[#00e7ff] md:text-xs'>
                12개월 무이자 할부지원
              </div>

              <div className='flex items-center justify-between whitespace-nowrap'>
                <div className='flex text-xl text-[#cfcfcf] md:text-sm'>
                  {/* 정상가 */}
                  <div
                    className={cls(
                      discount > 0 ? 'line-through' : '',
                      'mr-[0.375rem]'
                    )}
                  >
                    {price?.toLocaleString()}원
                  </div>
                  {/* 정상가 */}

                  {/* 할인가 */}
                  {discount > 0 && (
                    <div>{(price - discount).toLocaleString()}원</div>
                  )}
                  {/* 할인가 */}
                </div>

                <div className='flex text-2xl md:text-lg'>
                  {/* 할인율 */}
                  {discount > 0 && (
                    <div className='mr-2 text-[#00e7ff]'>
                      {Math.round((discount / price) * 100)}%
                    </div>
                  )}
                  {/* 할인율 */}

                  {/* 12개월 할부시 1달 가격 */}
                  <div>
                    <span className='text-xl md:text-lg'>월</span>{' '}
                    <span className='font-bold md:text-xl'>
                      {Math.round((price - discount) / 12).toLocaleString()}
                    </span>
                    <span className='text-xl md:text-lg'>원</span>
                  </div>
                  {/* 12개월 할부시 1달 가격 */}
                </div>
              </div>
            </div>
            {/* 가격 */}

            {/* 할인 기간 */}
            {discount > 0 && (
              <div className='mt-3 text-sm font-medium text-[#cfcfcf] md:text-xs'>
                <span className='font-bold'>*얼리버드</span>: ~{' '}
                {discount_period.split('-')[1]}/{discount_period.split('-')[2]}
                <Dday
                  discount_period={discount_period}
                  price={price.toLocaleString()}
                  final_price={(price - discount).toLocaleString()}>
                  {data === 'already purchased' ? (
                    <div
                      onClick={() => setShowPurchasedPopup(true)}
                      className='flex p-1 w-full h-[40px] cursor-pointer items-center justify-center rounded bg-[#00e7ff] font-bold text-black transition-all hover:opacity-90 md:p-1 md:h-[45px]'
                    >
                      신청하기
                    </div>
                  ) : sold_out ? (
                    <div className='flex p-1 w-full h-[40px] pointer-events-none items-center justify-center rounded bg-gray-500 text-black'>
                      신청마감
                    </div>
                  ) : (
                    <div onClick={() => {
                      window.location.href = purchaseLink();
                    }} className='flex p-1 w-full h-[40px] cursor-pointer items-center justify-center rounded bg-[#00e7ff] font-bold text-black transition-all hover:opacity-90 md:p-1 md:h-[45px]'>
                      신청하기
                    </div>
                  )}
                </Dday>
              </div>
            )}
            {/* 할인 기간 */}
          </> : null
          }

          {/* 구매 옵션 */}
          {series ?
            <div className="mx-4 mt-3">
              <select className="w-full px-2 py-1 text-black" value={selectedOptionIndex} onChange={async e => {
                const index = parseInt(e.target.value);
                setSelectedOptionIndex(index);
                switch (index) {
                  case 0:
                    selectOption(series.is_plan ? series.vod_id : series.ticket_id, false);
                    break;
                  case 1:
                    selectOption(series.is_plan ? series.ticket_id : series.vod_id, false);
                    break;
                  default:
                    selectOption(index, series);
                    break;
                }

              }}>
                <option className="hidden" value={-1} disabled>클릭해 온/오프 클래스 선택 (필수)</option>
                {series.is_plan ? <>
                  {series.ticket_id && series.vod_id && <option value={2}>{options[2]}</option>}
                  {series.ticket_id && <option value={1}>{options[1]}</option>}
                  {series.vod_id && <option value={0}>{options[0]}</option>}
                </> :
                  options.length == 2 ?
                    <>
                      {series.ticket_id && <option value={0}>{options[0]}</option>}
                      {series.vod_id && <option value={1}>{options[1]}</option>}
                    </>
                    :
                    <>
                      {series.ticket_id && series.vod_id && <option value={2}>{options[2]}</option>}
                      {series.ticket_id && <option value={0}>{options[0]}</option>}
                      {series.vod_id && <option value={1}>{options[1]}</option>}
                    </>
                }
              </select>
              {selectedOptionIndex >= 0 &&
                <div className="w-full flex px-3 py-4 justify-between font-bold border-b">
                  <span>{options[selectedOptionIndex]}</span>
                  <div className="flex gap-x-4">
                    <span>{selectedOptionIndex == 2 ? (series?.price - series?.discount).toLocaleString() : (price - discount).toLocaleString()}원</span>
                    <svg
                      onClick={() => setSelectedOptionIndex(-1)}
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                      className="w-[20px] h-[20px] cursor-pointer self-center">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              }
            </div>
            : null
          }
          {/* 구매 옵션 */}

          {/* 복사 & 구매 버튼 */}
          <div className='mt-6 flex'>
            <div
              onClick={copyUrl}
              className='flex aspect-square w-[3.625rem] cursor-pointer items-center justify-center rounded bg-[#4a4e57] transition-all hover:opacity-90'
            >
              <svg
                width='20'
                height='10'
                viewBox='0 0 20 10'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M1.9 5C1.9 3.29 3.29 1.9 5 1.9H9V0H5C2.24 0 0 2.24 0 5C0 7.76 2.24 10 5 10H9V8.1H5C3.29 8.1 1.9 6.71 1.9 5ZM6 6H14V4H6V6ZM15 0H11V1.9H15C16.71 1.9 18.1 3.29 18.1 5C18.1 6.71 16.71 8.1 15 8.1H11V10H15C17.76 10 20 7.76 20 5C20 2.24 17.76 0 15 0Z'
                  fill='white'
                />
              </svg>
            </div>


            {(selectedOptionIndex != -1 && sold_out) || (series && series?.all_sold_out) || (!series && sold_out) ? (
              <div className='flex ml-3 grow p-4 pointer-events-none items-center justify-center rounded bg-gray-500 text-xl font-bold text-black'>
                신청마감
              </div>
            ) : data === 'already purchased' ? (
              <div
                onClick={() => setShowPurchasedPopup(true)}
                className='ml-3 flex grow cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-xl font-bold text-[#282e38] transition-all hover:opacity-90'
              >
                신청하기
              </div>
            ) : (
              <div onClick={() => {
                if (series && selectedOptionIndex < 0) {
                  alert("옵션선택은 필수입니다");
                  return;
                }
                window.location.href = purchaseLink();
              }} className='ml-3 flex grow cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-xl font-bold text-[#282e38] transition-all hover:opacity-90'>
                신청하기
              </div>
            )}
          </div>
          {/* 임시 */}
          {(id == 187 || id == 189) &&
            <div className='mt-6 flex'>
              <Link href={'/lecture/detail/190'}>
                <a className='flex h-[3.625rem] grow cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-xl font-bold text-[#282e38] transition-all hover:opacity-90'>
                  해외구매대행만 신청하기
                </a>
              </Link>
            </div>
          }
          {(id == 188 || id == 190) &&
            <div className='mt-6 flex'>
              <Link href={'/lecture/detail/187'}>
                <a className='flex h-[3.625rem] grow cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-xl font-bold text-[#282e38] transition-all hover:opacity-90'>
                  쿠팡 업그레이드 신청하기
                </a>
              </Link>
            </div>
          }
          {/* 임시 */}
          {/* 복사 & 구매 버튼 */}
        </div>
        {/* 강의 상세정보 */}
      </div>
    </Layout>

    {showPurchasedPopup && (
      <div
        onClick={() => setShowPurchasedPopup(false)}
        className='fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.6)]'
      >
        <motion.div
          onClick={(e) => {
            e.stopPropagation();
          }}
          variants={popupVar}
          initial='invisible'
          animate='visible'
          exit='exit'
          className='flex flex-col items-center gap-y-6 w-[20rem] md:w-[25rem] rounded bg-[#282e38] py-8 px-8'
        >
          <p className='text-center text-[#cfcfcf]'>이미 구매한 강의입니다.</p>
              {live_external_link &&
                <>
                  <div className='flex flex-col justify-center gap-4'>
                  {live_external_link_help && <>
                    <div className='mb-2 flex justify-center font-light'>
                      입장코드 <span className="bg-[#ffeb00] font-medium mx-2 px-1 rounded-sm text-[#282e38]">{live_external_link_help}</span>
                    </div>
                  </>}
                  <Link href={live_external_link.startsWith('http') ? live_external_link : `https://${live_external_link}`}>
                    <a target='_blank' className='mx-auto'>
                      <div className='flex h-14 w-64 items-center justify-center rounded bg-[#ffeb00] font-medium text-[#282e38] transition-all hover:opacity-90'>
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
                      </div>
                    </a>
                  </Link>
                  </div>
                </>
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
        </motion.div>
      </div>
    )}

    </>
  );
}
