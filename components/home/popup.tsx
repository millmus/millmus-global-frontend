import { motion } from 'framer-motion';
// import Image from 'next/image';
import Link from 'next/link';
import PopupBg from '@public/home/popup.png';
import {useEffect, useState} from "react";
import {popupApi} from "@libs/api";

interface IProps {
  closePopup: () => void;
}

export default function Popup() {
  const popupVar = {
    invisible: {
      opacity: 0,
      scale: 0,
      translateX: '0',
      translateY: '0',
    },
    visible: {
      opacity: 1,
      scale: 1,
      translateX: '0',
      translateY: '0',
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0,
      translateX: '0',
      translateY: '0',
      transition: {
        duration: 0.3,
      },
    },
  };

  const [popupList, setPopupList] = useState([])
  const [popup, setPopup] = useState<{
    [key: number]: boolean
  }>({});

  let popupStyle = {
  }

  const closePopup = (id: never) => {
    const _popup: any = {...popup}
    _popup[id] = false
    setPopup(_popup);
    sessionStorage.setItem(`popup-${id}`, 'false');
  };

  useEffect(() => {
    let popupState = {}
    popupList.map((e: any, i) => {
      const popupSession = sessionStorage.getItem(`popup-${e.id}`);
      console.log(popupSession === 'false', 'check')
      if (popupSession === 'false') {
        console.log(e.id)
        popupState = {
          ...popupState,
          [e.id]: false
        }
      } else {
        popupState = {
          ...popupState,
          [e.id]: true
        }
      }
    })
    console.log(popupState, 'popupState')
    setPopup(popupState);
  }, [popupList]);

  useEffect(() => {
    popupApi.getPopup().then(r => {
      setPopupList(r.sort((a: any, b: any) => {
        return a.level - b.level
      }));
    })
  }, []);

  useEffect(() => {
    console.log(popup, 'popup')
  }, [popup])

  if (popupList?.length && popupList.filter((e: {id: number}) => popup[e.id]).length) {
    return (
      <div className="fixed flex" style={{
        zIndex: 9999,
        paddingTop: '40px',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center'
      }}>
        <div style={{width: 'calc(100% - 35rem)', display: "flex"}}>
          {
            popupList?.map(({image, redirect_url, id, level, x, y, width, height}, index) => {
                if (popup[id] == false) return false
                const popupStyle = Number(width) + 80 > window.innerWidth ? {
                  width: `${window.innerWidth - 80}px`,
                  // left: `${(Number(window.innerWidth) / 2)}px`,
                  height: `${(window.innerWidth - 80) * height / width}px`
                } : {
                  width: `${width}px`,
                  // left: `${(window.innerWidth - Number(width))/2 + (Number(width) / 2)}px`,
                  height: `${height}px`
                }


                return image && <motion.div
                    onClick={(e) => {
                      e.stopPropagation();
                      return;
                    }}
                    variants={popupVar}
                    initial='invisible'
                    animate='visible'
                    exit='exit'
                    className='flex-1 rounded pt-6 pb-12'
                    style={{zIndex: 9999 - index}}
                >
                    <div className="" style={{
                      position: 'absolute',
                      display: "flex",
                      justifyContent: "center",
                      width: '100%',
                    }}>
                        <div
                            className="h-[35rem] w-[35rem] min-h-[35rem] min-w-[35rem] md:h-[330px] md:w-[330px] md:min-h-[330px] md:min-w-[330px]">
                            <div className='relative top-2 right-2 flex justify-end md:top-1 md:right-1 z-10 h-0'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='w-10 h-10 cursor-pointer text-white md:w-8 md:h-8'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                    strokeWidth={2}
                                    onClick={() => closePopup(id)}
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M6 18L18 6M6 6l12 12'
                                    />
                                </svg>
                            </div>

                            <Link href={redirect_url}>
                                <a>
                                    <img
                                        src={image}
                                        alt='Popup Background'
                                      // placeholder='blur'
                                        className='rounded'
                                    />
                                </a>
                            </Link>
                        </div>
                    </div>
                </motion.div>
              }
            )
          }
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
