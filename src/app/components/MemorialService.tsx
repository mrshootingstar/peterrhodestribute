export function MemorialService() {
  return (
    <section className="mb-8 sm:mb-10 lg:mb-12">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-300" style={{backgroundColor: '#e5e5e5'}}>
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8" style={{color: '#1f2937'}}>
              Memorial Service
            </h3>
            
            <div className="mb-6 sm:mb-8 max-w-4xl mx-auto">
              <p className="text-lg sm:text-xl md:text-2xl leading-relaxed mb-6" style={{color: '#374151'}}>
                The Memorial service for Professor Peter Rhodes will be held virtually and in-person
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="text-xl sm:text-2xl md:text-3xl font-semibold" style={{color: '#1f2937'}}>
                  Saturday, August 30
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-medium" style={{color: '#1f2937'}}>
                  11:30 - 14:00
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-medium" style={{color: '#1f2937'}}>
                  Chung Chi College Chapel, CUHK
                </div>
              </div>
            </div>
            
            <a
              href="https://lu.ma/1zg5ulvh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gray-800 hover:bg-gray-700 text-gray-100 font-semibold text-lg sm:text-xl rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
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