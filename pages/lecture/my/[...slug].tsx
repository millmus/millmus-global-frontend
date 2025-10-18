import SEO from '@components/seo';
import LiveChat from '@components/lecture/ytLiveChat';
import Chat from '@components/chat/chat';
import YouTube from 'react-youtube';
import { lecturesApi } from '@libs/api';
import { cls } from '@libs/client/utils';
import { AnimatePresence, motion } from 'framer-motion';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import { useUser } from '@libs/client/useUser';
import useSWR from 'swr';
import Image from "next/image";
import DownloadIcon from "@public/icons/file_download.png";
import Player from "@vimeo/player";
import kakaoIcon from '@public/kakao.png';

interface IProps {
  slug: string[];
}

const MyLectureDetail: NextPage<IProps> = ({ slug }) => {
  const { token } = useUser({
    isPrivate: true,
  });
  const router = useRouter();
  const ref = useRef<HTMLIFrameElement>(null);
  const [id, order] = slug;
  const [chapterOpen, setChapterOpen] = useState(null);
  const { data, error } = useSWR(
    token ? `/lectures/registered_lecture/${id}` : null,
    () => lecturesApi.myLectureDetail(id, token as string)
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [youtubeVideoTitle, setYoutubeVideoTitle] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<any>(null);

  const currentVideo = data?.index.flatMap((i: any) =>
    i.video.filter((j: any) => j.order === +order)
  )[0];
  const videoUrl = currentVideo?.url;
  const videoTitle = currentVideo?.title;
  const lastChapter = data?.index[data?.index.length - 1].video;
  const isLastLecture =
    lastChapter && lastChapter[lastChapter.length - 1].order === +order;

  if(lastChapter && lastChapter[lastChapter.length - 1].order < order) {
    router.push(`/lecture/my/${id}/1`)
  }

  const finishLecture = async () => {
    try {
      if (isLastLecture) {
        window.alert('마지막 강의입니다.')
      } else {
        await lecturesApi.finishLecture({ id, order, token });
        router.push(`/lecture/my/${id}/${+order + 1}`);
      }
    } catch {
      alert('Error');
    }
  };

  const fetchDetail = async () => {
    try {
      const lectureId = data?.index[0].lecture;
      const detailData = await lecturesApi.detail(lectureId, token as string);
      // console.log('detailData', detailData);
      // console.log('image', detailData?.image);
      setPreviewImage(detailData?.image);
      setDetailData(detailData);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log('previewImage', previewImage);
    console.log('youtubeVideoTitle', youtubeVideoTitle);
  }, [previewImage])

  useEffect(() => {
    setChapterOpen(
      data?.index.map((i: any) =>
        i.video.map((j: any) => j.order === +order).includes(true)
      )
    );
    fetchDetail();
  }, [data]);

  const chapterVar = {
    invisible: {
      opacity: 0,
      height: 0,
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (error) {
    router.push('/');
  }

  const onEnded = () => {
    finishLecture();
  };

  useEffect(
    () => {
      try {
        if (!data?.live_ended == true) return;
        const player = new Player(ref.current as HTMLIFrameElement);

        player.play();
        player.on('ended', onEnded);

        return () => {
          player.off('ended', onEnded);
        };
      } catch (e) {
        console.log('fail')
      }
    },
    [ref.current?.getAttribute('src')]
  );

  function fullScreen() {
    const e = document.getElementById("yt");
    try {
      e?.requestFullscreen();
    } catch (e) {
      console.log('fail')
    }
  }

  const onPlayerReady = (event: any) => {
    console.log('##### onPlayerReady');
    console.log(event.target);
    const player = event.target;
    console.log('player', player);

    if (event.target) {
      setYoutubeVideoTitle(event.target.videoTitle);
    }

    // 라이브 스트림이면 현재 위치로 이동
    player.seekTo(player.getDuration()); // YouTube 라이브의 경우 현재 위치로 이동
    player.playVideo();
  };

  useEffect(() => {
    console.log('youtubeVideoTitle', youtubeVideoTitle);
  }, [youtubeVideoTitle]);

  const handleEnd = (e: any) => {
    console.log('##### handleEnd');
    // e.target.stopVideo(0);
    // // e.target.stopVideo();
  }

  const handlePlay = (e: any) => {
    console.log('##### handlePlay');
    // e.target.playVideo();
  }

  const handleError = (e: any) => {
    console.log('##### handleError');
    console.log(e);
    // e.target.stopVideo();
  }

  return (
    <>
      <SEO title={data?.name} />

      <div className='px-12 pb-36 sm:pt-6' style={{maxWidth: '1180px', margin: "auto"}}>
      {!data?.live_info ? 
      <>
        <div className='mt-10 flex space-x-5 sm:mt-6 sm:block sm:space-x-0'>
          <div className='w-3/4 sm:w-full'>
            <div className='relative aspect-video w-full'>
              <iframe
                ref={ref}
                src={videoUrl}
                frameBorder='0'
                allow='autoplay'
                allowFullScreen
                title={videoTitle}
                className='absolute top-0 left-0 aspect-video w-full'
              ></iframe>
            </div>
            <div className='border-b-2 border-[rgba(229,229,229,0.08)] py-6 text-[1.75rem] font-bold sm:text-lg sm:font-medium'>
              {data?.name}
            </div>

            {currentVideo?.text?.length > 0 && (
              <div className='mt-8 flex w-full rounded-sm bg-[#1e2126] pt-10 pb-20 pl-12 pr-48 sm:p-4'>
                <div style={{width: '24px', height: '24px', marginRight: '24px'}}>💡</div>
                <div>
                <div className='break-all'>
                  {currentVideo?.text}
                </div>
                <div className='text-lg font-bold sm:text-base' style={{display: 'flex', alignItems: "center"}}>{name}
                  {
                    currentVideo?.file && <Link href={currentVideo?.file}>
                      <a target="_blank">
                        <span style={{
                          fontFamily: 'Noto Sans KR',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          fontSize: '12px',
                          lineHeight: '16px',
                          color: '#FFFFFF',
                          background: '#646975',
                          borderRadius: '2px',
                          padding: '8px 12px',
                          marginTop: '24px',
                          display: 'flex',
                          alignItems: "center",
                          justifyContent: "center",
                          width: "160px",
                        }}>
                          강의자료 다운로드
                            <Image
                                src={DownloadIcon}
                                alt='Instagram Icon'
                                placeholder='blur'
                                quality={100}
                            />
                        </span>
                      </a>
                    </Link>
                  }
                </div>
                </div>
              </div>
            )}
            {
              currentVideo?.text?.length <= 0 && currentVideo?.file && <Link href={currentVideo?.file}>
                <a target="_blank">
                  <span style={{
                    fontFamily: 'Noto Sans KR',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: '#FFFFFF',
                    background: '#646975',
                    borderRadius: '2px',
                    padding: '8px 12px',
                    marginTop: '24px',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                    width: "160px",
                  }}>
                    강의자료 다운로드
                      <Image
                          src={DownloadIcon}
                          alt='Instagram Icon'
                          placeholder='blur'
                          quality={100}
                      />
                  </span>
                </a>
              </Link>
            }
          </div>
          <div className='grow space-y-4 font-medium sm:mt-6'>
            {data?.index.map((i: any, chapterId: number) => (
              <div key={i.id}>
                <div
                  onClick={() =>
                    setChapterOpen((prev: any) =>
                      prev.map((j: any, index: number) =>
                        index === chapterId ? !j : j
                      )
                    )
                  }
                  className='flex h-[4.5rem] cursor-pointer items-center justify-between rounded bg-[#4a4e57] px-6 text-m sm:h-16 sm:px-4'
                >
                  <div className='sm:text-base'>{i.title}</div>

                  {chapterOpen && chapterOpen[chapterId] ? (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M5 15l7-7 7 7'
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-6 w-6'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  )}
                </div>

                <AnimatePresence>
                  {chapterOpen && chapterOpen[chapterId] && (
                    <motion.div
                      variants={chapterVar}
                      initial='invisible'
                      animate='visible'
                      exit='exit'
                      className='divide-y-2 divide-[rgba(229,229,229,0.08)]'
                    >
                      {i.video.map((j: any, index: any) => (
                        <div
                          key={j.order}
                          onClick={async () => {
                            await lecturesApi.finishLecture({ id, order, token });
                            router.push(`/lecture/my/${id}/${j.order}`);
                          }}
                        >
                          <a>
                            <div
                              key={j.order}
                              className={cls(
                                j.watched ? 'opacity-50' : '',
                                j.order === +order
                                  ? 'text-[#00e7ff]'
                                  : 'text-[rgba(255,255,255,0.8)]',
                                i.video.length === index + 1
                                  ? 'rounded-b-md'
                                  : '',
                                'flex h-[4.5rem] items-center bg-[#373c46] px-6 text-s transition-all hover:opacity-70 sm:h-16 sm:px-4 sm:text-sm'
                              )}
                            >
                              {j.title}
                            </div>
                          </a>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className='mt-14 flex flex-col items-center space-y-8 sm:mt-8'>
          <div className='text-sm font-medium text-[#cfcfcf]'>
            *진도율이 자동으로 체크됩니다.
          </div>
          <div style={{gap: '12px', width: '100%', margin: "auto", marginTop: '32px', justifyContent: 'center', alignItems: 'center'}} className={'flex h-16 sm:flex-col sm:h-32'}>
            <div
              onClick={finishLecture}
              className='flex w-60 h-16 cursor-pointer items-center justify-center rounded bg-[#00e7ff] text-l font-bold text-[#282e38] transition-opacity hover:opacity-90 sm:w-full'
            >
              다음강의 보기
            </div>
            <Link href={'/community/6/1/created/title'}>
            <div
              className='flex w-60 h-16 cursor-pointer items-center justify-center rounded bg-[#4a4e57] text-l font-bold transition-opacity hover:opacity-90 sm:w-full'
            >
              질문하기
            </div>
            </Link>
          </div>
        </div>
      </> : <>
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
                videoId={data?.live_vid}
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
            {data?.live_text?.length > 0 && (
              <div className='mt-8 w-full rounded-sm bg-[#1e2126] py-8 px-10 sm:hidden'>
                <div className='flex w-full rounded-sm'>
                  <div style={{width: '24px', height: '24px', marginRight: '24px'}}>💡</div>
                  <div className='w-full max-h-[150px] overflow-y-auto break-all' style={{whiteSpace: "break-spaces"}}>
                    {data?.live_text}
                  </div>
                </div>
                <div className='mt-4'>
                  <div className='flex space-x-4 font-medium md:text-sm items-center flex-row'>
                    {data?.live_external_link &&
                    <>
                      <Link href={data?.live_external_link.startsWith('http') ? data?.live_external_link : `https://${data?.live_external_link}`}>
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
            data?.live_ended == true ? 
            <div className="relative flex h-full w-full bg-[#0f0f0f]/[.5] md:bg-[#0f0f0f]">
              <span className="m-auto">라이브 채팅창이 종료되었습니다.</span>
            </div>
            :
            data?.live_ended == '라이브 대기중' ? 
            <div className="relative flex h-full w-full bg-[#0f0f0f]/[.5] md:bg-[#0f0f0f]">
              <span className="m-auto">라이브 채팅창이 준비 중입니다.</span>
            </div>
            :
            detailData && (
              detailData?.chat_room_number ?
              <Chat lectureId={[{lecture: detailData?.chat_room_number}]} />
              : 
              <Chat lectureId={data?.index} />
            )
          }
          </div>

          {data?.live_text?.length > 0 && (
          <div className='hidden mt-8 flex flex-col w-full rounded-sm bg-[#1e2126] p-4'>
            <div style={{width: '24px', height: '24px'}}>💡</div>
            <div className='w-full max-h-[150px] overflow-y-auto pl-1 break-all' style={{whiteSpace: "break-spaces"}}>
              {data?.live_text}
            </div>
          </div>
          )}
        </div>
      </>
      }
      </div>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      slug: ctx.params?.slug,
    },
  };
};

export default MyLectureDetail;
