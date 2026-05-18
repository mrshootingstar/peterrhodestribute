import { TributeCard } from './TributeCard';

export function OfficialTributes() {
  return (
    <section className="mb-12 sm:mb-14 lg:mb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-8 sm:mb-10">
          Official Tributes
        </h3>

        {/* Featured: family memorial booklet */}
        <a
          href="https://online.fliphtml5.com/Rhodes/rnwg/#p=1"
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700 hover:border-amber-200/40 transition-all duration-300 hover:shadow-amber-200/10"
        >
          <div className="text-center py-12 sm:py-16 lg:py-20 px-6 sm:px-10 lg:px-16">
            <p className="text-[0.7rem] sm:text-xs tracking-[0.35em] uppercase text-amber-200/70 mb-6 sm:mb-8 font-light">
              In Loving Memory
            </p>
            <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
              Peter Frederick Rhodes
            </h4>

            <div className="flex items-center justify-center my-8 sm:my-10" aria-hidden="true">
              <span className="h-px w-16 sm:w-24 bg-amber-200/30" />
              <span className="mx-4 text-amber-200/60 text-sm">◆</span>
              <span className="h-px w-16 sm:w-24 bg-amber-200/30" />
            </div>

            <div className="inline-flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
              <span className="text-sm sm:text-base font-medium tracking-wide">
                View Memorial Booklet
              </span>
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </a>

        {/* Section divider for institutional tributes */}
        <div className="flex items-center justify-center my-12 sm:my-16">
          <span className="h-px flex-1 max-w-[5rem] sm:max-w-[8rem] bg-gray-700" />
          <p className="mx-5 text-[0.7rem] sm:text-xs tracking-[0.3em] uppercase text-gray-500 font-medium">
            Institutional Tributes
          </p>
          <span className="h-px flex-1 max-w-[5rem] sm:max-w-[8rem] bg-gray-700" />
        </div>

        {/* Institutional tributes row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          <TributeCard
            title="CUHK Faculty of Law"
            links={[
              {
                href: 'https://www.law.cuhk.edu.hk/app/with-heartfelt-remembrance-professor-peter-frederick-rhodes/',
                label: 'Read Tribute',
              },
            ]}
          />
          <TributeCard
            title="HKU Faculty of Law"
            links={[
              {
                href: 'https://www.law.hku.hk/news/in-loving-memory-of-professor-peter-rhodes/',
                label: 'Read Tribute',
              },
            ]}
          />
          <TributeCard
            title="The Law Society of Hong Kong"
            links={[
              {
                href: '/pdf/LSHK-Presidents-Letter-24-July-2025-Heartfelt-Condolences-on-the-Passing-of-Prof-Peter-Rhodes.pdf',
                label: 'Read Letter',
              },
            ]}
          />
          <TributeCard
            title="Vis East Moot Foundation"
            links={[
              {
                href: 'https://www.linkedin.com/posts/vis-east-moot-foundation-ltd_the-vis-east-moot-administration-is-sad-to-activity-7353247302758682627-nGMx/',
                label: 'Read Tribute',
              },
            ]}
          />
          <TributeCard
            title="Law Reform Commission of Hong Kong"
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
