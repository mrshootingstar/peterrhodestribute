import { TributeForm } from './components/TributeForm';
import { PhotoGallery } from './components/PhotoGallery';
import { TributesList } from './components/TributesList';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight">
            In Loving Memory
          </h1>
        </header>

        {/* Photo Gallery */}
        <section className="mb-8 sm:mb-10 lg:mb-12">
          <PhotoGallery />
        </section>

        {/* Memorial Information */}
        <section className="text-center mb-12 sm:mb-14 lg:mb-16">
          <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 border border-gray-700">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
              Peter Frederick Rhodes
            </h2>
            <div className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-4 sm:mb-6 lg:mb-8 font-semibold">
              1948 - 2025
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed italic px-2 sm:px-4">
              Forever Treasured Husband, Father, Brother, and Professor
            </p>
          </div>
        </section>

        {/* Official University Tributes */}
        <section className="mb-12 sm:mb-14 lg:mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-6 sm:mb-8 px-4">
              Official University Tributes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <a
                href="https://www.law.cuhk.edu.hk/app/with-heartfelt-remembrance-professor-peter-frederick-rhodes/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700 hover:border-blue-500 transition-all duration-200 hover:shadow-blue-500/20"
              >
                <div className="text-center">
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    CUHK Faculty of Law
                  </h4>
                  <p className="text-gray-300 text-sm sm:text-base mb-4 leading-relaxed">
                    With Heartfelt Remembrance: Professor Peter Frederick Rhodes
                  </p>
                  <div className="flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span className="text-sm font-medium">Read Tribute</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </a>

              <a
                href="https://www.law.hku.hk/news/in-loving-memory-of-professor-peter-rhodes/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700 hover:border-blue-500 transition-all duration-200 hover:shadow-blue-500/20"
              >
                <div className="text-center">
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    HKU Faculty of Law
                  </h4>
                  <p className="text-gray-300 text-sm sm:text-base mb-4 leading-relaxed">
                    In Loving Memory of Professor Peter Rhodes
                  </p>
                  <div className="flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span className="text-sm font-medium">Read Tribute</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Tribute Submission Section */}
        <section className="mb-12 sm:mb-14 lg:mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-6 sm:mb-8 px-4">
              Share Your Memories
            </h3>
            <div className="bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-700">
              <TributeForm />
            </div>
          </div>
        </section>

        {/* Approved Tributes */}
        <section className="mb-8 sm:mb-12 lg:mb-16">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-8 sm:mb-10 lg:mb-12 px-4">
              Tributes & Memories
            </h3>
            <TributesList />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-12 sm:mt-16 lg:mt-20 py-6 sm:py-8 border-t border-gray-700">
          <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Peter Rhodes Memorial
          </h4>
          <p className="text-gray-300 text-sm sm:text-base px-4 leading-relaxed">
            A place to remember, share, and celebrate Peter&apos;s life
          </p>
        </footer>
      </div>
    </div>
  );
}
