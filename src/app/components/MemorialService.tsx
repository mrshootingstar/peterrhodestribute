export function MemorialService() {
  return (
    <section className="mb-12 sm:mb-14 lg:mb-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-stone-100 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-stone-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-slate-800 rounded-full mb-4 sm:mb-6">
              <svg 
                className="w-6 h-6 sm:w-8 sm:h-8 text-stone-100" 
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
            </div>
            
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4 sm:mb-6">
              Memorial Service
            </h3>
            
            <p className="text-slate-700 text-lg sm:text-xl md:text-2xl leading-relaxed mb-6 sm:mb-8 max-w-4xl mx-auto">
              The Memorial service for Professor Peter Rhodes will be held virtually and in-person on{' '}
              <span className="font-semibold text-slate-800">Saturday, August 30</span>.
            </p>
            
            <a
              href="https://lu.ma/1zg5ulvh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-slate-800 text-stone-100 font-semibold text-lg sm:text-xl rounded-lg hover:bg-slate-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Information and RSVP HERE
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6 ml-2 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}