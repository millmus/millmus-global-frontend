import Image from 'next/image';
import Link from 'next/link';

interface IProps {
  id: number;
  thumbnail: string;
}

export default function Event({ id, thumbnail }: IProps) {
  return (
    <Link href={`/event/detail/${id}`}>
      <a>
        <div className='relative h-64 w-full rounded-sm md:h-[90px]'>
          <Image
            src={thumbnail}
            alt='Event Thumbnail'
            layout='fill'
            objectFit='contain'
            className='rounded-sm md:h-20'
          />
        </div>
      </a>
    </Link>
  );
}
