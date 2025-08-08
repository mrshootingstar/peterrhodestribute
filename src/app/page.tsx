import { TributeForm } from './components/TributeForm';
import { PhotoGallery } from './components/PhotoGallery';
import { TributesList } from './components/TributesList';
import { OfficialTributes } from './components/OfficialTributes';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight">
            In Memoriam
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
              Forever Treasured Husband, Father, Brother, Grandfather, and Professor
            </p>
          </div>
        </section>

        {/* Official University Tributes */}
        <OfficialTributes />

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
