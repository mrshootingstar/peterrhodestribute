export function MemorialService() {
  return (
    <section className="mb-6 sm:mb-8 lg:mb-10">
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-300 relative overflow-hidden"
          style={{ backgroundColor: "#e5e5e5" }}
        >
          <div className="text-center relative z-10">
            <div className="mb-3 sm:mb-4">
              <h3
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 tracking-tight"
                style={{ color: "#0f172a" }}
              >
                Memorial Service
              </h3>
              <div className="w-20 h-0.5 bg-slate-900 mx-auto rounded-full opacity-40"></div>
            </div>

            <div className="mb-4 sm:mb-5 max-w-4xl mx-auto">
              <p className="text-lg sm:text-xl md:text-2xl leading-snug mb-3 font-medium" style={{ color: "#0f172a" }}>
              The Memorial service for Professor Peter Rhodes will be at CUHK on Saturday, August 30. For those unable to attend in person, details of a live stream of the event will be provided closer to time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {/* Date & Time Column */}
                <div className="flex items-center gap-4">
                  <svg
                    className="w-6 h-6 text-slate-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="text-xl font-bold text-slate-900">Saturday, August 30</div>
                    <div className="text-lg text-slate-700 font-medium">11:30 AM - 2:00 PM GMT+8</div>
                  </div>
                </div>

                {/* Location Column */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-slate-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div>
                    <div className="text-xl font-bold text-slate-900">Chung Chi College Chapel</div>
                    <div className="text-base text-slate-600">New Territories</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-3">
              <a
                href="https://lu.ma/1zg5ulvh"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg sm:text-xl rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center">
                  Information and RSVP HERE
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
