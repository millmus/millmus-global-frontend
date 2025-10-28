import { cls, trimDate } from '@libs/client/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface IProps {
  id: number;
  order: number;
  thumbnail: string;
  name: string;
  created: string;
  expiration: string;
  progress: number;
  live_vid: string;
  live_info: string;
  live_ended: boolean;
  category: string;
  lecture_start_date?: string;
  lecture_expire_date?: string;
  live_external_link?: string;
  live_external_link_help?: string;
}

export default function Lecture({
  id,
  order,
  thumbnail,
  name,
  created,
  expiration,
  progress,
  live_vid,
  live_info,
  live_ended,
  category,
  lecture_start_date,
  lecture_expire_date,
  live_external_link,
  live_external_link_help,
}: IProps) {
  const router = useRouter();
  return (
    <>
      <div
        onClick={() =>
          category === 'ongoing'
            ? live_info && live_ended == true ? null : router.push(`/lecture/my/${id}/${order}`)
            : null
        }
        className={cls(
          category === 'ongoing' ? 'cursor-pointer' : 'opacity-70',
          'flex w-full items-center space-x-6 rounded bg-[#4a4e57] p-8 md:space-x-0 md:p-6'
        )}
      >
        <div className='relative h-40 w-72 rounded bg-gray-700 md:hidden'>
          <Image
            src={thumbnail}
            alt='Lecture Thumbnail'
            layout='fill'
            objectFit='cover'
          />
        </div>

        <div className='flex flex-col overflow-x-hidden justify-between' style={{ width: '100%' }}>
          <div className='text-lg font-bold md:text-base' style={{ display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
            <span style={{ flex: 1, whiteSpace: 'nowrap', overflowX: "hidden", textOverflow: "ellipsis" }}>
              {name}
            </span>
          </div>

          <div className='h-full space-y-1.5 mt-4'>
            <div className='flex space-x-4 font-medium md:text-sm' style={{ wordBreak: 'keep-all' }}>
              <div className='whitespace-nowrap text-[rgba(255,255,255,0.6)]'>강의 개강</div>
              {live_info ?
                <div>{live_info}</div>
                :
                lecture_start_date ?
                  <div>{trimDate(lecture_start_date, 0, 10)}</div>
                  :
                  <div>{trimDate(created, 0, 10)}</div>
              }
            </div>
            {!live_info && live_ended == true ? <>
              <div className='flex items-center font-medium md:text-sm'>
                <div className='text-[rgba(255,255,255,0.6)]'>진도율</div>
                <div className='ml-9 h-1 w-60 rounded-full bg-[rgba(0,231,255,0.24)] md:w-40'>
                  <div
                    className='h-full rounded-full bg-[#00e7ff]'
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className='ml-2 font-bold text-[rgba(255,255,255,0.6)]'>
                  {progress}%
                </div>
              </div>

              <div className='flex space-x-4 font-medium md:text-sm'>
                <div className='text-[rgba(255,255,255,0.6)]'>시청 기한</div>
                <div>
                  {lecture_expire_date ? lecture_expire_date : expiration}
                </div>
              </div>
            </> : null
            }
            <div className='flex space-x-4 font-medium md:text-sm'>
              <div className='text-[rgba(255,255,255,0.6)]'>강의 현황</div>
              {live_info ?
                <div className='text-[#00e7ff]'>{live_ended == true ? "라이브 종료" : live_ended}</div>
                :
                <div>{category === 'ongoing' ? '수강중' : '수강완료'}</div>
              }
            </div>
            {live_info && live_ended !== true && (
              <div className='flex space-x-4 font-medium md:text-sm items-center flex-row md:flex-col md:items-start md:space-y-2 md:space-x-0'>
              {live_info && live_external_link &&
              <>
                <Link href={live_external_link.startsWith('http') ? live_external_link : `https://${live_external_link}`}>
                  <a target='_blank'>
                    <div className='flex px-4 py-2 items-center justify-center rounded bg-[#ffeb00] font-medium text-[#282e38] transition-all hover:opacity-90'>
                      <span>단톡방 바로 입장</span>
                    </div>
                  </a>
                </Link>
                {live_external_link_help && <div className=''>
                  <span>입장코드</span>
                  <span className="bg-[#ffeb00] font-medium mx-2 px-1 rounded-sm text-[#282e38]">{live_external_link_help}</span>
                </div>}
              </>
              }
            </div>)}
          </div>
        </div>
      </div>
    </>
  );
}
