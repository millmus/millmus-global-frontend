import Award from '@components/award';
import { boot, loadScript } from '@components/channelService';
import Footer from '@components/footer';
import Header from '@components/header';
import Loader from '@components/loader';
import { pageview } from '@libs/client/ga';
import { useRouter } from 'next/router';
// import { tokenAtom } from '@libs/client/atom';
// import axios from 'axios';
// import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// import { useRecoilState } from 'recoil';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 🔽 localStorage 관련 로직을 useEffect로 옮겼습니다. 🔽
  useEffect(() => {
    // 이 코드는 클라이언트 측에서만 실행됩니다.
    // if (!isClient) return; // isClient 상태를 사용한다면 이와 같이 가드할 수 있습니다.

    const currentPath = router.asPath;
    
    try {
      const storedPathsRaw = localStorage.getItem('recentPaths');
      let paths = JSON.parse(storedPathsRaw || '[]');

      if (paths[0] !== currentPath) {
        paths.unshift(currentPath); // 현재 경로를 맨 앞에 추가

        // 최대 10개까지만 저장
        if (paths.length > 10) {
          paths = paths.slice(0, 10);
        }
        
        localStorage.setItem('recentPaths', JSON.stringify(paths));
        console.log('Updated recentPaths:', paths);
      } else {
        console.log('Current recentPaths (no update needed):', paths);
      }
    } catch (error) {
      console.error("Error accessing localStorage for recentPaths:", error);
      // localStorage 접근 불가 또는 JSON 파싱 오류 시 예외 처리
    }

  }, [router.asPath]); // router.asPath가 변경될 때마다 이 useEffect를 실행합니다.
                      // isClient 상태를 사용한다면 [router.asPath, isClient] 와 같이 추가합니다.


  const [containerWidth, setContainerWidth] = useState(0);
  
  useEffect(() => {
    const updateWindowWidth = () => {
      setContainerWidth(window.innerWidth);
      console.log(`window.innerWidth: ${window.innerWidth}`);
    };
  
    updateWindowWidth();
    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  // 컨테이너 width에 따른 slidesToShow 결정
  const isMobile = containerWidth < 1280 ? true : false;

  // 로더
  useEffect(() => {
    router.events.on('routeChangeStart', () => setIsLoading(true));
    router.events.on('routeChangeComplete', () => setIsLoading(false));
    return () => {
      router.events.off('routeChangeStart', () => setIsLoading(true));
      router.events.on('routeChangeComplete', () => setIsLoading(false));
    };
  }, []);

  // 채널톡
  useEffect(() => {
    loadScript();
    boot({
      pluginKey: '12902098-1465-47de-a65c-766dc886bd48',
    });

    // const { Kakao } = window;
    // if (Kakao) {
    //   if (!Kakao.isInitialized()) {
    //     Kakao.init("1e7d46f694c6be65caa45eb5ecb2f55a");
    //   }
    //   // 채널 1:1 채팅 버튼을 생성합니다.
    //   Kakao.Channel.createChatButton({
    //     container: '#kakao-talk-channel-chat-button',
    //     channelPublicId: '_eixhCG',
    //     title: 'question',
    //     size: 'small',
    //     color: 'yellow',
    //     shape: 'pc',
    //     supportMultipleDensities: true,
    //   });
    // }
  }, []);

  // GA
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);
  return (
    <div className='w-screen'>
      <Header />
      {children}
      <Footer />
      <Award />
      {isLoading && <Loader />}
      {/* <div id="kakao-talk-channel-chat-button" style={{ position: 'fixed', bottom: '20px', right: '20px' }}></div> */}
    </div>
  );
}
