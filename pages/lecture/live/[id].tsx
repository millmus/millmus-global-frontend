import { lecturesApi } from '@libs/api';
import type { GetServerSidePropsContext, NextPage } from 'next';
import SEO from '@components/seo';
import { useEffect, useState } from 'react';
import { useUser } from '@libs/client/useUser';
import { useRouter } from 'next/router';
import { purchaseApi } from '@libs/api';

const LectureLive: NextPage<{ id: number, title: string, description: string, image: string }> = ({ id, title, description, image }) => {
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        console.log('isRedirecting', isRedirecting)

    }, [isRedirecting])
    
    // skipRedirect: true로 자동 리다이렉트 방지
    const { token, isLoading } = useUser({
        isPrivate: false,
        skipRedirect: true,  // router.back() 자동 호출 방지!
    });

    // SWR 호출 제거 - myLectureID API에서 이미 확인하므로 중복
    // const { data } = useSWR(
    //     token ? `/payment/check/lecture/${id}` : null,
    //     () => purchaseApi.check('lecture', id as number, token as string)
    // );

    const checkMyLectureID = async () => {
        if (isRedirecting) return; // 이미 리다이렉트 중이면 중복 실행 방지
        
        try {
            const myLectureID = await purchaseApi.myLectureID(id as number, token as string);
            console.log('live myLectureID', myLectureID);

            setIsRedirecting(true); // 리다이렉트 시작 표시
            
            if (myLectureID) {
                console.log('my 페이지로 강제 이동')
                // 방법 1: window.location으로 강제 이동 (가장 확실)
                window.location.href = `/lecture/my/${myLectureID}/1`;
                
                // 방법 2: router.replace 후 fallback (선택적)
                // await router.replace(`/lecture/my/${myLectureID}/1`);
                // // router가 작동하지 않을 경우를 대비한 fallback
                // setTimeout(() => {
                //     if (window.location.pathname.includes('/lecture/live/')) {
                //         window.location.href = `/lecture/my/${myLectureID}/1`;
                //     }
                // }, 100);
            } else {
                console.log('live-watch 페이지로 강제 이동')
                // window.location으로 강제 이동
                window.location.href = `/lecture/live-watch/${id}`;
            }
        } catch (error) {
            console.error('리다이렉트 오류:', error);
            setIsRedirecting(false);
        }
    }
    
    useEffect(() => {
        // router가 준비되었는지 확인
        if (!router.isReady) return;
        
        // 인증 상태 로딩 중이면 대기
        if (isLoading) return;
        
        // 이미 리다이렉트 중이면 실행하지 않음
        if (isRedirecting) return;
        
        if (token) {
            // 로그인 사용자는 신청 여부 확인
            checkMyLectureID();
        } else {
            console.log('비로그인 사용자는 즉시 live-watch로 강제 리다이렉트');
            // 비로그인 사용자는 즉시 live-watch로 강제 리다이렉트
            setIsRedirecting(true);
            window.location.href = `/lecture/live-watch/${id}`;
        }
    }, [token, router.isReady, isLoading]); // isLoading 추가하여 인증 상태 확인 후 처리

    return (
        <>
            <SEO title={title} description={description} image={image} />
        </>
    );
};


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

export default LectureLive;