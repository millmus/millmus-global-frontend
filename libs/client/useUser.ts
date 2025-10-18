import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

interface IProps {
  isPrivate?: boolean;
  skipRedirect?: boolean;  // 리다이렉트 스킵 옵션 추가
}

interface IProfile {
  [key: string]: any;
}

export interface IUser {
  ok: boolean;
  token: string | null;
  profile: IProfile | null;
}

export const useUser = ({ isPrivate = false, skipRedirect = false }: IProps) => {
  const { data, error, mutate } = useSWR<IUser>('/api/user');
  const router = useRouter();

  useEffect(() => {
    // skipRedirect가 true면 자동 리다이렉트 하지 않음
    if (skipRedirect) return;

    if (data && data.token && data.profile && !isPrivate) {
      router.back();
    }

    if (data && !data.token && !data.profile && isPrivate) {
      router.push('/login');
    }
  }, [data, router, skipRedirect]);

  return {
    isLoading: !data && !error,
    token: data?.token,
    profile: data?.profile,
    mutate,
  };
};
