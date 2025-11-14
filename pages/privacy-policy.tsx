import SEO from '@components/seo';
import type { NextPage } from 'next';
import type { GetStaticProps } from 'next';
import Layout from '@layouts/sectionLayout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface PrivacyPolicyProps {
  locale: string;
}

const PrivacyPolicy: NextPage<PrivacyPolicyProps> = ({ locale }) => {
  const { t } = useTranslation('privacy');

  return (
    <>
      <SEO
        title={t('pageTitle') as string}
        description={t('pageDescription') as string}
      />
      <Layout padding='py-20 md:py-12'>
        <div className='rounded-lg bg-[#373c46] p-[3.75rem] text-[#cfcfcf] md:p-4 md:text-xs'>
          <span className='font-bold text-white'>{t('pageTitle')}</span>
          <br /> <br />
          <p>
            <span dangerouslySetInnerHTML={{ __html: t('intro') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section1Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section1Intro') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section1Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section1Item2') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section1Item3') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section2Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section2Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section2Item2') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section2Item3') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section2Item4') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section3Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section3Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section3Item2') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section3Item3') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section4Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section4Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section4Item2') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section4Item3') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section4Item4') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section5Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section5Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section5Item2') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section5Item3') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section5Item4') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section5Item5') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section5Item6') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section6Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section6Intro') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section6Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section6Item1Required') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section6Item1Optional') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section6Item2') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section6Item2Required') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section6Item2Optional') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section6Item3') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section6Item3Auto') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section7Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section7Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section7Item2') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section7Item3') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section7Item4') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section7Item5') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section8Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section8Intro') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section8Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section8Item2') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section8Item3') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section9Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section9Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section9Item2') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section9Item3') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section9Item4') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section9Item5') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section10Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section10Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section10Item2') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section10Item3') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section10Item4') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section11Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section11Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section11Item2') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section12Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section12Intro') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section12Desc') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section12Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section12Item2') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section12Item3') }} />
            <br /><br />

            <span dangerouslySetInnerHTML={{ __html: t('section13Title') }} />
            <br /><br />
            <span dangerouslySetInnerHTML={{ __html: t('section13Item1') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section13Item2') }} />
            <br />
            <span dangerouslySetInnerHTML={{ __html: t('section13Item3') }} />
            <br />
          </p>
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'privacy'])),
      locale: locale ?? 'ko',
    },
  };
};

export default PrivacyPolicy;
