import { TributeCard } from './TributeCard';

export function OfficialTributes() {
  return (
    <section className="mb-12 sm:mb-14 lg:mb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-6 sm:mb-8">
          Official Tributes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          <TributeCard
            title="Memorial Booklet"
            subtitle="In Loving Memory of Peter Frederick Rhodes (1948 – 2025)"
            links={[
              {
                href: 'https://online.fliphtml5.com/Rhodes/rnwg/#p=1',
                label: 'View Booklet',
              },
            ]}
          />
          <TributeCard
            title="CUHK Faculty of Law"
            subtitle="With Heartfelt Remembrance: Professor Peter Frederick Rhodes"
            links={[
              {
                href: 'https://www.law.cuhk.edu.hk/app/with-heartfelt-remembrance-professor-peter-frederick-rhodes/',
                label: 'Read Tribute',
              },
            ]}
          />
          <TributeCard
            title="HKU Faculty of Law"
            subtitle="In Loving Memory of Professor Peter Rhodes"
            links={[
              {
                href: 'https://www.law.hku.hk/news/in-loving-memory-of-professor-peter-rhodes/',
                label: 'Read Tribute',
              },
            ]}
          />
          <TributeCard
            title="The Law Society of Hong Kong"
            subtitle="President's Letter of Condolence"
            links={[
              {
                href: '/pdf/LSHK-Presidents-Letter-24-July-2025-Heartfelt-Condolences-on-the-Passing-of-Prof-Peter-Rhodes.pdf',
                label: 'Read Letter',
              },
            ]}
          />
          <TributeCard
            title="Vis East Moot Foundation"
            subtitle="Memorial Tribute to Professor Peter Rhodes"
            links={[
              {
                href: 'https://www.linkedin.com/posts/vis-east-moot-foundation-ltd_the-vis-east-moot-administration-is-sad-to-activity-7353247302758682627-nGMx/',
                label: 'Read Tribute',
              },
            ]}
          />
          <TributeCard
            title="Law Reform Commission of Hong Kong"
            subtitle="In warm remembrance of and heartfelt thanks to Professor Peter Rhodes"
            links={[
              {
                href: 'https://www.hkreform.gov.hk/en/news/newsXML.htm?newsDate=20250808&selectedSubSection=4&jumpToDetails=y#newsDetails',
                label: 'English',
              },
              {
                href: 'https://www.hkreform.gov.hk/tc/news/newsXML.htm?newsDate=20250808&selectedSubSection=4&jumpToDetails=y#newsDetails',
                label: '中文',
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
