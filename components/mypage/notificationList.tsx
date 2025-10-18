import Pagebar from '@components/pagebar';
import { useRouter } from 'next/router';
import Notification from './notification';
import { usersApi } from '@libs/api';
import { cls } from '@libs/client/utils';
import { useState } from 'react';

interface IProps {
  data: any[];
  mutate: any;
  token: any;
  in_header: boolean;
  totalItems: number;
}

export default function CouponList({ data, mutate, token, in_header, totalItems }: IProps) {
  const router = useRouter();
  const currentPage = router.query.page as string;
  const [clickedId, setClickedId] = useState(0);

  function readHandler(id: number) {
    if (id > 0) usersApi.readNotification(id, token as string);
    else usersApi.readAllNotification(token as string);
    mutate(data);
  }
  function deleteHandler(id: number) {
    if (id > 0) usersApi.deleteNotification(id, token as string);
    else usersApi.deleteAllNotification(token as string);
    mutate(data);
  }
  return (
    <div className={cls(!in_header ? 'space-y-6' : 'space-y-4', 'flex flex-col text-lg font-medium md:text-base')}>
      {!in_header ? 
        <div className='flex justify-between font-bold'>
          <div className='flex gap-x-2 text-2xl md:text-lg'>
            알림함
            {data && <span className="text-base self-end text-[#00E7FF]">{data?.length}</span>}
          </div>
          {
            data?.length > 0 ? 
            <button className="font-bold text-[#00E7FF]" onClick={() => readHandler(0)}>
              전체읽음
            </button>
            : null
          }
        </div>
        :
        <div className='flex justify-between font-bold'>
          <div className='flex gap-x-2 text-xl'>
            알림
          </div>
          {
            data?.length > 0 ? 
            <div className='flex gap-x-4'>
              <button className="font-bold text-base text-[#00E7FF]" onClick={() => readHandler(0)}>
                전체읽음
              </button>
            </div>
            : null
          }
        </div>
      }

      <div className={cls(!in_header ? 'space-y-6' : 'space-y-4', '')}>
        {
          data && data?.length ? 
            data?.map((d, index) => (
              <div key={index}>
                <Notification 
                  data={d} 
                  deleteHandler={deleteHandler} 
                  readHandler={readHandler} 
                  setClickedId={setClickedId} 
                  in_header={in_header} 
                  clickedId={clickedId}/>
              </div>
            ))
            :
            <>
              <div>
                <b>새로운 알림이 없습니다.</b><br/>
                밀머스 서비스와 강의 알림을
                이곳에서 확인할 수 있어요.
              </div>
            </>
        }
      </div>

      {!in_header &&
        <div className='mt-24 flex justify-center'>
          <Pagebar
            totalItems={totalItems}
            itemsPerPage={5}
            currentPage={+currentPage}
            url={(page: number) => router.push(`/mypage/notification/${page}`)}
          />
        </div>
      }
    </div>
  );
}
