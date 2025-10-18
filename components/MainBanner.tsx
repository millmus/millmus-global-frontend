import { ICard } from '../types';
import BannerSlider from './BannerSlider';

interface Props {
    itemList: ICard[];
}
const MainBanner = ({ itemList }: Props) => {
    return (
        <div>
            {itemList.length > 0 && <BannerSlider itemList={itemList} />}
        </div>
    )
}

export default MainBanner;