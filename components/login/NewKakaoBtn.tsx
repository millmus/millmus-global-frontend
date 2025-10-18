// components/NewKakaoBtn.tsx
import { useRouter } from 'next/router';
import Image from "next/image";
import kakao from "@public/icons/kakao.png";
import { useEffect } from 'react';

declare global {
  interface Window {
    Kakao: any;
    ChannelIO?: any; // ChannelIO 타입 추가
  }
}

interface INewKakaoBtnProps {
  className?: string;
  is_signup: boolean; // This prop now primarily sets the initial intent
}

const DEFAULT_CLASSNAME = 'flex h-[3.688rem] w-full cursor-pointer items-center justify-center rounded bg-[#fee500] text-lg font-medium text-[#222222] transition-all hover:opacity-90 md:h-14 md:text-base';

// console.log('process.env.NEXT_PUBLIC_KAKAO_JS_KEY:', process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
// console.log('process.env.NEXT_PUBLIC_KAKAO_ADMIN_KEY:', process.env.NEXT_PUBLIC_KAKAO_ADMIN_KEY);
// console.log('process.env.NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

// !! IMPORTANT: Define your redirect URI. This must be registered in your Kakao Developers console.
const KAKAO_REDIRECT_URI = `${(process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')}/auth/kakao/callback`; // Example: http://localhost:3000/auth/kakao/callback

// console.log('KAKAO_REDIRECT_URI:', KAKAO_REDIRECT_URI);

export default function NewKakaoBtn({ className, is_signup }: INewKakaoBtnProps) {
  const initializeKakao = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      // Ensure your Kakao SDK Init key is correctly set,
      // usually in _app.tsx or a similar global script.
      // This is just a fallback check; initialization should ideally happen once globally.
      // window.Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY'); 
      console.warn('Kakao SDK was not initialized. Attempting to initialize if init function is available globally.');
      if (typeof window.Kakao.init === 'function' && process.env.NEXT_PUBLIC_KAKAO_JS_KEY) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        console.log('Kakao SDK initialized by NewKakaoBtn.');
      } else {
        console.error('Kakao SDK init function not found or key missing.');
        return false;
      }
    }
    return true;
  };
  
  const handleKakaoAuthRedirect = async () => {
    if (!initializeKakao() || !window.Kakao || !window.Kakao.isInitialized()) {
      alert(
        '카카오 SDK가 로드되지 않았거나 초기화되지 않았습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.'
      );
      console.error(
        'Kakao SDK not loaded or not initialized when handleKakaoAuthRedirect called.'
      );
      return;
    }

    // The `is_signup` prop determines the initial intent.
    // This intent is passed via the 'state' parameter to the callback page.
    const authState = {
      initial_is_signup: is_signup,
    };

    // // If the initial intent is signup, we might still want to unlink first.
    // // This ensures a clean slate if the user had a previous connection.
    // if (is_signup) {
    //   try {
    //     console.log('Attempting to unlink Kakao account before signup redirect...');
    //     await window.Kakao.API.request({
    //       url: '/v1/user/unlink',
    //     });
    //     console.log('Kakao unlinked successfully or was not linked.');
    //   } catch (unlinkError: any) {
    //     // It's okay if unlink fails (e.g., user not linked), proceed to authorize.
    //     // Kakao.Auth.authorize will handle existing sessions or prompt for login/consent.
    //     if (unlinkError.code === -401) { //KOE005: Not connected user
    //          console.warn('Kakao unlink not needed (user not connected). Proceeding to authorize.');
    //     } else {
    //         console.warn(
    //           'Failed to unlink Kakao account during signup attempt, proceeding to authorize anyway:',
    //           unlinkError
    //         );
    //     }
    //   }
    // }
    
    console.log(`Redirecting to Kakao for authentication. Initial intent (is_signup): ${is_signup}`);
    // window.Kakao.Auth.authorize({
    //   redirectUri: KAKAO_REDIRECT_URI,
    //   state: JSON.stringify(authState), // Pass the initial intent
    //   // You can request additional scopes here if needed:
    //   // scope: 'profile_nickname,account_email,phone_number,friends,talk_message,channel',
    // });
    // Rest API 호출
    const client_id = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    const redirectUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&state=${JSON.stringify(authState)} `;

    console.log('client_id:', client_id);
    console.log('redirectUrl:', redirectUrl);
    window.location.href = redirectUrl;

    
  };

  const currentClassName = className || DEFAULT_CLASSNAME;

  return (
    <div
      onClick={handleKakaoAuthRedirect}
      className={currentClassName}
      role="button"
      tabIndex={0}
    >
      <div className="relative w-[40px] h-[40px] mt-[4px]">
        <Image
          src={kakao}
          layout='fill'
          objectFit='cover' />
      </div>
      {is_signup ? "카카오로 3초만에 가입" : "카카오로 3초만에 로그인"}
    </div>
  );
}