import type { AppProps } from 'next/app';
import Layout from '@layouts/layout';
import '@styles/global.css';
import { RecoilRoot } from 'recoil';
import { SWRConfig } from 'swr';
import axios from 'axios';
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => axios.get(url).then((res) => res.data),
      }}
    >
      <RecoilRoot>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RecoilRoot>
    </SWRConfig>
  );
}

export default appWithTranslation(MyApp);
