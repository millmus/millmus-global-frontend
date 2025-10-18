import { useState, useRef, useEffect } from 'react';
import Layout from '@layouts/sectionLayout';
import Image from 'next/image';
import { Dialog } from '@headlessui/react';
import { gradeImg } from '@components/grade';
import { trimDate } from '@libs/client/utils';
import { cls } from '@libs/client/utils';

interface IProps {
  review: any[];
  state: (name: string) => void;
  isDefaultOrder: boolean;
  setIsDefaultOrder: (b: boolean) => void;
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  currentIndex: any[];
  setIndex: (b: any[]) => void;
}

export default function ReviewModal({ review, state, isDefaultOrder, setIsDefaultOrder, isOpen, setIsOpen, currentIndex, setIndex }: IProps) {
  const [innerImage, setInnerImage] = useState(null);
  const touchX = useRef(0);

  let currentReview = review?.filter(d=>d.id==currentIndex[0].id)[0];

  useEffect(() => {
    setInnerImage(null);
  }, [isOpen]);
  
  function moveIndex(number: number) {
    setInnerImage(null);
    const img_review = isDefaultOrder ? review : review.slice(0).sort((d1: any, d2: any) => d2.is_best - d1.is_best);

    let tempIndex = currentIndex[0].index,
      nextIndex = tempIndex + number;
    if (nextIndex < 0) nextIndex = img_review.length-1;
    else if (nextIndex > img_review.length-1) nextIndex = 0;

    while (!img_review[nextIndex].image1) {
      nextIndex += number;
      if (nextIndex < 0) nextIndex = img_review.length-1;
      else if (nextIndex > img_review.length-1) nextIndex = 0;
    }
    setIndex([{id: img_review[nextIndex].id, index: nextIndex}]);
    currentReview = img_review[nextIndex];
  }

  return (
    <Layout>

      {/* Review preview */}
      {review?.length ?
        <div className="rounded-lg mt-12 p-4 bg-[#186573]">
          <div className="flex justify-between font-bold text-lg">
            <span>베스트 리뷰</span>
            <span className="cursor-pointer" onClick={()=>state("수강후기")}>더보기</span>
          </div>
          <div className="rounded-lg mt-3 py-4 px-6 h-[260px] bg-white text-black grid grid-cols-2 grid-rows-2 gap-3 gap-x-6 md:grid-cols-1 md:grid-rows-2 md:px-3">
          {review?.slice(0).sort((d1: any, d2: any) => d2.is_best - d1.is_best).map((i, ind)=> (
            <div key={i.id} 
              className={cls(
                ind >= 4 ? 'hidden': ind >= 2 ? 'md:hidden' : '',
                "flex gap-3 md:gap-1"
              )}
              onClick={() => {
                if (!i.image1) return;
                setIndex([{id: i.id, index: ind}]);
                setIsDefaultOrder(false);
                setIsOpen(true);
              }}
              >
              <div className="flex flex-1 flex-col gap-1 md:gap-0">
                <div>
                  <div className="w-[130px] inline-flex font-bold text-lg mr-1 md:w-[90px]">
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{i.user.nickname??"익명"}</span>
                    <span className='relative inline-block my-1 aspect-square h-5 w-5'>
                      {gradeImg(i.user.grade)}
                    </span> 
                  </div>
                  <span className="md:text-sm">{trimDate(i.created, 0, 10)}</span>
                </div>
                <div className="ellipsis-clamp-3 text-sm" style={{lineHeight: i.image1 ? "1.15rem" : "1.25rem"}}>{i.text}</div>
              </div>
              {i.image1 && (
              <div className="w-[100px] relative">
                  <Image
                    src={i.image1}
                    alt='Review Thumbnail'
                    layout='fill'
                    objectFit='cover'
                    objectPosition='top'
                  />
              </div>
              )}
            </div>
          ))}
          </div>
        </div>
        :
        <></>
      }
      {/* Review preview */}

      {isOpen?
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-[9999]"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true"/>

        <div className="fixed inset-0 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="flex relative w-[900px] h-[540px] mx-auto rounded-xl bg-white text-black md:h-fit md:max-w-[500px]"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={e => touchX.current = e.nativeEvent.changedTouches[0].pageX}
            onTouchEnd={e => {
              const gap = touchX.current - e.nativeEvent.changedTouches[0].pageX;
              if (gap > 50) moveIndex(1)
              else if (gap < -50) moveIndex(-1)
            }}>

            <div className="flex flex-col w-3/5 p-4 md:p-2">
              <div className="font-bold text-lg mb-2">포토리뷰</div>
              <div className="h-full relative md:min-h-[200px]">
                <Image
                  src={innerImage??currentReview.image1}
                  alt='Review Thumbnail'
                  layout='fill'
                  objectFit='contain'
                />
              </div>
            </div>

            <div className="w-2/5 p-4 md:p-2 md:pl-0">
              <div className="flex flex-1 flex-col gap-1 h-full justify-between">

                <div className="flex flex-col overflow-hidden">
                  <div>
                  <div className="w-[130px] inline-flex font-bold text-lg mr-1">
                    <span className="mb-2 overflow-hidden text-ellipsis whitespace-nowrap">{currentReview.user.nickname??"익명"}</span>
                    <span className='relative inline-block my-1 aspect-square h-5 w-5'>
                      {gradeImg(currentReview.user.grade)}
                    </span> 
                  </div>
                  <span>{trimDate(currentReview.created, 0, 10)}</span>
                  </div>
                  <div className="h-full break-words overflow-y-auto md:max-h-[130px]">{currentReview.text}</div>
                </div>

                <div className="flex gap-x-1">
                  {[1,2,3].map( d => {
                    const key = `image${d}`;
                    return (currentReview[key]?
                      <div key={`${currentReview.id}_${d}`} 
                        className="w-[80px] h-[80px] relative border border-black cursor-pointer md:w-[40px] md:h-[40px]"
                        onClick={()=>{
                          setInnerImage(currentReview[key]);
                        }}
                        >
                        {currentReview[key] && <Image
                          src={currentReview[key]}
                          alt='Review Thumbnail'
                          layout='fill'
                          objectFit='cover'
                          objectPosition='top'
                        />}
                      </div>:null
                    )})
                  }
                </div>
              </div>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="grey" 
              className="w-6 h-6 absolute top-[10px] right-[10px] cursor-pointer"
              onClick={() => setIsOpen(false)}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            
            <div className="absolute flex h-[200px] m-auto inset-y-0 inset-x-[-100px] justify-between z-[-1] md:hidden">
              <svg className="w-[100px] h-[200px]" onClick={()=>moveIndex(-1)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <svg className="w-[100px] h-[200px]" onClick={()=>moveIndex(1)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </div>
        </div>
      </Dialog>
      :<></>
    }

    </Layout>
  );
}