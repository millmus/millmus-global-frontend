import { gradeImg } from '@components/grade';
import SEO from '@components/seo';
import Layout from '@layouts/sectionLayout';
import type { GetServerSidePropsContext, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const EditProfile: NextPage = () => {
  const { t } = useTranslation('grade');

  return (
    <>
      <SEO title={t('pageTitle')} />
      <Layout padding='pt-20 pb-36 md:pt-4 md:pb-8'>
        <div className='text-2xl font-bold md:text-center md:text-lg md:font-medium'>
          {t('title')}
        </div>

        <div className='mt-10 flex divide-x divide-black md:mt-4 md:hidden'>
          <div className='w-[12.5rem] divide-y divide-black bg-[#4a4e57]'>
            <div className='h-[3.75rem] ' />
            <div className='flex h-40 items-center justify-center'>
              {t('table.memberGrade')}
            </div>
            <div className='flex h-40 items-center justify-center'>
              {t('table.gradeConditions')}
            </div>
            <div className='flex h-40 items-center justify-center'>{t('table.benefits')}</div>
          </div>

          <div className='flex grow divide-x divide-black'>
            <div className='w-1/3 divide-y divide-black'>
              <div className='flex h-[3.75rem] items-center justify-center bg-[#4a4e57]'>
                {t('stages.stage1')}
              </div>
              <div className='flex h-40 flex-col items-center justify-center space-y-4 bg-[#373c46]'>
                <div className='flex aspect-square w-[3.75rem] items-center justify-center rounded-full bg-[rgba(0,0,0,0.22)]'>
                  <div className='relative aspect-square w-6'>
                    {gradeImg('1')}
                  </div>
                </div>
                <div>{t('grades.spark')}</div>
              </div>
              <div className='flex h-40 items-center justify-center bg-[#373c46]'>
                {t('conditions.signupAchievement')}
              </div>
              <div className='flex h-40 items-center justify-center bg-[#373c46]'>
                {t('benefits.tenThousandPoints')}
              </div>
            </div>

            <div className='w-1/3 divide-y divide-black'>
              <div className='flex h-[3.75rem] items-center justify-center bg-[#4a4e57]'>
                {t('stages.stage2')}
              </div>
              <div className='flex h-40 flex-col items-center justify-center space-y-4 bg-[#373c46]'>
                <div className='flex aspect-square w-[3.75rem] items-center justify-center rounded-full bg-[rgba(0,0,0,0.22)]'>
                  <div className='relative aspect-square w-6'>
                    {gradeImg('2')}
                  </div>
                </div>
                <div>{t('grades.flame')}</div>
              </div>
              <div className='flex h-40 items-center justify-center bg-[#373c46] text-center'>
                {t('conditions.oneLectureOrMore')}
                <br />
                {t('conditions.twoCommunityOrMore')}
              </div>
              <div className='flex h-40 items-center justify-center bg-[#373c46] text-center'>
                {t('benefits.freeCommunityPriority')}
              </div>
            </div>

            <div className='w-1/3 divide-y divide-black'>
              <div className='flex h-[3.75rem] items-center justify-center bg-[#4a4e57]'>
                {t('stages.stage3')}
              </div>
              <div className='flex h-40 flex-col items-center justify-center space-y-4 bg-[#373c46]'>
                <div className='flex aspect-square w-[3.75rem] items-center justify-center rounded-full bg-[rgba(0,0,0,0.22)]'>
                  <div className='relative aspect-square w-6'>
                    {gradeImg('3')}
                  </div>
                </div>
                <div>{t('grades.fire')}</div>
              </div>
              <div className='flex h-40 items-center justify-center bg-[#373c46] text-center'>
                {t('conditions.threeLecturesOrMore')}
                <br />
              </div>
              <div className='flex h-40 items-center justify-center bg-[#373c46] text-center'>
                {t('benefits.paidCommunityPriority')}
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4 hidden md:block'>
          <div className='flex h-[10.688rem] justify-between bg-[#373d46] p-6'>
            <div className=''>
              <div className='text-xl font-medium'>{t('grades.spark')}</div>
              <div className='mt-[0.375rem] font-[#b1b1b1] text-xs'>
                {t('conditions.signupAchievement')}
              </div>
              <div className='mt-4 text-sm font-medium'>{t('benefits.tenThousandPoints')}</div>
            </div>
            <div className='h-[3.75rem] rounded-full bg-[#2b3037] p-[1.125rem]'>
              <div className='relative aspect-square w-6'>{gradeImg('1')}</div>
            </div>
          </div>
        </div>

        <div className='mt-2 hidden md:block'>
          <div className='flex h-[10.688rem] justify-between bg-[#373d46] p-6'>
            <div className=''>
              <div className='text-xl font-medium'>{t('grades.flame')}</div>
              <div className='mt-[0.375rem] font-[#b1b1b1] text-xs'>
                {t('conditions.oneLectureOrMore')}
                <br />
                {t('conditions.twoCommunityOrMore')}
              </div>
              <div className='mt-4 text-sm font-medium'>
                {t('benefits.freeCommunityPriority')}
              </div>
            </div>
            <div className='h-[3.75rem] rounded-full bg-[#2b3037] p-[1.125rem]'>
              <div className='relative aspect-square w-6'>{gradeImg('2')}</div>
            </div>
          </div>
        </div>

        <div className='mt-2 hidden md:block'>
          <div className='flex h-[10.688rem] justify-between bg-[#373d46] p-6'>
            <div className=''>
              <div className='text-xl font-medium'>{t('grades.fire')}</div>
              <div className='mt-[0.375rem] font-[#b1b1b1] text-xs'>
                {t('conditions.threeLecturesOrMore')}
              </div>
              <div className='mt-4 text-sm font-medium'>
                {t('benefits.paidCommunityPriority')}
              </div>
            </div>
            <div className='h-[3.75rem] rounded-full bg-[#2b3037] p-[1.125rem]'>
              <div className='relative aspect-square w-6'>{gradeImg('3')}</div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const locale = ctx.locale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'grade'])),
    },
  };
};

export default EditProfile;
