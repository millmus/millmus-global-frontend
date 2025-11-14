import SEO from '@components/seo';
import type { NextPage } from 'next';
import type { GetStaticProps } from 'next';
import Layout from '@layouts/sectionLayout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface RefundPolicyProps {
  locale: string;
}

const RefundPolicy: NextPage<RefundPolicyProps> = ({ locale }) => {
  const { t } = useTranslation('refund');

  return (
    <>
      <SEO
        title={t('pageTitle') as string}
        description={t('pageDescription') as string}
      />
      <Layout padding='py-20 md:py-12'>
        <div className='rounded-lg bg-[#373c46] p-[3.75rem] text-[#cfcfcf] md:p-4 md:text-xs'>
          <p className='font-bold text-white'>{t('guidelinesTitle')}</p><br />
          <span dangerouslySetInnerHTML={{ __html: t('guideline1') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('guideline2') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('guideline3') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('guideline4') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('guideline5') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('guideline6') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('guideline7') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('guideline8') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('guideline9') }} /><br />
          <br /><p className='font-bold text-white'>{t('policyTitle')}</p>

          <br /><p className='text-white'>{t('offlineSubtitle')}</p><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline1') }} /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('offline2') }} /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('offline3') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline4') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline5') }} /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('offline6') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline7') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline8') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline9') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline10') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline11') }} /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('offline12') }} /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('offline13') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline14') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline15') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline16') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline17') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline18') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('offline19') }} /><br />

          <br /><p className='text-white'>{t('onlineSubtitle')}</p><br />
          <span dangerouslySetInnerHTML={{ __html: t('online1') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online2') }} /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('online3') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online4') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online5') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online6') }} />   <br />
          <span dangerouslySetInnerHTML={{ __html: t('online7') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online8') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online9') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online10') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online11') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online12') }} /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('online13') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online14') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online15') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online16') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online17') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('online18') }} /><br />

          <br /><p className='text-white'>{t('vodSubtitle')}</p><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod1') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod2') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod3') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod4') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod5') }} /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('vod6') }} />  <br />
          <span dangerouslySetInnerHTML={{ __html: t('vod7') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod8') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod9') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod10') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod11') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod12') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod13') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod14') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod15') }} /><br />
          <span dangerouslySetInnerHTML={{ __html: t('vod16') }} /><br />
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'refund'])),
      locale: locale ?? 'ko',
    },
  };
};

export default RefundPolicy;
