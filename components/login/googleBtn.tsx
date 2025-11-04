import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import useSWR from 'swr';

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleBtn() {
  const { mutate } = useSWR('/api/user');
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState('');

  // In-App 브라우저 감지
  const detectBrowserEnvironment = () => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

    const info = {
      origin: window.location.origin,
      href: window.location.href,
      userAgent: ua,
      isInAppBrowser: false,
      browserType: 'Unknown',
    };

    // In-App 브라우저 감지
    if (ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1) {
      info.isInAppBrowser = true;
      info.browserType = 'Facebook';
    } else if (ua.indexOf('Instagram') > -1) {
      info.isInAppBrowser = true;
      info.browserType = 'Instagram';
    } else if (ua.indexOf('KAKAOTALK') > -1) {
      info.isInAppBrowser = true;
      info.browserType = 'KakaoTalk';
    } else if (ua.indexOf('Line/') > -1) {
      info.isInAppBrowser = true;
      info.browserType = 'Line';
    } else if (ua.indexOf('SamsungBrowser') > -1) {
      info.browserType = 'Samsung Internet';
    } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
      info.browserType = 'Safari';
    } else if (ua.indexOf('Chrome') > -1) {
      info.browserType = 'Chrome';
    }

    const debugMsg = `
=== 브라우저 환경 정보 ===
Origin: ${info.origin}
URL: ${info.href}
브라우저: ${info.browserType}
In-App 브라우저: ${info.isInAppBrowser ? 'Yes' : 'No'}
User-Agent: ${info.userAgent}
========================
    `.trim();

    console.log(debugMsg);
    setDebugInfo(debugMsg);

    return info;
  };

  const login = () => {
    const { google } = window;
    const browserInfo = detectBrowserEnvironment();

    // In-App 브라우저인 경우 경고
    if (browserInfo.isInAppBrowser) {
      alert(
        `⚠️ ${browserInfo.browserType} 앱 내장 브라우저에서는 Google 로그인이 제한될 수 있습니다.\n\n` +
        `원활한 로그인을 위해 다음 방법을 시도해주세요:\n\n` +
        `1. 우측 상단 메뉴(⋯) 클릭\n` +
        `2. "Safari에서 열기" 또는 "Chrome에서 열기" 선택\n` +
        `3. 일반 브라우저에서 다시 로그인 시도`
      );
    }

    const handleCredentialResponse = async (res: any) => {
      const { credential } = res;
      const data = jwt_decode(credential) as { [key: string]: any };
      const {
        data: { msg },
      } = await axios.post('/api/login', {
        type: 'google',
        id: data.sub + '',
      });
      // sns 로그인이 처음인 사용자
      if (msg && msg === 'need to signup') {
        router.push(
          {
            pathname: '/signup',
            query: {
              type: 'google',
              id: data.sub + '',
              name: data.name,
              // phone_number: profile.mobile,
            },
          },
          '/signup'
        );
      }
      // sns 로그인을 했던 사용자
      else {
        const {
          data: { token, profile },
        } = await axios.get('/api/user');
        mutate({ ok: true, token, profile });
      }
    };

    google?.accounts.id.initialize({
      client_id:
        '785668148402-iro2k5tes1khiami8lb88fasre89r3dl.apps.googleusercontent.com',
      callback: handleCredentialResponse,
    });

    google?.accounts.id.renderButton(document.querySelector('#googleLogin'), {
      size: 'large',
      text: 'Google 로그인',
      width: 330,
    });
    // google.accounts.id.prompt();
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <>
      <div id='googleLogin' />
      {/* 디버그 정보 표시 (개발 환경에서만) */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '5px',
            fontSize: '12px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {debugInfo}
        </div>
      )}
    </>
  );
}
