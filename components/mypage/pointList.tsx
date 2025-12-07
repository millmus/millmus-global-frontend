import Pagebar from '@components/pagebar';
import { useRouter } from 'next/router';
import Point from './point';
import { useTranslation } from 'next-i18next';

interface IProps {
  data: any[];
  totalItems: number;
}

export default function PointList({ data, totalItems }: IProps) {
  const { t } = useTranslation('mypage');
  const router = useRouter();
  const currentPage = router.query.page as string;
  return (
    <div>
      <div className='space-y-0.5'>
        <div className='flex h-[3.75rem] items-center rounded-sm bg-[#4a4e57] md:h-12 md:text-sm'>
          <div className='flex grow justify-center'>{t('table.usage')}</div>
          <div className='flex w-[28%] justify-center'>{t('table.pointsUsed')}</div>
          <div className='flex w-[28%] justify-center'>{t('table.dateUsed')}</div>
        </div>

        {data?.map((i) => (
          <Point
            key={i.id}
            lecture={t('table.allLectures')}
            point={i.point}
            date={i.created}
          />
        ))}
      </div>

      <div className='mt-24 flex justify-center'>
        <Pagebar
          totalItems={totalItems}
          itemsPerPage={5}
          currentPage={+currentPage}
          url={(page: number) => router.push(`/mypage/point/${page}`)}
        />
      </div>
    </div>
  );
}
