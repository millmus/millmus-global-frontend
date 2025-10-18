import Layout from '@layouts/sectionLayout';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface IProps {
  data: any[];
}

export default function Preview({ data }: IProps) {
  const router = useRouter();
  const [imgHeight, setImgHeight] = useState([{ id: 0, height: 0 }]);

  useEffect(() => {
    setImgHeight(
      [...Array(data?.length)].map((i, index) => ({ id: index, height: 0 }))
    );
  }, [data]);
  return (
    <Layout padding='pb-80'>
      {
        data.map(i => (
          i.url && <div key={i.id}>
            <div className='relative aspect-video w-full'>
              <iframe
                src={i.url}
                frameBorder='0'
                allow='autoplay; fullscreen; picture-in-picture'
                allowFullScreen
                title={i.title}
                className='absolute top-0 left-0 aspect-video w-full'
              ></iframe>
              <span></span>
            </div>
            <p style={{maxWidth: '968px', margin: "auto", marginBottom: '40px'}} className='py-2 text-[1.75rem] font-bold md:text-lg md:font-medium'>
              {i.title}
            </p>
          </div>
        ))
      }

    </Layout>
  );
}
