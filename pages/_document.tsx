import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const pathname = ctx.pathname;

    return { ...initialProps, pathname };
  }
  render(): JSX.Element {
    const { pathname }: { pathname: string } = this.props as any;

    const isPathExcluded = (path: string) => {
      // 특정 경로를 조건에 따라 설정
      const excludedPaths = ['/lecture/my/', '/lectures/registered_lecture/', '/mypage', '/lecture/live'];
      return excludedPaths.some(excludedPath => path.includes(excludedPath));
    };
    
    return (
      <Html lang='ko'>
        <Head>
          {/* 캐노니컬 tag */}
          <link rel='canonical' href='https://xn--o22bp6a0zk.com/' />
          {/* opengraph image */}
          <meta
            property='og:image'
            content='https://millmus.com/og-image.png'
            // content='https://single-fire-copy.vercel.app/og-image.png'
          />
          {/* 네이버 SEO */}
          <meta
            name='naver-site-verification'
            content='36fd579c1e887428fa96c92606f33cc04e64076b'
          />
          <meta name="naver-site-verification" content="c270933eb0999716638d63fca220d9dae2a1a84f" />
          <meta name="naver-site-verification" content="630efce8a7c064b974c7246370031e10c7402241" />
          <meta
            name="facebook-domain-verification"
            content="5gngbqnu5m0ehcj2x65qrl96xvbcej"
          />
          {/* GA & GTM */}
          <script
            async
            src='https://www.googletagmanager.com/gtag/js?id=G-4X9J001FZC'
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-4X9J001FZC', {
                    page_path: window.location.pathname,
                  });
              `,
            }}
          />
          <link
            href='https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap'
            rel='stylesheet'
          />
          {/* 네이버 로그인 */}
          <script src='https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js'></script>
          {/* 카카오 로그인 - Head 내의 것은 삭제 */}
          {/* <script src='https://developers.kakao.com/sdk/js/kakao.min.js'></script> */}
          {/* 구글 로그인 */}
          <script
            src='https://accounts.google.com/gsi/client'
            async
            defer
          ></script>
          {/* jQuery */}
          <script
            type='text/javascript'
            src='https://code.jquery.com/jquery-1.12.4.min.js'
          ></script>
          {/* iamport.payment.js */}
          <script
            type='text/javascript'
            src='https://cdn.iamport.kr/js/iamport.payment-1.1.8.js'
          ></script>
          {/* Meta Pixel Code */}
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '825807185786710');
      fbq('track', 'PageView');`,
            }} />
          <noscript dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=825807185786710&ev=PageView&noscript=1"
  />`,
          }} />

          {/** 특정경로의 경우 비활성화한다 */}
          {!isPathExcluded(pathname) && (
            <script dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T6CT94L');`
            }}
            />  
          )}
          <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js" integrity="sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6" crossOrigin="anonymous"></script>
        </Head>
        <body>
          <noscript dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T6CT94L"
                          height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }}>
          </noscript>
          <Main />
          <NextScript />
        </body>
        
      </Html>
    );
  }
}

export default CustomDocument;
