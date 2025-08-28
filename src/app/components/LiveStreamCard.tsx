"use client";

export default function LiveStreamCard() {
  return (
    <section className="mb-8 sm:mb-10 lg:mb-12">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 border border-gray-700">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 text-center leading-tight">
          Live Streaming Link
        </h2>

        <hr className="w-20 sm:w-24 md:w-32 border-t border-gray-400 mx-auto mb-6 sm:mb-8 lg:mb-10" />

        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 text-center mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-2 sm:px-4">
          For those unable to attend in person, the memorial event will be live streamed via the following link.
        </p>

        <div className="relative w-full overflow-hidden rounded-lg sm:rounded-xl shadow-lg">
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/9zg5se87sag"
              title="In Loving Memory of Professor Peter Frederick Rhodes Live Stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-lg sm:rounded-xl border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
