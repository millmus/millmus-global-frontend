"use client"

import { lecturesApi, purchaseApi } from "@libs/api"
import type { GetServerSidePropsContext, NextPage } from "next"
import SEO from "@components/seo"
import { useEffect, useState } from "react"
import { useUser } from "@libs/client/useUser"
import useSWR from "swr"
import { useRouter } from "next/router"
import YouTube from "react-youtube"
import Image from "next/image"
import Link from "next/link"
import LiveChat from "@components/chat/live-chat"
import kakaoIcon from "@public/kakao.png"
import axios from "axios"

interface IProps {
  id: string
  lectureData: any
}

const LiveWatch: NextPage<IProps> = ({ id, lectureData }) => {
  console.log('###### LiveWatch') 
  console.log('###### id', id)
  console.log('###### lectureData', lectureData)

  const router = useRouter()
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [youtubeVideoTitle, setYoutubeVideoTitle] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  const [token, setToken] = useState<string | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  // // 로그인은 선택사항 (isPrivate: false)
  // const { token, profile } = useUser({ isPrivate: false })

  // 라이브 강의 정보 가져오기
  const { data: liveData } = useSWR(`/lecture/${id}`, () => lecturesApi.detail(id))

  // 자동 신청 함수 - 로그인 사용자는 무료 강의 자동 신청
  const handleAutoApply = async (userToken: string) => {
    try {
      console.log('자동 신청 체크 시작...');
      
      // 1. 먼저 신청 여부 확인
      const checkResult = await purchaseApi.check('lecture', parseInt(id), userToken);
      console.log('신청 여부:', checkResult);
      
      if (checkResult === 'already purchased') {
        // 이미 신청한 경우 my 페이지로 이동
        console.log('이미 신청한 강의 - my 페이지로 이동');
        const myLectureID = await purchaseApi.myLectureID(parseInt(id), userToken);
        if (myLectureID) {
          router.push(`/lecture/my/${myLectureID}/1`);
        }
      } else {
        // 2. 아직 신청하지 않은 경우
        // 무료 강의인지 확인 (가격이 0원인 경우)
        if (lectureData?.price === 0 || liveData?.price === 0) {
          // 무료 강의는 자동 신청
          console.log('무료 강의 자동 신청 시작');
          
          try {
            const date = new Date();
            const orderId = `MID${date.getFullYear()}${(
              date.getMonth() +
              1 +
              ''
            ).padStart(2, '0')}${(date.getDate() + '').padStart(
              2,
              '0'
            )}-${date.getTime()}`;

            // 무료 신청 처리
            const response = await purchaseApi.purchase({
              type: 'lecture',
              method: '0원결제',
              id: parseInt(id),
              price: 0,
              totalPrice: 0,
              point: 0,
              coupon: null,
              token: userToken,
              orderId: orderId,
              option: "1"
            });
            
            console.log('무료 신청 성공:', response);
            
            // 신청 성공 후 my 페이지로 이동
            const myLectureID = await purchaseApi.myLectureID(parseInt(id), userToken);
            if (myLectureID) {
              console.log('my 페이지로 이동:', myLectureID);
              router.push(`/lecture/my/${myLectureID}/1`);
            }
          } catch (error) {
            console.error('무료 신청 실패:', error);
            // 실패해도 페이지는 그대로 유지 (사용자가 시청 가능)
            console.log('신청 실패했지만 시청은 가능합니다');
          }
        } else {
          // 유료 강의는 자동 신청하지 않음 (현재 페이지 유지)
          console.log('유료 강의 - 현재 페이지에서 시청');
          // 필요시 결제 유도 UI 표시 가능
        }
      }
    } catch (error) {
      console.error('자동 신청 체크 실패:', error);
      // 오류가 발생해도 페이지는 유지
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const {
        data: { token, profile },
      } = await axios.get('/api/user');

      console.log('###### token', token)
      console.log('###### profile', profile)
      console.log('###### router.query.autoApply', router.query.autoApply);

      setToken(token)
      setProfile(profile)
      
      // 로그인된 사용자는 항상 자동 신청 체크 (무료 강의인 경우만 자동 신청됨)
      if (token) {
        handleAutoApply(token);
      }
    }
    fetchToken()
  }, [])

  useEffect(() => {
    if (lectureData?.image) {
      setPreviewImage(lectureData.image)
    }
  }, [lectureData])
  
  // liveData가 로드되면 자동 신청 재시도 (가격 정보가 필요한 경우)
  useEffect(() => {
    if (token && liveData) {
      // 이미 handleAutoApply가 실행되었지만 liveData가 없어서 실패한 경우를 위해
      console.log('liveData 로드 완료, 가격:', liveData?.price);
    }
  }, [liveData, token])

  // 모바일 여부 감지 및 body 스크롤 제어
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 820 // tailwind sm breakpoint(max)
      setIsMobile(mobile)
      document.body.style.overflow = mobile ? 'hidden' : 'auto'
      // live-watch 페이지에서만 footer 숨김 처리
      const footer = document.querySelector('footer') as HTMLElement | null
      if (footer) {
        footer.style.display = mobile ? 'none' : ''
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      document.body.style.overflow = 'auto'
      const footer = document.querySelector('footer') as HTMLElement | null
      if (footer) footer.style.display = ''
    }
  }, [])

  const onPlayerReady = (event: any) => {
    console.log("##### onPlayerReady")
    const player = event.target

    if (event.target) {
      setYoutubeVideoTitle(event.target.videoTitle)
    }

    // 라이브 스트림이면 현재 위치로 이동
    player.seekTo(player.getDuration())
    player.playVideo()
  }

  const handleEnd = (e: any) => {
    console.log("##### handleEnd")
  }

  const handlePlay = (e: any) => {
    console.log("##### handlePlay")
  }

  const handleError = (e: any) => {
    console.log("##### handleError")
    console.log(e)
  }

  useEffect(() => {
    console.log('###### liveData', liveData)
  }, [liveData])

  // 라이브가 종료되었거나 시작되지 않은 경우
  if (liveData?.live_ended === true) {
    return (
      <>
        <SEO title={lectureData?.name || "라이브 강의"} />
        <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">라이브 강의가 종료되었습니다</h1>
            <p className="text-gray-400">다음 라이브 강의를 기다려주세요.</p>
            <Link href="/">
              <a className="mt-4 inline-block px-6 py-3 bg-[#00e7ff] text-black rounded hover:opacity-90">
                홈으로 돌아가기
              </a>
            </Link>
          </div>
        </div>
      </>
    )
  }

  // // 라이브 대기 중인 경우
  // if (liveData?.live_ended === "라이브 대기중") {
  //   return (
  //     <>
  //       <SEO title={lectureData?.name || "라이브 강의"} />
  //       <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
  //         <div className="text-center text-white">
  //           <h1 className="text-2xl font-bold mb-4">라이브 강의 준비 중입니다</h1>
  //           <p className="text-gray-400">잠시만 기다려주세요.</p>
  //           <div className="mt-4 animate-pulse">
  //             <div className="w-16 h-16 bg-[#00e7ff] rounded-full mx-auto"></div>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   )
  // }

  return (
    <>
      <SEO title={liveData?.name || lectureData?.name || "라이브 강의"} />

      <div className='px-12 pb-36 sm:pt-6' style={{maxWidth: '1180px', margin: "auto"}}>
      <>
        <div className='mt-10 flex space-x-5 sm:mt-6 sm:flex-col sm:space-x-0 sm:space-y-0 sm:inset-x-0 sm:bottom-0 sm:fixed sm:top-20 sm:z-[99999999]'>
          <div className='w-[65%] sm:w-full sm:h-1/2'>
            <div className='relative aspect-video h-full w-full max-h-[400px] bg-black sm:max-h-full'>
            {previewImage && (youtubeVideoTitle === '' || youtubeVideoTitle === null) && <div className='absolute w-full h-full bg-black z-50'>
                 <Image src={previewImage
                  ? previewImage
                  : '/images/placeholder.png'
                } layout='fill' objectFit='contain' />
              </div>}
              <YouTube
                id='yt'
                videoId={liveData?.live_vid}
                // onReady={(e) => {e.target.playVideo()}}
                className="absolute top-0 left-0 aspect-video w-full h-full"
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: {
                    autoplay: 1,
                    // mute: 1,
                    // controls: 0,
                    rel: 0, 
                    modestbranding: 1
                  },
                }}
                // onReady: PropTypes.Requireable<(...args: any[]) => any>;
                // onError: PropTypes.Requireable<(...args: any[]) => any>;
                // onPlay: PropTypes.Requireable<(...args: any[]) => any>;
                // onPause: PropTypes.Requireable<(...args: any[]) => any>;
                // onEnd: PropTypes.Requireable<(...args: any[]) => any>;
                // onStateChange: PropTypes.Requireable<(...args: any[]) => any>;
                // onPlaybackRateChange: PropTypes.Requireable<(...args: any[]) => any>;
                // onPlaybackQualityChange: PropTypes.Requireable<(...args: any[]) => any>;
                onReady={onPlayerReady} // player ready 이벤트 핸들러 추가
                onEnd={handleEnd}
                onPlay={handlePlay}
                onError={handleError}
              />
            </div>
            {liveData?.live_text?.length > 0 && (
              <div className='mt-8 w-full rounded-sm bg-[#1e2126] py-8 px-10 sm:hidden'>
                <div className='flex w-full rounded-sm'>
                  <div style={{width: '24px', height: '24px', marginRight: '24px'}}>💡</div>
                  <div className='w-full max-h-[150px] overflow-y-auto break-all' style={{whiteSpace: "break-spaces"}}>
                    {liveData?.live_text}
                  </div>
                </div>
                <div className='mt-4'>
                  <div className='flex space-x-4 font-medium md:text-sm items-center flex-row'>
                    {liveData?.live_external_link &&
                    <>
                      <Link href={liveData?.live_external_link.startsWith('http') ? liveData?.live_external_link : `https://${liveData?.live_external_link}`}>
                        <a target='_blank'>
                          <div className='flex px-4 py-2 items-center justify-center rounded bg-[#ffeb00] font-medium text-[#282e38] transition-all hover:opacity-90'>
                            <>
                              <div className='flex flex-row gap-2 items-center'>
                                <Image
                                  src={kakaoIcon}
                                  width={24}
                                  height={24}
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
                      {/* {data?.live_external_link_help && <div className=''>
                        <span>입장코드</span>
                        <span className="bg-[#ffeb00] font-medium mx-2 px-1 rounded-sm text-[#282e38]">{data?.live_external_link_help}</span>
                      </div>} */}
                    </>
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
           
          <div className='flex flex-col relative grow font-medium sm:h-1/2'>
          {
            liveData?.live_ended == true ? 
            <div className="relative flex h-full w-full bg-[#0f0f0f]/[.5] md:bg-[#0f0f0f]">
              <span className="m-auto">라이브 채팅창이 종료되었습니다.</span>
            </div>
            :
            liveData?.live_ended == '라이브 대기중' ? 
            <div className="relative flex h-full w-full bg-[#0f0f0f]/[.5] md:bg-[#0f0f0f]">
              <span className="m-auto">라이브 채팅창이 준비 중입니다.</span>
            </div>
            :
            liveData && (
              liveData?.chat_room_number ?
              <LiveChat lectureId={liveData?.chat_room_number} user={token && profile ? { token, profile } : null} />
              : 
              <LiveChat lectureId={id} user={token && profile ? { token, profile } : null} />
            )
          }
          </div>

          {liveData?.live_text?.length > 0 && (
          <div className='hidden mt-8 flex flex-col w-full rounded-sm bg-[#1e2126] p-4'>
            <div style={{width: '24px', height: '24px'}}>💡</div>
            <div className='w-full max-h-[150px] overflow-y-auto pl-1 break-all' style={{whiteSpace: "break-spaces"}}>
              {liveData?.live_text}
            </div>
          </div>
          )}
        </div>
      </>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = ctx.params?.id as string

  console.log('###### id', id)

  try {
    const lectureData = await lecturesApi.detail(id)
    console.log('###### lectureData', lectureData)

    return {
      props: {
        id,
        lectureData: lectureData || null,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default LiveWatch
