import { useState } from 'react';
import { cls } from '@libs/client/utils';
import { grade, gradeImg } from '@components/grade';
import Linkify from 'react-linkify';

interface IProps {
   message: any;
   userClick: (n: string) => void;
}

export default function Bubble({ message, userClick }: IProps) {
   const [ellipsis, setEllipsis] = useState(true);
   return (
      <>
         <div className="flex items-start gap-2.5">
            <div className="flex flex-col w-full leading-1.5 p-2 border-gray-200 rounded-e-xl rounded-es-xl-700">
               <div className="flex items-center space-x-2">
                  <span className="text-sm font-normal text-gray-500">
                     {message?.time}
                  </span>
                  {message?.user ? 
                     <>
                     <span 
                        className={
                           cls(message?.is_staff ? "bg-[#00e7ff] rounded px-2" : "", "text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-200")}
                        onClick={() => userClick(message?.user)}>
                        {message?.user}
                     </span>
                     {
                        !message?.is_staff ? 
                        <div title={grade(message?.user_grade)} className='relative ml-1 aspect-square w-4'>{gradeImg(message?.user_grade)}</div>
                        : null
                     }
                     </>
                     :
                     <span className="text-sm font-semibold text-gray-900">
                        회원
                     </span>
                  }
               </div>
               <p className="text-sm font-normal text-gray-900 whitespace-pre-wrap break-words mt-1">
                  {message?.is_staff ? 
                     <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                        <a className="hover:text-[#00e7ff] font-bold underline" target="blank" href={decoratedHref} key={key}>
                        {decoratedText}
                        </a>
                     )}>
                        {message?.content}
                     </Linkify>
                     :
                     message?.content
                  }
               </p>
            </div>
         </div>
      </>
   );
};