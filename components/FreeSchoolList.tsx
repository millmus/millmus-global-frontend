import { scaleValue } from '../utils/responsive';
import useResponsiveScale from '../hooks/useResponsiveScale';
import { ICard } from '../types';
import CardSlider from './CardSlider';
import Link from 'next/link';

interface Props {
    itemList: ICard[];
}
const FreeSchoolList = ({itemList}: Props) => {
    const scale = useResponsiveScale();

    return (
        <div
            className='sm:!p-0'
            style={{
                paddingLeft: `${scaleValue(30, scale)}px`,
                paddingRight: `${scaleValue(30, scale)}px`,
            }}
        >
            <div className='flex flex-col gap-[20px]'>
                <div className='px-[60px] xl:px-[5px]'>
                        <Link href='/lecture/online-business/1'><a>
                    <div className={`flex items-center gap-[10px]`}>
                        <div>
                            <h2
                                className={`sm:text-[16px] text-[30px]`}
                                style={{
                                    letterSpacing: `-0.05em`,
                                    fontWeight: 700,
                                }}
                            >컴맹도 OK, 왕초보 프리스쿨</h2>
                        </div>
                        <div className={`sm:hidden bg-[#737373] rounded-[5px] pt-[3px] pb-[0px] px-[16px]`}>
                            <span className='text-[#000000] font-bold'>더보기 {`>`}</span>
                        </div>
                    </div>
                        </a></Link>
                    <div>
                        <span
                            className='sm:text-[12px] text-[20px] text-[#9e9e9e]'
                            style={{
                                letterSpacing: `-0.05em`,
                            }}
                        >엑셀부터 미리캔버스까지 한번에</span>
                    </div>
                </div>
                <div>
                    {itemList.length > 0 && <CardSlider itemList={itemList} showArrowInside={false} />}
                </div>
            </div>
        </div>
    );
}

export default FreeSchoolList;