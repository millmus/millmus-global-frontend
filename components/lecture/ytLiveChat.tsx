import { useState, useEffect } from 'react';
import Link from 'next/link';

interface IProps {
  vid: string;
}

export default function LiveChat({ vid }: IProps) {
  const [key, updateKey] = useState(0);
  const [tried, updateTried] = useState(false);

  const onFocus = () => {
    updateKey(Date.now());
  };

  useEffect(() => {
    window.addEventListener("visibilitychange", onFocus);
    return () => {
        window.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  function chatPopUp(e: any){
    window.open(`https://www.youtube.com/live_chat?v=${vid}&dark_theme=1`,'Millmus','width=600,height=400');
    return false;
  }

  return (
    <>
      {!tried ? 
      <Link
        href={`https://accounts.google.com/ServiceLogin?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Dko%26next%3D%252Fwatch%253Fv%253D${vid}&hl=ko`}>
        <a target="_blank"
          className="flex justify-center gap-1 p-1.5 bg-[#f30000] border-b-[1px] border-[#373c46] hover:bg-[#f30000]/[0.9]">
          유튜브에서 실시간 채팅참여
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 my-auto">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </Link> :
      <a href="#" 
        rel="noopener noreferrer"
        className="flex justify-center gap-1 p-1.5 bg-[#0f0f0f] border-b-[1px] border-[#373c46] hover:text-[#00e7ff]"
        onClick={chatPopUp}>
        팝업으로 참여하기
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 my-auto">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>
      }
      {vid ?
      <embed
        key={key}
        src={`https://www.youtube.com/live_chat?v=${vid}&embed_domain=${"millmus.com"}&dark_theme=1`}
        className='h-full w-full bg-[#0f0f0f]'
      ></embed> :
      <div className="relative h-full w-full bg-[#0f0f0f]/[.5]">
        <span className="absolute inset-0 h-0 w-full text-center m-auto">라이브 채팅창이 준비 중입니다.</span>
      </div>
      }
    </>
  );
}