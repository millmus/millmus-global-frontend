import Layout from '@layouts/sectionLayout';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface IProps {
  is_offline: boolean;
  is_masterseries: boolean;
  is_free: boolean;
  data: any[];
  sold_out: boolean;
  refund_policy: any;
}

export default function Info({ is_offline, is_masterseries, is_free, data, sold_out, refund_policy }: IProps) {
  const router = useRouter();
  const [imgHeight, setImgHeight] = useState([{ id: 0, height: 0 }]);
  
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const not_for_sales_ids = [24,32,36,41,42, 38,40, 43,44, 48, 50];
  useEffect(() => {
    setImgHeight(
      [...Array(data?.length)].map((i, index) => ({ id: index, height: 0 }))
    );
  }, [data?.length]);
  return (
    <Layout padding='pb-80'>
      {data?.map((i, index) => (
        <div
          key={i.id}
          onClick={
            i.order === data.length
              ? 
              is_masterseries ? 
              () => goToTop() :
              () => { 
                if (sold_out) return null;
                return router.push(`/purchase/lecture/${i.lecture}`);
              }
              : () => null
          }
          className='relative w-full'
          style={{ height: imgHeight[index]?.height, maxWidth: '968px', margin: "auto" }}
        >
          <Image
            src={i.detail_image}
            alt='Lecture Detail Image'
            layout='fill'
            objectFit='cover'
            onLoad={({ target }) => {
              const { clientWidth, naturalWidth, naturalHeight } =
                target as HTMLImageElement;
              setImgHeight((prev) =>
                prev.map((j) => ({
                  id: j.id,
                  height:
                    j.id === index
                      ? (naturalHeight / naturalWidth) * clientWidth
                      : j.height,
                }))
              );
            }}
          />
        </div>
      ))}

      {refund_policy ? (
        <>
          <div className='mt-4 rounded bg-[#373c46] p-10 md:p-6' style={{ maxWidth: '968px', margin: "auto" }}>
            <div className='font-bold'>[이용안내 및 환불규정]</div>
            <br />
            <p className='text-white md:text-sm' style={{whiteSpace: 'break-spaces'}}>{refund_policy?.title}</p>
            <br />
            <div className='leading-7 md:text-sm' style={{whiteSpace: 'break-spaces'}}>
            {refund_policy?.text}
            </div>
          </div>
        </>
      ) : null}
    </Layout>
  );
}
