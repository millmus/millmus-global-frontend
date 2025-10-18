import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { cls } from '@libs/client/utils';


interface IProps {
    count: number;
}

const Message = ({count}: IProps) => {
    const router = useRouter();
    const [open, setShow] = useState(false)
    const [notiChanged, setNotiChanged] = useState(false);

    const timeReset = () => {
        const timeId = setTimeout(() => {
            setNotiChanged(false);
        }, 3000)

        return () => {
            clearTimeout(timeId)
        }
    }
    useEffect(() => {
        timeReset();
    });

    useEffect(() => {
        if (localStorage) {
            const old = localStorage.getItem(`notiCount`)??'0';
                setNotiChanged(parseInt(old) < count);
            localStorage.setItem(`notiCount`, String(count));
        }
    }, [count]);


  const clickHandler = () => {
    router.push('/mypage/notification/1');
    setNotiChanged(false);
}
return (
    <>
    <div role="alert"
        className={
            cls(notiChanged ? "opacity-90" : "hidden", 
            "fixed top-5 right-5 w-[300px] p-4 flex z-10 text-gray-900 bg-white items-center border border-black/[.4] rounded-lg shadow-xl transition opacity-0 duration-500 hover:opacity-100"
        )}>
        <div className="flex items-center cursor-pointer"
            onClick={clickHandler}>
            <span className="font-bold text-gray-900">새로운 알림이 있습니다.</span>
        </div>
        <button type="button" 
            onClick={() => setNotiChanged(false)}
            className="ml-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8" aria-label="Close">
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
    </div>
    </>
    )
}

export default Message;