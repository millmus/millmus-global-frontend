import { scaleValue } from '../utils/responsive';
import useResponsiveScale from '../hooks/useResponsiveScale';
import { ICard } from '../types';
import MultipleRowsCardSlider from './MultipleRowsCardSlider';
import { useTranslation } from 'next-i18next';

interface Props {
    itemList: ICard[];
}
const SalesVerificationRelayList = ({itemList}: Props) => {
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
                    <div className={`flex items-center gap-[10px]`}>
                        <div>
                            <h2
                                className={`sm:text-[16px] text-[30px]`}
                                style={{
                                    letterSpacing: `-0.05em`,
                                    fontWeight: 700,
                                }}
                            >{t('salesVerificationSectionTitle')}</h2>
                        </div>
                    </div>
                    <div>
                        <span
                            className='sm:text-[12px] text-[20px] text-[#9e9e9e]'
                            style={{
                                letterSpacing: `-0.05em`,
                            }}
                        >{t('salesVerificationSectionSubtitle')}</span>
                    </div>
                </div>
                <div className='mt-[-10px]'>
                    {itemList.length > 0 && <MultipleRowsCardSlider itemList={itemList} showArrowInside={false} />}
                </div>
            </div>
        </div>
    )
}

export default SalesVerificationRelayList