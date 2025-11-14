import { scaleValue } from '../utils/responsive';
import useResponsiveScale from '../hooks/useResponsiveScale';
import { ICard } from '../types';
import CardSlider from './CardSlider';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface Props {
    itemList: ICard[];
}
const FreeLiveList = ({itemList}: Props) => {
    const { t } = useTranslation('home');
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
                        <Link href='/lecture/coin/1'><a>
                    <div className={`flex items-center gap-[10px]`}>
                        <div>
                            <h2
                                className={`sm:text-[16px] text-[30px]`}
                                style={{
                                    letterSpacing: `-0.05em`,
                                    fontWeight: 700,
                                }}
                            >{t('freeLiveSectionTitle')}</h2>
                        </div>
                        <div className={`sm:hidden bg-[#737373] rounded-[5px] pt-[3px] pb-[0px] px-[16px]`}>
                            <span className='text-[#000000] font-bold'>{t('viewMoreButton')}</span>
                        </div>
                    </div>
                        </a></Link>
                    <div>
                        <span
                            className='sm:text-[12px] text-[20px] text-[#9e9e9e]'
                            style={{
                                letterSpacing: `-0.05em`,
                            }}
                        >{t('freeLiveSectionSubtitle')}</span>
                    </div>
                </div>
                <div>
                    {itemList.length > 0 && <CardSlider itemList={itemList} />}
                </div>
            </div>
        </div>
    )
}

export default FreeLiveList