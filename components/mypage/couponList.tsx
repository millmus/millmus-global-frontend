import Pagebar from '@components/pagebar';
import { useRouter } from 'next/router';
import Coupon from './coupon';
import { useTranslation } from 'next-i18next';

interface IProps {
  data: any[];
  totalItems: number;
}

export default function CouponList({ data, totalItems }: IProps) {
  const { t } = useTranslation('mypage');
  const router = useRouter();
  const currentPage = router.query.page as string;

  return (
    <div>
      <div className='space-y-0.5'>
        <div className='flex h-[3.75rem] items-center rounded-sm bg-[#4a4e57] md:hidden'>
          <div className='flex w-[10%] justify-center'>{t('table.number')}</div>
          <div className='flex w-[50%] justify-center'>{t('table.couponName')}</div>
          <div className='flex w-[20%] justify-center'>{t('table.discountAmount')}</div>
          <div className='flex grow justify-center'>{t('table.applicableProducts')}</div>
        </div>

        {data?.map((i, index) => (
          <Coupon
            key={index}
            num={(+currentPage - 1) * 12 + index + 1}
            name={i.name}
            noticeText={i.reusable ? t('table.offlineAttendance') : i.limit_to_tutor ? t('table.masterSeries') : t('table.allLectures')}
            discount={i.price}
          />
        ))}
      </div>

      <div className='mt-24 flex justify-center'>
        <Pagebar
          totalItems={totalItems}
          itemsPerPage={5}
          currentPage={+currentPage}
          url={(page: number) => router.push(`/mypage/coupon/${page}`)}
        />
      </div>
    </div>
  );
}
