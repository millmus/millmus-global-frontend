// pages/auth/kakao/callback.tsx
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import useSWR, { mutate as globalMutate } from 'swr';

const KAKAO_REDIRECT_URI = `${(process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '')}/auth/kakao/callback`; // Example: http://localhost:3000/auth/kakao/callback

declare global {
  interface Window {
    Kakao: any; // Kakao SDK for Auth.authorize
    ChannelIO?: any;
  }
}

// Function to re-trigger Kakao Auth, potentially for a signup retry
const triggerKakaoAuthRedirect = (isSignupAttempt: boolean, accessToken?: string) => {
  // Kakao SDK initialization check (still needed for Auth.authorize)
  if (!window.Kakao || !window.Kakao.isInitialized()) {
    console.error('Kakao SDK not available for re-triggering auth (authorize).');
    // Attempt to initialize if not already
    if (typeof window.Kakao.init === 'function' && process.env.NEXT_PUBLIC_KAKAO_JS_KEY) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        console.log('Kakao SDK initialized by triggerKakaoAuthRedirect.');
    } else {
        alert('카카오 SDK 오류. 다시 시도해주세요.');
        return;
    }
  }

  const authState = { initial_is_signup: isSignupAttempt, retry: true };

  const performRedirect = () => {
    window.Kakao.Auth.authorize({
      redirectUri: KAKAO_REDIRECT_URI,
      state: JSON.stringify(authState),
    });
  };

  if (isSignupAttempt && accessToken) {
    console.log('Attempting to unlink Kakao account via REST API before signup redirect (retry)...');
    axios.post(
      'https://kapi.kakao.com/v1/user/unlink',
      {}, // Empty data for POST, as per Kakao docs for unlink
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded', // Though no body, Kakao might expect this
        },
      }
    )
    .then((response) => {
      console.log('Unlink successful via REST API for retry. User ID:', response.data.id);
      performRedirect();
    })
    .catch((unlinkError: any) => {
      console.warn('Failed to unlink Kakao account via REST API before retrying as signup (callback page):', unlinkError.response?.data || unlinkError.message);
      // Proceed even if unlink fails (e.g., token expired, user already unlinked)
      performRedirect();
    });
  } else {
    // If not a signup attempt or no access token for unlinking, just authorize
    performRedirect();
  }
};


export default function KakaoCallbackPage() {
  const router = useRouter();
  const { mutate: userMutate } = useSWR('/api/user');
  const [isProcessing, setIsProcessing] = useState(true); // General processing state for UI

  // ✅ FIX: 중복 실행을 방지하기 위한 ref 생성
  const hasRunRef = useRef(false);

  useEffect(() => {
    const initializeKakaoSDK = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        if (typeof window.Kakao.init === 'function' && process.env.NEXT_PUBLIC_KAKAO_JS_KEY) {
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
            console.log('Kakao SDK initialized by callback page.');
            return true;
        } else {
            console.error('Kakao SDK init function not found on callback or key missing.');
            alert('카카오 SDK 초기화 오류입니다.');
            router.push('/');
            return false;
        }
      }
      return true;
    };

    const processKakaoLogin = async (accessToken: string, state: { initial_is_signup: boolean, retry?: boolean }) => {
      setIsProcessing(true);
      // Kakao SDK initialization is still relevant for any other SDK features or context
      // but not strictly for the API calls themselves if accessToken is manually handled.
      // initializeKakaoSDK(); // Ensure it's initialized if any other Kakao.xx calls are made

      const effective_is_signup = state.initial_is_signup;
      console.log('Processing Kakao Auth on callback via REST. Effective is_signup:', effective_is_signup, 'State:', state);

      try {
        // 1. Get user information from Kakao using REST API
        console.log('Fetching user info from Kakao via REST API...');
        const { data: kakaoUserRes } = await axios.get(
          'https://kapi.kakao.com/v2/user/me',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        console.log('Kakao REST API /v2/user/me success:', kakaoUserRes);

        const kakao_account = kakaoUserRes.kakao_account;
        let phone_number = kakao_account?.phone_number;
        if (phone_number) {
          phone_number = phone_number.trim();
          if (phone_number.startsWith("+82")) {
            phone_number = phone_number.replace('+82', '').trim();
          }
          if (phone_number.startsWith("10")) {
            phone_number = `0${phone_number}`;
          }
          phone_number = phone_number.replaceAll("-", "").trim();
        }

        const backendPayload = {
          type: 'kakao',
          id: kakaoUserRes.id + '',
          phone_number: phone_number || null,
          nickname: kakao_account?.profile?.nickname || `사용자${kakaoUserRes.id}`,
          is_signup: effective_is_signup,
        };

        console.log('backendPayload:', backendPayload);

        console.log('Attempting API call with effective_is_signup:', effective_is_signup);

        // 2. Additional steps if it's a signup attempt (talk/channels API call)
        if (effective_is_signup) {
          let ad_agree = false;
          try {
            // !!! SECURITY WARNING: This Admin Key should NOT be in client-side code. Move this to your backend.
            console.log('Fetching Kakao Talk Channel info...');
            const { data: { channels } } = await axios({
              url: `https://kapi.kakao.com/v2/api/talk/channels?target_id_type=user_id&target_id=${kakaoUserRes.id}`,
              method: 'get',
              headers: {
                'Authorization': `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_ADMIN_KEY}`,
              },
            });
            if (channels && channels.length > 0 && channels[0].relation === "ADDED") {
              ad_agree = true;
            }
            console.log('Kakao Talk Channel check result:', channels, 'ad_agree:', ad_agree);
          } catch (channelError: any) {
            console.warn('Error fetching Kakao Talk Channel info. Assuming ad_agree=false.', channelError.response?.data || channelError.message);
          }
          
          Object.assign(backendPayload, { ad_agree });

          if (window.ChannelIO) {
            window.ChannelIO('updateUser', {
              profile: {
                mobileNumber: phone_number,
                name: kakao_account?.profile?.nickname,
              },
              tags: ["간편가입연동"],
              unsubscribeEmail: !ad_agree,
              unsubscribeTexting: !ad_agree,
            }, (error: any, user: any) => {
              if (error) console.error('ChannelIO updateUser error:', error);
              else console.log('ChannelIO user updated:', user);
            });
          }
        }

        // 3. Call your backend API to login or signup
        console.log('Sending to /api/login:', backendPayload);
        const { data: { ok, msg } } = await axios.post('/api/login', backendPayload);
        console.log('/api/login response:', ok, msg);

        if (msg === 'phone_number exists') {
          alert("이미 가입된 아이디가 있습니다. 로그인으로 시도해주세요.");
          router.push('/login');
        } else if (msg === 'need to signup') {
          if (!effective_is_signup) {
            alert("회원가입이 필요합니다. 카카오 계정으로 회원가입을 진행해주세요.");
            router.push('/signup');
            // // // Pass current accessToken for unlink attempt before redirecting for signup
            // triggerKakaoAuthRedirect(true, accessToken); 
          } else {
            alert("회원가입 처리 중 문제가 발생했습니다. 다시 시도해주세요. (Code: CB_NSU_S_REST)");
            console.error("Tried signup (REST), but server responded 'need to signup'. Server/State logic might be flawed.", backendPayload);
            router.push('/');
          }
        } else if (ok) {
          const { data: userData } = await axios.get('/api/user');
          console.log('User data after login/signup:', userData);
          userMutate({ ok: true, token: userData.token, profile: userData.profile }, false);

          // 로그인 성공 후
          // 가장 최근 경로 가져오기
          const recentPaths = JSON.parse(localStorage.getItem('recentPaths') || '[]');
          console.log('recentPaths:', recentPaths);
          if (recentPaths.length > 0) {
            // /login로 시작하는 페이지와 /auth/kakao/callback로 시작하는 페이지를 제외하고 가장 최근 경로로 이동
            const returnTo = recentPaths.find((path: string) => !path.startsWith('/login') && !path.startsWith('/auth/kakao/callback') && !path.startsWith('/signup') && path !== '/');
            console.log('returnTo:', returnTo);
            router.push(returnTo);
          } else {
            router.push('/');
          }
        } else {
          alert(msg || '로그인에 실패했습니다. 다시 시도해주세요.');
          router.push('/');
        }

      } catch (error: any) {
        console.error('Error in Kakao auth callback processing (REST flow):', error.response?.data || error.message || error);
        if (error.isAxiosError && error.response?.data?.code) { // Kakao API specific error via Axios
            const kakaoApiErrorCode = error.response.data.code;
            if (kakaoApiErrorCode === -401) { // Invalid token or not authorized
                alert('카카오 인증이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.');
            } else if (kakaoApiErrorCode === -402) { // Consent required
                alert('카카오 서비스 사용에 필요한 동의가 거부되었습니다. 다시 시도해주세요.');
            } else {
                 alert(`카카오 정보 조회 실패 (Code: ${kakaoApiErrorCode}): ${error.response.data.msg || '알 수 없는 오류'}`);
            }
        } else {
            console.error('카카오 로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
        router.push('/');
      } finally {
        setIsProcessing(false);
      }
    };

    if (router.isReady) {
      initializeKakaoSDK(); // Initialize SDK early for Auth.authorize if needed later

      const { code, error: kakaoAuthError, error_description, state: stateStr } = router.query;
      let hasRun = false; // Prevent double execution from strict mode or fast refresh

      console.log('kakaoAuthProcessed:', sessionStorage.getItem('kakaoAuthProcessed'));
      console.log('hasRun:', hasRun);

      // Check a flag to prevent re-running if already processed
      if (sessionStorage.getItem('kakaoAuthProcessed') === 'true') {
          console.log("Kakao auth already processed in this session. Preventing re-execution.");
          router.push('/'); // Optionally redirect or show a message
          setIsProcessing(false);
          return; // Or just don't do anything if already handled
      }

      if (kakaoAuthError) {
        // ✅ FIX: ref를 사용하여 중복 알림 및 리다이렉션을 방지합니다.
        if (hasRunRef.current) return;
        hasRunRef.current = true;


        if(hasRun) return;
        hasRun = true;
        sessionStorage.setItem('kakaoAuthProcessed', 'true');
        console.error('Kakao authentication error on redirect:', kakaoAuthError, error_description);
        alert(`카카오 인증 실패: ${error_description || kakaoAuthError}. 다시 시도해주세요.`);
        router.push('/');
        return;
      }

      console.log('hasRun:', hasRun);
      console.log('stateStr === string:', typeof stateStr === 'string');
      console.log('stateStr:', stateStr);

      // if (code && typeof stateStr === 'string' && !sessionStorage.getItem('kakaoAuthProcessed')) {
      if (code && typeof stateStr === 'string') {
        // ✅ FIX: 핵심 수정 부분. ref를 확인하여 API 호출이 한 번만 실행되도록 보장합니다.
        if (hasRunRef.current) {
          console.log("Auth process has already been triggered. Skipping duplicate run.");
          return;
        }
        hasRunRef.current = true;
        
        console.log('code:', code);
        if(hasRun) return;
        hasRun = true;
        sessionStorage.setItem('kakaoAuthProcessed', 'true');

        console.log('Authorization code received:', code);
        setIsProcessing(true);

        const getKakaoAccessToken = async (authCode: string | string[]) => {
          console.log('Fetching Kakao access token with authCode:', authCode);
          try {
            const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
            if (!clientId) {
                throw new Error("Kakao REST API Key (client_id) is not configured.");
            }

            const params = new URLSearchParams();
            params.append('grant_type', 'authorization_code');
            params.append('client_id', clientId);
            params.append('redirect_uri', KAKAO_REDIRECT_URI);
            params.append('code', Array.isArray(authCode) ? authCode[0] : authCode);

            console.log('params:', params);
            console.log('grant_type:', params.get('grant_type'));
            console.log('client_id:', params.get('client_id'));
            console.log('redirect_uri:', params.get('redirect_uri'));
            console.log('code:', params.get('code'));
            
            const tokenRes = await axios.post(
              'https://kauth.kakao.com/oauth/token',
              params,
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              }
            );

            console.log('Kakao token response:', tokenRes.data);
            const accessToken = tokenRes.data.access_token; // Correct field name is access_token
            if (!accessToken) {
                throw new Error("Access token not found in Kakao's response.");
            }
            return accessToken;
          } catch (err: any) {
            console.error('Error fetching Kakao access token:', err.response?.data || err.message);
            alert('카카오 토큰 발급에 실패했습니다. 다시 시도해주세요.');
            router.push('/');
            return null;
          }
        };

        getKakaoAccessToken(code).then(accessToken => {
          if (accessToken) {
            try {
              const parsedState = JSON.parse(stateStr);
              console.log('parsedState:', parsedState);
              processKakaoLogin(accessToken, parsedState);
            } catch (e) {
              console.error("Failed to parse state from Kakao redirect:", e);
              alert("잘못된 접근입니다. (상태 정보 오류)");
              router.push('/');
            }
          }
        });
      } else if (!code && !kakaoAuthError) {
          // This might happen on initial load before router.query is populated, or if page is accessed directly.
          // Only set isProcessing to false if we are sure no code will arrive.
          if (router.asPath.includes("auth/kakao/callback") && !router.asPath.includes("code=")) {
             console.log("Callback page loaded without code or error. Awaiting redirect or navigation.");
             //setIsProcessing(false); // Can set to false if this means it's not an active auth flow
          }
      }
    }
    // Clean up the session storage flag when the component unmounts or effect re-runs for other reasons
    return () => {
        // sessionStorage.removeItem('kakaoAuthProcessed'); // Or manage more carefully
    };

  // }, [router.isReady, router.query, router.asPath, userMutate]); // Added router.asPath
  }, [router.isReady]); // Added router.asPath

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {isProcessing ? (
        <p>카카오 로그인 처리 중입니다. 잠시만 기다려주세요...</p>
      ) : (
        <p>로그인 정보를 기다리고 있습니다. 문제가 지속되면 홈으로 이동하여 다시 시도해주세요.</p>
      )}
    </div>
  );
}