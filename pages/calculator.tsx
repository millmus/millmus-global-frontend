import SEO from '@components/seo';
import Layout from '@layouts/sectionLayout';
import { cls } from '@libs/client/utils';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import Lecture from '@components/lecture/lecture';

interface IForm {
  input1: string;
  input2: string;
  input3: string;
  input4: string;
  input5: string;
}

const Calculator: NextPage = () => {
  const [resultTab, setResultTab] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IForm>({
    mode: 'onSubmit',
  });
  const onValid = (data: IForm) => {
    setResultTab(true);
  };
  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  const list = [
    {
      id: 4,
      title: '현재 내가 보유하고 있는 투자금은 얼마인가요',
      input: 'input5',
      error: errors?.input5?.message,
    },
    {
      id: 0,
      title: '파이어 이후 매달 지출하고 싶은 금액은 얼마인가요?',
      input: 'input1',
      error: errors?.input1?.message,
    },
    {
      id: 1,
      title: '현재 본인의 나이는 얼마인가요?',
      input: 'input2',
      error: errors?.input2?.message,
    },
    {
      id: 2,
      title: '파이어하고 싶은 나이는 언제인가요?',
      input: 'input3',
      error: errors?.input3?.message,
    },
    {
      id: 3,
      title: '투자시 목표 수익룰은 얼마인가요?',
      input: 'input4',
      error: errors?.input4?.message,
    },
  ];

  const result1 = Math.ceil(
    +watch('input1') * 12 * 1.02 ** (+watch('input3') - +watch('input2'))
  );
  const result2 = Math.ceil(result1 / (+watch('input4') / 100 - 0.02));

  function getRecommendData() {
    console.log(+watch('input5'), +watch('input2'))
    if(+watch('input5') > 200000000 && +watch('input2') <= 39) return RecommendClass2
    else if(+watch('input5') > 200000000 && +watch('input2') >= 40) return RecommendClass3
    else return RecommendClass1
  }

  return (
    <>
      <SEO title='등급 안내' />
      <Layout padding='py-[8.75rem] md:py-24'>
        <div className='flex flex-col items-center'>
          <div className='text-2xl font-medium md:text-center md:text-xl'>
            경제적 자유 얻고 파이어족 도전! 대체 얼마가 필요할까?
          </div>

          <div className='text-2xl mt-1 font-medium md:text-center md:text-xl'>
          내 목표달성을 위한 투자 클래스를 함께 추천해드립니다!
          </div>


          {!resultTab ? (
            <>
              <div className='mt-[3.75rem] flex flex-col items-center space-y-4'>
                {list.map((i) => (
                  <div
                    key={i.id}
                    className='w-[48.75rem] rounded-lg bg-[#373c46] py-7 px-10 md:w-full'
                  >
                    <div className='flex items-center justify-between md:flex-col md:items-start'>
                      <div className='font-medium'>
                        <span className='text-[#00e7ff]'>Q. </span>
                        {i.title}
                      </div>

                      <div className='flex w-72 md:mt-4'>
                        <input
                          type='tel'
                          placeholder=''
                          {...register(
                            i.input as
                              | 'input5'
                              | 'input1'
                              | 'input2'
                              | 'input3'
                              | 'input4',
                            {
                              required: '값을 입력해주세요',
                            }
                          )}
                          className='w-60 border-b border-[#575b64] bg-transparent pr-0.5 text-right outline-none'
                        />
                        <span className='ml-3 font-medium opacity-60'>
                          {(i.id === 0 || i.id === 4) ? '원' : i.id === 3 ? '%' : '살'}
                        </span>
                      </div>
                    </div>

                    {i.error && (
                      <div className='mt-2 ml-5 text-sm text-red-500'>
                        {i.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div
                onClick={handleSubmit(onValid, onInvalid)}
                className='mt-[3.75rem] cursor-pointer rounded bg-[#00e7ff] py-4 px-[6.25rem] font-medium text-[#282e38] transition-all hover:opacity-90'
              >
                결과 보러가기
              </div>
            </>
          ) : (
            <>
              <div className='mt-[3.75rem] flex h-64 w-[54rem] flex-col items-center justify-center space-y-8 bg-[#373c46] md:w-full'>
                <div className='flex items-center md:flex-col'>
                  <div>필요한 파이어 자금은</div>

                  <div className='flex items-center md:mt-2 md:items-center'>
                    <div className='mx-3 flex w-[28.375rem] justify-center border-b border-[#575b64] text-[2rem] font-bold text-[#00e7ff] md:mx-0 md:w-fit md:border-transparent'>
                      {result2.toLocaleString()}
                    </div>
                    <div className='ml-3 font-medium opacity-60 md:ml-2 md:mt-3'>
                      원입니다.
                    </div>
                  </div>
                </div>

                <div className='flex items-center md:flex-col'>
                  <div>파이어 후 연간 지출금액은 미래가치로</div>

                  <div className='flex items-center md:mt-2 md:items-center'>
                    <div className='mx-3 flex w-[22.375rem] justify-center border-b border-[#575b64] text-[2rem] font-bold text-[#00e7ff] md:mx-0 md:w-fit md:border-transparent'>
                      {result1.toLocaleString()}
                    </div>
                    <div className='ml-3 font-medium opacity-60 md:ml-2 md:mt-3'>
                      원입니다.
                    </div>
                  </div>
                </div>
              </div>

              <h1 className='font-bold text-xl w-full mt-24 md:text-lg'>
                밀머스가 추천하는 나에게 맞는 클래스!
              </h1>

              <div className='mt-3.5 leading-5.5 text-sm w-full md:text-xs md:mt-3'>
                경제적 자유를 이루려면 ‘투자’는 필수입니다. 초보투자자일수록 기초를 탄탄히 쌓고 잃지 않는 투자를 해야 한다는 것, 잊지마세요!
              </div>

              <div className='w-full mt-8 grid grid-cols-3 gap-x-5 gap-y-12 md:mt-6 md:flex md:gap-x-4 md:overflow-x-scroll'>
                {getRecommendData()?.map((i: any) => (
                  <Lecture
                    key={i.id}
                    id={i.id}
                    thumbnail={i.thumbnail}
                    category={i.category}
                    tutor={i.tutor}
                    name={i.name}
                  />
                ))}
              </div>

              <div className='flex space-x-4 md:flex-col md:space-x-0'>
                <div
                  onClick={() => {
                    setValue('input1', '');
                    setValue('input2', '');
                    setValue('input3', '');
                    setValue('input4', '');
                    setValue('input5', '');
                    setResultTab(false);
                  }}
                  className='mt-24 cursor-pointer rounded bg-[#4c515a] py-4 px-[6.25rem] font-medium transition-all hover:opacity-90'
                >
                  다시하기
                </div>

                <Link href='/'>
                  <a>
                    <div className='mt-24 cursor-pointer rounded bg-[#00e7ff] py-4 px-[6.25rem] font-medium text-[#282e38] transition-all hover:opacity-90 md:mt-4'>
                      메인으로
                    </div>
                  </a>
                </Link>
              </div>


            </>
          )}
        </div>
      </Layout>
    </>
  );
};


const RecommendClass1: any = [
  {
    "id": 6,
    "tutor": {
      "name": "송희구",
    },
    "name": "100억 자산가에게 배우는 부동산 입문",
    "category": "부동산",
    "thumbnail": "https://single-fire.s3.ap-northeast-2.amazonaws.com/uploads/%EC%86%A1%ED%9D%AC%EA%B5%AC_%EA%B0%95%EC%9D%98%ED%8E%98%EC%9D%B4%EC%A7%80_%EB%B3%B5%EC%82%AC.jpg",
  },
  {
    "id": 15,
    "tutor": {
      "name": "서쪽도사",
    },
    "name": "서울 재개발 소액으로 미리 선점하기",
    "category": "부동산",
    "thumbnail": "https://single-fire.s3.ap-northeast-2.amazonaws.com/uploads/%EA%B0%95%EC%9D%98_%EC%83%81%EC%84%B8%ED%8E%98%EC%9D%B4%EC%A7%80_%EC%B5%9C%EC%A2%85%EB%B3%B4%EC%A0%95%EC%BB%B7.png",
  },
  {
    "id": 8,
    "tutor": {
      "name": "이석근",
    },
    "name": "하루10분 월급만큼 버는 생초보 미국주식",
    "category": "주식",
    "thumbnail": "https://single-fire.s3.ap-northeast-2.amazonaws.com/uploads/%EC%9D%B4%EC%84%9D%EA%B7%BC_%EA%B0%95%EC%9D%98%ED%8E%98%EC%9D%B4%EC%A7%80_%EB%B3%B5%EC%82%AC.jpg",
  }
]


const RecommendClass2: any = [
  {
    "id": 1,
    "tutor": {
      "name": "강용수",
    },
    "name": "월 7000만원 원룸건물 고수의 투자비법",
    "category": "부동산",
    "thumbnail": "https://single-fire.s3.ap-northeast-2.amazonaws.com/uploads/%EA%B0%95%EC%9A%A9%EC%88%98_%EA%B0%95%EC%9D%98%ED%8E%98%EC%9D%B4%EC%A7%80_%EC%9C%84%EC%B9%98%EC%A1%B0%EC%A0%95.jpg",
  },
  {
    "id": 2,
    "tutor": {
      "name": "김도협",
    },
    "name": "무조건 버는 777 아파트 소액투자법",
    "category": "부동산",
    "thumbnail": "https://single-fire.s3.ap-northeast-2.amazonaws.com/uploads/%EA%B9%80%EB%8F%84%ED%98%91_%EA%B0%95%EC%9D%98%ED%8E%98%EC%9D%B4%EC%A7%80_%EB%B3%B5%EC%82%AC.jpg",
  },
  {
    "id": 22,
    "tutor": {
      "name": "이건록",
    },
    "name": "하락기 흔들리지 않는 입지분석의 핵심",
    "category": "부동산",
    "thumbnail": "https://single-fire.s3.ap-northeast-2.amazonaws.com/uploads/%EB%82%B4%EB%B6%80%EC%8D%B8%EB%84%A4%EC%9D%BC_%EC%88%98%EC%A0%95.png",
  }
]


const RecommendClass3: any = [
  {
    "id": 1,
    "tutor": {
      "name": "강용수",
    },
    "name": "월 7000만원 원룸건물 고수의 투자비법",
    "category": "부동산",
    "thumbnail": "https://single-fire.s3.ap-northeast-2.amazonaws.com/uploads/%EA%B0%95%EC%9A%A9%EC%88%98_%EA%B0%95%EC%9D%98%ED%8E%98%EC%9D%B4%EC%A7%80_%EC%9C%84%EC%B9%98%EC%A1%B0%EC%A0%95.jpg",    
  },
  {
    "id": 5,
    "tutor": {
      "name": "박익현",
    },
    "name": "평범한 직장인이 건물주되는 7단계 프로세스",
    "category": "부동산",
    "thumbnail": "https://single-fire.s3.ap-northeast-2.amazonaws.com/uploads/%EB%B0%95%EC%9D%B5%ED%98%84_%EA%B0%95%EC%9D%98%ED%8E%98%EC%9D%B4%EC%A7%80_%EB%B3%B5%EC%82%AC.jpg",
  },
  {
    "id": 7,
    "tutor": {
      "name": "붇터린치",
    },
    "name": "직장인이 할 수 있는 무인사업 A to Z",
    "category": "부동산",
    "thumbnail": "https://single-fire.s3.ap-northeast-2.amazonaws.com/uploads/%EC%8B%A0%EA%B4%91%EC%A7%84_%EA%B0%95%EC%9D%98%ED%8E%98%EC%9D%B4%EC%A7%80_%EB%B3%B5%EC%82%AC.jpg",
  }
]

export default Calculator;
