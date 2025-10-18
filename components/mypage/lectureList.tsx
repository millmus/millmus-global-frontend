import Lecture from '@components/mypage/lecture';
import Pagebar from '@components/pagebar';
import { useRouter } from 'next/router';

interface IProps {
  data: any[];
  totalItems: number;
}

export default function LectureList({ data, totalItems }: IProps) {
  const router = useRouter();
  const [category, currentPage] = router.query.slug as string[];
  return (
    <div>
      <div className='space-y-2'>
        {data?.map((i) => (
          <Lecture
            key={i.id}
            id={i.id}
            order={i.next_lecture}
            thumbnail={i.lecture_thumbnail}
            name={i.lecture_name}
            created={i.created}
            expiration={i.expiration}
            progress={i.total_progress}
            live_vid={i.live_vid}
            live_info={i.live_info}
            live_ended={i.live_ended}
            category={category}
            lecture_start_date={i.lecture_start_date}
            lecture_expire_date={i.lecture_expire_date}
            live_external_link={i.live_external_link}
            live_external_link_help={i.live_external_link_help}
          />
        ))}
      </div>

      <div className='mt-20 flex justify-center'>
        <Pagebar
          totalItems={totalItems}
          itemsPerPage={5}
          currentPage={+currentPage}
          url={(page: number) =>
            router.push(`/mypage/lecture/${category}/${page}`)
          }
        />
      </div>
    </div>
  );
}
