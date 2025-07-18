import Image from 'next/image';
import { TributeForm } from './components/TributeForm';
import { PhotoGallery } from './components/PhotoGallery';
import { TributesList } from './components/TributesList';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            In Loving Memory
          </h1>
        </header>

        {/* Photo Gallery */}
        <section className="mb-12">
          <PhotoGallery />
        </section>

        {/* Memorial Information */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-12 border border-slate-200">
            <h2 className="text-6xl font-bold text-slate-800 mb-6">
              Peter Frederick Rhodes
            </h2>
            <div className="text-3xl text-slate-600 mb-8 font-semibold">
              1948 - 2025
            </div>
            <p className="text-2xl text-slate-700 leading-relaxed italic">
              Forever Treasured Husband, Father, Brother, and Professor
            </p>
          </div>
        </section>

        {/* Tribute Submission Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-center text-slate-800 mb-8">
              Share Your Memories
            </h3>
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
              <TributeForm />
            </div>
          </div>
        </section>

        {/* Approved Tributes */}
        <section>
          <div className="max-w-6xl mx-auto">
            <h3 className="text-4xl font-bold text-center text-slate-800 mb-12">
              Tributes & Memories
            </h3>
            <TributesList />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-20 py-8 border-t border-slate-200">
          <p className="text-slate-600">
            "Those we love don't go away, they walk beside us every day."
          </p>
        </footer>
      </div>
    </div>
  );
}
