import { useState } from 'react';
import { cls } from '@libs/client/utils';
import Linkify from 'react-linkify';

interface IProps {
   announce: string;
}

export default function Bubble({ announce }: IProps) {
   const [ellipsis, setEllipsis] = useState(true);
   return (
      <>
      {announce.length ? 
         <div className="bg-[#00e7ff] mb-1">
            <div className="flex items-start">
               <div className="flex flex-col w-full overflow-y-hidden leading-1.5 p-2 border-gray-200 rounded-e-xl rounded-es-xl-700">
                  <div className="ellipsis-clamp-2 hover:!block">
                     <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                        <a className="font-bold hover:underline" target="blank" href={decoratedHref} key={key}>
                        {decoratedText}
                        </a>
                     )}>
                        {announce}
                     </Linkify>
                  </div>
               </div>
            </div>
         </div>
         :
         null
      }
      </>
   );
};