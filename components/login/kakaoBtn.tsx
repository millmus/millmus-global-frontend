import axios from 'axios';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from "next/image";
import kakao from "@public/icons/kakao.png";
import { useEffect } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface IProps {
  className: string;
  is_signup: boolean;
}

export default function KakaoBtn({ className, is_signup }: IProps) {
  const { mutate } = useSWR('/api/user');
  const router = useRouter();

  const APP_KEY = '1e7d46f694c6be65caa45eb5ecb2f55a';
  useEffect(() => {
    const { Kakao } = window;
    if (!Kakao) {
      const script = document.createElement('script');
      script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
      script.async = true;
      document.body.appendChild(script);
      // return () => document.body.removeChild(script);
    }
  }, []);

  const kakaoAuth = async () => {
    const { Kakao } = window;
    if (Kakao) {
      if (!Kakao.isInitialized()) {
        Kakao.init(APP_KEY);
      }

      if (is_signup) {
        try {
          await Kakao.API.request({
            url: '/v1/user/unlink',
          });
        } finally {
          kakaoLogin(Kakao);
        }
      } else {
        kakaoLogin(Kakao);
      }
      // Kakao.Channel.addChannel({ channelPublicId: '_eixhCG' });
    }
  }
  const kakaoLogin = (Kakao: any) => {
    Kakao.Auth.login({
      success: async () => {
        console.log('kakao login success');

        Kakao.API.request({
          url: '/v2/user/me',
          success: async (res: any) => {
            console.log('kakao login success res', res);

            const kakao_account = res.kakao_account;
            let phone_number = kakao_account.phone_number;
            if (phone_number) { /*
              * kakao api returns '+82 10-...'
              */
              phone_number = phone_number.trim();
              if (phone_number.startsWith("+82")) {
                phone_number = phone_number.replace('+82', '').trim();
              }
              if (phone_number.startsWith("10")) {
                phone_number = `0${phone_number}`;
              }
              phone_number = phone_number.replaceAll("-", "").trim();
            }

            console.log('kakao_account', kakao_account);

            const body = {
              type: 'kakao',
              id: res.id + '',
              phone_number: phone_number,
              nickname: kakao_account.profile.nickname,
              is_signup,
            };
            if (is_signup) {
              const { data: { channels } } = await axios({
                url: `https://kapi.kakao.com/v2/api/talk/channels?target_id=${res.id}&target_id_type=user_id&channel_ids=_eixhCG&channel_id_type=channel_public_id`,
                method: 'get',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'KakaoAK bf5463fa144a0ec0e16d7f74e9e98f86',
                },
              });
              let ad_agree = false; // "BLOCKED"
              if (channels) ad_agree = channels[0].relation == "ADDED" ? true : false;

              Object.assign(body, { ad_agree });

              // @ts-ignore
              window.ChannelIO('updateUser', {
                profile: {
                  mobileNumber: phone_number,
                  name: kakao_account.profile.nickname,
                },
                tags: ["간편가입연동"],
                unsubscribeEmail: !ad_agree,
                unsubscribeTexting: !ad_agree,
              }, function onUpdateUser(error: any, user: any) {
                if (error) {
                  console.error('updateUser', error);
                }
              });
            }
            console.log('body', body);


            const { data: { msg }, } = await axios.post('/api/login', body);

            console.log('msg', msg);

            if (msg == 'phone_number exists') {
              alert("이미 가입된 아이디가 있습니다.");
            } else if (msg == 'need to signup') {
              try {
                await Kakao.API.request({
                  url: '/v1/user/unlink',
                });
              } finally {
                is_signup = true;
                kakaoLogin(Kakao);
              }
            } else {
              is_signup = false;
              const {
                data: { token, profile },
              } = await axios.get('/api/user');
              mutate({ ok: true, token, profile });
            }
          },
          fail: (e: any) => {
            console.log(e);
          },
        });
      },
      fail: (e: any) => {
        console.log(e);
      },
    });
  }

  return (
    <div
      onClick={kakaoAuth}
      className={className}
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
