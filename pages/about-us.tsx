import SEO from '@components/seo';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Image from "next/image";
import AboutUsImage from "@public/home/about-us.jpeg";
import Signature from "@public/home/signature.png";
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const AboutUs: NextPage = () => {
  const { t } = useTranslation('about');

  useEffect(() => {
    console.log('AboutUs');
  }, [])
  return (
    <>
      <SEO
        title={t('pageTitle') as string}
        description={t('pageDescription') as string}
      />
      <div style={{padding: '100px', textAlign: 'center', width: '100%', fontWeight: 700,
        fontSize: '32px',
        lineHeight: '46px',
        background: 'rgba(0, 0, 0, 0.2)',
        color: '#FFFFFF'}}>
        <p>
          {t('bannerTitle')}
        </p>
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <div className="flex p-[60px] flex-col max-w-[1024px] md:max-w-[330px] md:p-0 md:pt-[48px] md:pb-[48px]" >
          <div className="flex md:flex-col">
            <div className="flex max-w-[480px] mr-[40px] mb-[32px] md:mb-[24px] md:mr-0 object-contain">
              <Image
                src={AboutUsImage}
                alt={t('ceoImageAlt') as string}
                objectFit='cover'
                placeholder='blur'
                quality={100}
                objectPosition='top'
              />
            </div>
            <div style={{
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '160%',
            }}>
              <div dangerouslySetInnerHTML={{ __html: t('greeting') }} />
              <div dangerouslySetInnerHTML={{ __html: t('companyIntro') }} />
              <div dangerouslySetInnerHTML={{ __html: t('coreValues') }} />
              <div dangerouslySetInnerHTML={{ __html: t('experience') }} />
            </div>
          </div>
          <div>
            <div dangerouslySetInnerHTML={{ __html: t('philosophy') }} />
            <div dangerouslySetInnerHTML={{ __html: t('mission') }} />
            <div dangerouslySetInnerHTML={{ __html: t('promise') }} />
            <div dangerouslySetInnerHTML={{ __html: t('supportMessage') }} />
            <div dangerouslySetInnerHTML={{ __html: t('coreValue') }} />
            <div dangerouslySetInnerHTML={{ __html: t('thankYou') }} />
            {t('signature')}<span
  style={{
    position: 'absolute',
    width: '100px',
    marginLeft: '10px',
    marginTop: '-5px',
  }}
><Image
                src={Signature}
                alt={t('ceoSignatureAlt') as string}
                objectFit='cover'
                placeholder='blur'
                quality={100}
                objectPosition='top'
              /></span>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale || 'en', ['common', 'about'])),
    },
  };
};

export default AboutUs;
