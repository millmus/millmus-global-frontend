import { gradeImg } from '@components/grade';
import Layout from '@layouts/sectionLayout';
import { lecturesApi } from '@libs/api';
import { trimDate } from '@libs/client/utils';
import { useState, useRef } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import Image from 'next/image';
import useSWR from 'swr';

interface IProps {
  id: string;
  review: any[];
  updateReviews: (b: any[]) => void;
  setIsDefaultOrder: (b: boolean) => void;
  setIsOpen: (b: boolean) => void;
  setIndex: (b: any[]) => void;
}

interface IForm {
  review: string;
  image: any;
}

export default function Review({ id, review, updateReviews, setIsDefaultOrder, setIsOpen, setIndex }: IProps) {
  const maxFile = 3,
    image_files = useRef([] as any);
  const { data: myData } = useSWR('/api/user');
  const { mutate } = useSWR(
    myData?.token ? `/lectures/${id}/logged` : `/lectures/${id}/unlogged`,
    () => lecturesApi.detail(id, myData?.token)
  );
  const [isEditing, setIsEditing] = useState<{
    id: number | null;
    value: boolean;
  }>({ id: null, value: false });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<IForm>({
    mode: 'onSubmit',
  });
  const onValid = async (values: IForm) => {
    const formData = new FormData();
    formData.append("text", values.review);
    for (let i = 0; i < image_files.current.length; i++) {
      if (i > maxFile-1) break;
      const image = image_files.current[i];
      formData.append(`image${i+1}`, image);
    }
    try {
      // 리뷰 수정 진행중 true
      if (isEditing.value) {
        formData.append("lecture_review_pk", isEditing.id!.toString());
        await lecturesApi.editReview(
          formData,
          myData?.token as string
        );
        const updatedData = await lecturesApi.detail(id);
        mutate(updatedData);
        updateReviews(updatedData?.review);
        setIsEditing({ id: null, value: false });
        clearContent();
      }
      // 리뷰 수정 진행중 false
      else {
        formData.append("lecture_pk", id);
        const { data: message } = await lecturesApi.writeReview(
          formData,
          myData.token
        );
        if (message === 'unregistered lecture') {
          setError('review', { message: '구매하지 않은 강의입니다.' });
        } else if (message === 'review exist') {
          setError('review', { message: '이미 리뷰를 작성한 강의입니다.' });
        } else {
          clearContent();
          const updatedData = await lecturesApi.detail(id);
          mutate(updatedData);
          updateReviews(updatedData?.review);
        }
      }
    } catch {
      alert('Error');
    }
  };

  const hiddenFileInput = useRef<HTMLDivElement>(null);
  const onChange = (e:any) => {
    e.preventDefault();
    const files = e.target.files, 
      fileUploaded = files[0];
    if (!fileUploaded) return;
    if (!hiddenFileInput.current) return;
    
    for (let i = 0; i < files.length; i++) {
      if (i > maxFile-1) break;
      image_files.current.push(files[i]);
    }
    fileNames();
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  const fileNames = () => {
    if (!hiddenFileInput.current) return;
    hiddenFileInput.current.innerHTML = '';
    for (let i = 0; i < image_files.current.length; i++) {
      const temp = document.createElement('div'),
        temp_name = document.createElement('div'),
        temp_icon = document.createElement('span');

      temp.setAttribute("index", i.toString());
      temp.classList.add("flex");
      temp.classList.add("justify-between");
      temp_name.innerText = image_files.current[i].name;
      temp_name.classList.add("text-ellipsis");
      temp_name.classList.add("overflow-hidden");
      temp_icon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="grey" 
          class="w-[25px] h-[25px] cursor-pointer">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>`;
      temp_icon.addEventListener("click", function() {
        const index = parseInt(this!['parentElement']!.getAttribute("index")!);
        image_files.current.splice(index, 1);
        fileNames();
      })

      temp.appendChild(temp_name);
      temp.appendChild(temp_icon);
      hiddenFileInput.current.appendChild(temp);
    }
  }

  const clearContent = () => {
    if (!hiddenFileInput.current) return;
    hiddenFileInput.current.innerHTML = '';
    image_files.current = [];
    setValue('image', '');
    setValue('review', '');
  }
  const urlToObject = async (url: string, name: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], name, {type: blob.type});
    return file;
  }
  const startEdit = async (i: any) => {
    setIsEditing({ id: i.id, value: true });
    setValue('review', i.text);
    image_files.current = [];                            
    const files = [i.image1, i.image2, i.image3], 
      fileUploaded = files[0];
    if (!fileUploaded) return;
    if (!hiddenFileInput.current) return;

    for (let i = 0; i < files.length; i++) {
      if (!files[i]) continue;
      const file = await urlToObject(files[i], `Image ${i+1}`);
      image_files.current.push(file);
    }
    fileNames();
  };
  const deleteReview = async (reviewId: number) => {
    if (confirm('수강후기를 삭제하시겠습니까?')) {
      try {
        await lecturesApi.deleteReview(reviewId, myData?.token as string);
        const updatedData = await lecturesApi.detail(id);
        mutate(updatedData);
        clearContent();
        updateReviews(updatedData?.review);
      } catch {
        alert('Error');
      }
    }
  };
  return (
    <Layout padding='pb-80'>
      <div className='w-full space-y-4'>

        {/* 리뷰 작성창 */}
        {myData?.token && !isEditing.value && (
          <div className='flex w-full items-start rounded bg-[#373c46] py-6 px-10 md:block md:p-6'>
            <div className='flex items-center'>
              <div>{myData?.profile?.name}</div>
              <div className='relative ml-1 aspect-square h-4 w-4'>
                {gradeImg(myData?.profile?.grade)}
              </div>
            </div>

            <div className='grow'>
              <div className='flex md:mt-4'>
                <div className='ml-14 h-24 rounded-l-sm bg-[#282e38] p-4 md:ml-0 md:h-32 md:text-sm'>
                  {myData?.profile?.nickname} |
                </div>
                <textarea
                  {...register('review', {
                    required: '리뷰를 입력해주세요',
                    minLength: {
                      message: '10자 이상의 리뷰를 남겨주세요',
                      value: 10,
                    },
                  })}
                  className='h-24 grow resize-none rounded-r-sm bg-[#282e38] py-4 outline-none md:h-32 md:w-full'
                />
                <div className='h-24 rounded-r-sm bg-[#282e38] text-[#00e7ff] hover:opacity-90 md:ml-0 md:h-32 md:text-sm'>
                  <input 
                    {...register("image", {
                      onChange: onChange,
                      maxLength: 3
                    })}
                    id="reviewImgUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    multiple
                  />
                  <label htmlFor="reviewImgUpload" 
                    className="flex flex-col w-full h-full p-4
                    text-sm text-center cursor-pointer 
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100">
                    사진첨부
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00e7ff" className="w-6 h-6 m-auto">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </label>
                </div>
              </div>

              <div className='mt-2 pl-14 text-sm text-red-500'>
                {errors?.review?.message}
              </div>
            </div>

            <div ref={hiddenFileInput} className="px-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap md:max-w-none"></div>
            <div
              onClick={handleSubmit(onValid, onInvalid)}
              className='flex h-10 w-24 cursor-pointer items-center justify-center rounded-sm bg-[#00e7ff] text-sm font-medium text-[#282e38] transition-all hover:opacity-90 md:mt-4 md:ml-0'
            >
              저장
            </div>
          </div>
        )}
        {/* 리뷰 작성창 */}
        
        {review?.map((i, index) => {
          const reviewUserId = i.user.id,
            is_mine = myData?.profile?.id == reviewUserId;
          return (
          <div key={i.id} className='flex w-full rounded bg-[#373c46] p-10 md:p-6'>
            <div className="flex-1 flex-col w-full">
              <div className='flex justify-between'>
                <div className='flex items-center'>
                  <div className='text-lg font-medium md:text-base'>
                    {i.user.nickname}
                  </div>
                  <div className='relative ml-1 aspect-square h-5 w-5'>
                    {gradeImg(i.user.grade)}
                  </div>
                </div>

                {is_mine && (
                  <div className='flex items-center space-x-2 text-sm opacity-70'>
                    {isEditing.value ? (
                      // 리뷰 수정 진행중 true
                      <div
                        onClick={() => {
                          setIsEditing({ id: null, value: false });
                          clearContent();
                        }}
                        className='cursor-pointer'
                      >
                        취소
                      </div>
                    ) : (
                      // 리뷰 수정 진행중 false
                      <>
                        <div
                          onClick={(e: any) => {
                            e.preventDefault(); 
                            startEdit(i);
                          }}
                          className='cursor-pointer'
                        >
                          수정
                        </div>
                        <div className='text-[0.625rem]'>|</div>
                        <div
                          onClick={() => deleteReview(i.id)}
                          className='cursor-pointer'
                        >
                          삭제
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className='opacity-60 md:text-sm'>
                {trimDate(i.created, 0, 10)}
              </div>

              {is_mine && isEditing.value ? (
                <div className='mt-7 flex w-full md:flex-col'>
                  <div className="flex w-full">
                    <textarea
                      {...register('review', {
                        required: '리뷰를 입력해주세요',
                        minLength: {
                          message: '10자 이상의 리뷰를 남겨주세요',
                          value: 10,
                        },
                      })}
                      className='h-24 grow resize-none rounded-r-sm bg-[#282e38] p-4 outline-none md:h-32 md:w-full'
                    />
                  <div className='h-24 rounded-r-sm bg-[#282e38] text-[#00e7ff] hover:opacity-90 md:ml-0 md:h-32 md:text-sm'>
                    <input 
                      {...register("image", {
                        onChange: onChange,
                        maxLength: 3
                      })}
                      id="reviewImgEdit"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple
                    />
                    <label htmlFor="reviewImgEdit" 
                      className="flex flex-col w-full h-full p-4
                      text-sm text-center cursor-pointer 
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-violet-50 file:text-violet-700
                      hover:file:bg-violet-100">
                      사진첨부
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#00e7ff" className="w-6 h-6 m-auto">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </label>
                  </div>
                </div>
                <div ref={hiddenFileInput} className="px-2 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap md:max-w-none"></div>
                  <div
                    onClick={handleSubmit(onValid, onInvalid)}
                    className='ml-4 flex h-10 w-24 cursor-pointer items-center justify-center rounded-sm bg-[#00e7ff] text-sm font-medium text-[#282e38] transition-all hover:opacity-90 md:mt-4 md:ml-0'
                  >
                    저장
                  </div>
                </div>
              ) : (
                <div className='mt-7 max-h-[400px] overflow-y-auto break-all text-lg md:text-base md:max-h-[100px] md:mt-0'
                  onClick={() => {
                    if (!i.image1) return ;
                    setIndex([{id: i.id, index: index}]);
                    setIsDefaultOrder(true);
                    setIsOpen(true);
                  }}
                  >{i.text}</div>
              )}
            </div>
            {i.image1 && (
              !(is_mine && isEditing.value) ? 
              <div 
                className="relative w-[200px] h-[200px] mx-3 self-end md:w-[100px] md:h-[100px] md:mx-1"
                onClick={() => {
                  setIndex([{id: i.id, index: index}]);
                  setIsDefaultOrder(true);
                  setIsOpen(true);
                }}
              >
                <Image
                  src={i.image1}
                  alt='Review Thumbnail'
                  layout='fill'
                  objectFit='cover'
                />
              </div> : null
            )}
          </div>
        )})}
      </div>
    </Layout>
  );
}
