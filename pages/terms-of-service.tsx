import SEO from '@components/seo';
import type { NextPage } from 'next';
import type { GetStaticProps } from 'next';
import Layout from '@layouts/sectionLayout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CONTACT_INFO } from '@/constants/contact';
import { formatLegalDate, EFFECTIVE_DATES } from '@/utils/dateFormatter';

interface TermsOfServiceProps {
  locale: string;
}

const TermsOfService: NextPage<TermsOfServiceProps> = ({ locale }) => {
  const { t } = useTranslation('terms');

  return (
    <>
      <SEO
        title={t('pageTitle') as string}
        description={t('pageDescription') as string}
      />
      <Layout padding='py-20 md:py-12'>
        <div className='rounded-lg bg-[#373c46] p-[3.75rem] text-[#cfcfcf] md:p-4 md:text-xs'>
          <span className='font-bold text-white'>{t('title')}</span>
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('effectiveDate') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section1Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section1Content') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section2Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section2Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section2Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section2Item3') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section3Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section3Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section3Item2') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section4Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section4Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section4Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section4Item3') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section4Item4') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section4Item5') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section4Item6') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section4Item7') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section5Title') }} />
          <br /> <br />
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
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section5Item7') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section6Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section6Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section6Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section6Item3') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section6Item4') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section6Item5') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section6Item6') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section6Item7') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section7Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section7Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section7Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section7Item3') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section7Item4') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section8Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section8Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section8Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section8Item3') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section8Item4') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section8Item5') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section9Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section9Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section9Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section9Item3') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section9Item4') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section9Item5') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section10Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section10Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section10Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section10Item3') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section10Item4') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section10Item5') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section10Item6') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section10Item7') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section11Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section11Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section11Item2') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section12Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section12Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section12Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section12Item3') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section13Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section13Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section13Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section13Item3') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section13Item4') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section14Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section14Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section14Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section14Item3') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section14Item4') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section14Item5') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section14Item6') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section15Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section15Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section15Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section15Item3') }} />
          <br />

          <span dangerouslySetInnerHTML={{ __html: t('section16Title') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section16Subtitle1') }} />
          <br />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section16Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section16Subtitle2') }} />
          <br />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section16Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section16Subtitle3') }} />
          <br />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section16Item3') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section16Item4') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section16Item5') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section17Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item2') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item3') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item4') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item5') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item6') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item7') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item8') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item9') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item10') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item11') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item12') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item13') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section17Item14') }} />
          <br /> <br />

          <span dangerouslySetInnerHTML={{ __html: t('section18Title') }} />
          <br /> <br />
          <span dangerouslySetInnerHTML={{ __html: t('section18Item1') }} />
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('section18Item2') }} />
        </div>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'ko', ['common', 'terms'])),
      locale: locale ?? 'ko',
    },
  };
};

export default TermsOfService;
