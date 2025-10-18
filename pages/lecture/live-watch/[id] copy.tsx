"use client"

import { lecturesApi } from "@libs/api"
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


  useEffect(() => {
    const fetchToken = async () => {
      const {
        data: { token, profile },
      } = await axios.get('/api/user');

      console.log('###### token', token)
      console.log('###### profile', profile)

      setToken(token)
      setProfile(profile)
    }
    fetchToken()
  }, [])

  useEffect(() => {
    if (lectureData?.image) {
      setPreviewImage(lectureData.image)
    }
  }, [lectureData])

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
  if (!liveData?.live_vid || liveData?.live_ended === true) {
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

  // 라이브 대기 중인 경우
  if (liveData?.live_ended === "라이브 대기중") {
    return (
      <>
        <SEO title={lectureData?.name || "라이브 강의"} />
        <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">라이브 강의 준비 중입니다</h1>
            <p className="text-gray-400">잠시만 기다려주세요.</p>
            <div className="mt-4 animate-pulse">
              <div className="w-16 h-16 bg-[#00e7ff] rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title={liveData?.name || lectureData?.name || "라이브 강의"} />

      <div className='px-12 pb-36 pt-6 sm:pt-0 sm:px-0 sm:pb-0' style={{maxWidth: '1180px', margin: "auto"}}>
        {/* 메인 컨텐츠 */}
        <div className="mt-10 flex space-x-5 sm:mt-6 sm:flex-col sm:space-x-0 sm:space-y-0 sm:inset-x-0 sm:bottom-0 sm:fixed sm:top-20 sm:z-[99999999]">
          <div className="flex gap-6 sm:gap-0 h-[calc(100vh-120px)] sm:flex-col sm:h-screen sm:overflow-hidden">
            {/* 비디오 영역 */}
            <div className="flex-1 min-w-0 sm:flex-none sm:h-1/2">
              <div className="relative aspect-video h-full w-full max-h-[400px] bg-black sm:max-h-full">
                {previewImage && youtubeVideoTitle === "" && (
                  <div className="absolute w-full h-full bg-black z-50 flex items-center justify-center">
                    <Image
                      src={previewImage || "/placeholder.svg"}
                      layout="fill"
                      objectFit="contain"
                      alt="Live preview"
                    />
                  </div>
                )}

                <YouTube
                  videoId={liveData?.live_vid}
                  className="w-full h-full"
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 1,
                      rel: 0,
                      modestbranding: 1,
                    },
                  }}
                  onReady={onPlayerReady}
                  onEnd={handleEnd}
                  onPlay={handlePlay}
                  onError={handleError}
                />
              </div>

              {/* 라이브 정보 */}
              {liveData?.live_text && (
                <div className="mt-4 p-4 bg-[#1e2126]">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💡</div>
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap break-all text-sm">{liveData.live_text}</div>

                      {/* 카카오톡 단체방 링크 */}
                      {liveData?.live_external_link && (
                        <div className="mt-4">
                          <Link
                            href={
                              liveData.live_external_link.startsWith("http")
                                ? liveData.live_external_link
                                : `https://${liveData.live_external_link}`
                            }
                          >
                            <a
                              target="_blank"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffeb00] text-black rounded hover:opacity-90"
                            >
                              <Image src={kakaoIcon || "/placeholder.svg"} width={20} height={20} alt="Kakao Icon" />
                              단톡방 바로 입장
                            </a>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 채팅 영역 */}
            <div className="">
                <LiveChat lectureId={id} user={token && profile ? { token, profile } : null} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
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
