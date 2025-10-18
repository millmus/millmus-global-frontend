import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Transition } from '@headlessui/react'
import { usersApi } from '@libs/api';
import { useUser } from '@libs/client/useUser';
import { cls } from '@libs/client/utils';

interface IProps {
  data: any;
  deleteHandler: (id: number) => any;
  readHandler: (id: number) => any;
  setClickedId: (id: number) => any;
  in_header: boolean;
  clickedId: number;
}

export default function Coupon({ 
  data,
  deleteHandler,
  readHandler,
  setClickedId,
  in_header,
  clickedId
}: IProps) {
  const router = useRouter();
  const { token } = useUser({
    isPrivate: true,
  });
  const [openContent, setOpenContent] = useState(clickedId == data?.id ? true : false);
  const [openContext, setOpenContext] = useState(false);

  useEffect(() => {
    if (clickedId != data?.id) {
      setOpenContent(false);
      setOpenContext(false);
    }
  }, [clickedId])

  async function clickHandler() {
    if (!openContent && !data?.is_read) {
      readHandler(data?.id);
    } else if (openContent && data?.is_read) {
      router.push('/mypage/notification/1');
    }
    setOpenContent(!openContent);
    setOpenContext(false);
  }
  return (
    <>
      <div 
        onClick={()=>setClickedId(data?.id)}
        className={cls(!in_header ? "py-4" : data?.is_read ? "py-2 shadow-lg" : "py-2 shadow-lg !bg-[#00E7FF]", 
          "flex flex-col relative gap-y-4 px-6 text-black bg-white rounded-xl border md:gap-y-2"
        )}>
        {/* Head */}
        <div className="flex w-full">
          <div className="flex-1 cursor-pointer" onClick={(clickHandler)}>
            <div className={cls(!in_header ? "text-2xl" : "text-xl" , "font-bold md:text-xl")}>{data?.category}</div>
            <div className={cls(!in_header ? "text-xl mt-2" : "text-lg" , " md:text-lg")}>{data?.title}</div>
            <div className={cls(!in_header ? "text-sm" : "text-sm" , "text-[#5B5B5B] md:text-sm")}>{data?.sub_title}</div>
          </div>
          {!in_header &&
          <Link href={data?.url ? data?.url : "#"}>
            <a className="flex self-center text-center w-[100px] h-[40px] rounded mx-2 text-xl font-bold bg-[#00E7FF]">
              <span className="m-auto">바로가기</span>
            </a>
          </Link>
          }
          {!in_header ?
            <button onClick={() => deleteHandler(data?.id)} className="absolute top-2 right-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.49914 8.71784L13.7803 15L15 13.7822L8.71712 7.5L15 1.21957L13.782 0L7.49914 6.28216L1.21799 0L0 1.21957L6.28115 7.5L0 13.7804L1.21799 15L7.49914 8.71784Z" fill="black"/>
              </svg>
            </button>
            :
            <div onClick={() => setOpenContext(!openContext)} className="absolute top-2 right-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className='m-1' width="4" height="15" viewBox="0 0 2 11" fill="none">
                <path d="M2 0.916667C2 1.15978 1.89464 1.39294 1.70711 1.56485C1.51957 1.73676 1.26522 1.83333 1 1.83333C0.734783 1.83333 0.48043 1.73676 0.292894 1.56485C0.105357 1.39294 0 1.15978 0 0.916667C0 0.673552 0.105357 0.440394 0.292894 0.268486C0.48043 0.0965772 0.734783 0 1 0C1.26522 0 1.51957 0.0965772 1.70711 0.268486C1.89464 0.440394 2 0.673552 2 0.916667ZM2 5.5C2 5.74312 1.89464 5.97627 1.70711 6.14818C1.51957 6.32009 1.26522 6.41667 1 6.41667C0.734783 6.41667 0.48043 6.32009 0.292894 6.14818C0.105357 5.97627 0 5.74312 0 5.5C0 5.25689 0.105357 5.02373 0.292894 4.85182C0.48043 4.67991 0.734783 4.58333 1 4.58333C1.26522 4.58333 1.51957 4.67991 1.70711 4.85182C1.89464 5.02373 2 5.25689 2 5.5ZM2 10.0833C2 10.3264 1.89464 10.5596 1.70711 10.7315C1.51957 10.9034 1.26522 11 1 11C0.734783 11 0.48043 10.9034 0.292894 10.7315C0.105357 10.5596 0 10.3264 0 10.0833C0 9.84022 0.105357 9.60706 0.292894 9.43515C0.48043 9.26324 0.734783 9.16667 1 9.16667C1.26522 9.16667 1.51957 9.26324 1.70711 9.43515C1.89464 9.60706 2 9.84022 2 10.0833Z" fill="black"/>
              </svg>
              {openContext && 
                <button onClick={() => deleteHandler(data?.id)} className="absolute w-[100px] right-0 top-0 border border-black/[.4] bg-[#00E7FF] rounded-lg font-bold bg-white shadow-md">
                삭제하기
                </button>
              }
            </div>
          }
        </div>
        {/* Body */}
        <Transition show={openContent} style={{whiteSpace: "break-spaces"}} className={cls(!in_header ? "md:max-h-[100px]" : "max-h-[100px]", "w-full text-base overflow-y-auto")}>{data?.content}</Transition>
      </div>
    </>
  );
}
