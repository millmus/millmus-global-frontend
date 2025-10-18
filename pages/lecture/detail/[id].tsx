import Community from '@components/lecture/detail/community';
import Curriculum from '@components/lecture/detail/curriculum';
import Detail from '@components/lecture/detail/detail';
import Info from '@components/lecture/detail/info';
import Review from '@components/lecture/detail/review';
import SEO from '@components/seo';
import Layout from '@layouts/sectionLayout';
import { lecturesApi } from '@libs/api';
import { cls, fbqProductTrack } from '@libs/client/utils';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useRef, useEffect, useState } from 'react';
import useSWR from 'swr';
import Preview from "@components/lecture/detail/preview";
import ReviewModal from "@components/lecture/detail/reviewModal";
import { useRouter } from 'next/router';

const LectureDetail: NextPage<{ id: string, title: string, description: string, image: string }> = ({ id, title, description, image }) => {
  const { data, mutate } = useSWR(
    `/lecture/${id}`,
    () => lecturesApi.detail(id), {
    revalidateOnFocus: false,
  }
  );

  const router = useRouter();
  const [section, setSection] = useState('강의정보');
  const [isOpen, setIsOpen] = useState(false);
  const [isDefaultOrder, setIsDefaultOrder] = useState(true);
  const [currentIndex, setIndex] = useState([{ id: 0, index: 0 }]);
  const [localReviews, updateReviews] = useState(data?.review);
  const sectionList = [
    {
      id: 0,
      label: '강의정보',
    },
    {
      id: 3,
      label: '수강후기',
    },
    {
      id: 2,
      label: '커리큘럼',
    },
    {
      id: 1,
      label: '미리보기',
    },
    {
      id: 4,
      label: '커뮤니티',
    },
  ];
  const scrollRef = useRef<HTMLDivElement>(null);
  const setSectionScroll = (label: string) => {
    setSection(label);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const selectOption = async (id: string, price_only: any) => {
    if (price_only) {
      mutate({ ...data, ...price_only }, false);
    } else {
      const updatedData = await lecturesApi.detail(id);
      mutate(updatedData, false);
    }
  }

  useEffect(() => {
    fbqProductTrack("ViewContent", data, data?.price);
  }, []);
  useEffect(() => {
    // if (data?.is_hidden && (id != '150' && id != '158')) {
    //   alert("만료된 강의입니다.")
    //   router.push("/");
    // };
    updateReviews(data?.review);
  }, [data]);

  // if (data?.is_hidden && (id != '150' && id != '158')) {
  //   return (<></>)
  // }

  return (
    <>
      <SEO title={title} description={description} image={image} />
      <Detail id={id} {...data} selectOption={selectOption} />

      <ReviewModal
        review={localReviews}
        state={setSectionScroll}
        isDefaultOrder={isDefaultOrder}
        setIsDefaultOrder={setIsDefaultOrder}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currentIndex={currentIndex}
        setIndex={setIndex}
      />

      <Layout>
        <div className={`${data?.review.length ? "mt-12" : "mt-32"} mb-[3.75rem] flex text-lg font-medium'`} style={{ minWidth: "500px" }}>
          {sectionList.map((i) => (
            <div
              key={i.id}
              onClick={() => setSection(i.label)}
              className={cls(
                section === i.label
                  ? 'border-[#00e7ff] text-white'
                  : 'border-[rgba(255,255,255,0.16)] text-[rgba(255,255,255,0.6)]',
                'flex w-[6.25rem] cursor-pointer justify-center border-b-2 pb-3 transition-all'
              )}
            >
              {i.label}
            </div>
          ))}
          <div className='mt-2 grow border-b-2 border-[rgba(255,255,255,0.16)]' />
        </div>
      </Layout>
      <div style={{ maxWidth: '968px', margin: "auto", }} ref={scrollRef}>
        {section === '강의정보' && <Info is_offline={(data?.series || data?.category == "프리미엄 스터디") ? true : false} is_masterseries={data?.series ? true : false} is_free={data?.category == "코인"} data={data?.lecture_detail} sold_out={data?.sold_out} refund_policy={data?.refund_policy} />}
        {section === '미리보기' && <Preview data={data?.curriculum} />}
        {section === '커리큘럼' && <Curriculum data={data?.curriculum} />}
        {section === '수강후기' && <Review id={data?.id} review={localReviews} updateReviews={updateReviews} setIsDefaultOrder={setIsDefaultOrder} setIsOpen={setIsOpen} setIndex={setIndex} />}
        {section === '커뮤니티' && <Community {...data} />}
      </div>
    </>
  );
};

// const Page: NextPage<{ fallback: AuthResponse; id: string }> = ({
//   fallback,
//   id,
// }) => (
//   <SWRConfig
//     value={{
//       fallback,
//     }}
//   >
//     <LectureDetail id={id} />
//   </SWRConfig>
// );

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = ctx.params?.id as string;

  const data = await lecturesApi.detail(id);
  return {
    props: {
      id,
      title: data?.tutor.name,
      description: data?.name,
      image: data?.image,
    },
  };
};

export default LectureDetail;