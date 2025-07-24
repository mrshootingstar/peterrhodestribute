'use client';

import { useState, useEffect } from 'react';
import { TributeMessage } from './TributeMessage';

interface Tribute {
  id: number;
  name: string;
  message: string;
  image_url?: string;
  created_at: string;
}

export function TributesList() {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25; // Fixed at 25 tributes per page

  useEffect(() => {
    fetchTributes();
  }, []);

  const fetchTributes = async () => {
    try {
      const response = await fetch('/api/tributes/approved');
      if (response.ok) {
        const data = await response.json();
        setTributes(data.tributes);
      } else {
        console.error('Failed to fetch tributes');
      }
    } catch (error) {
      console.error('Error fetching tributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Pagination logic
  const totalTributes = tributes.length;
  const totalPages = Math.ceil(totalTributes / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTributes = tributes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the first tribute on the new page
    setTimeout(() => {
      const tributesList = document.getElementById('tributes-list');
      if (tributesList) {
        tributesList.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Small delay to ensure the new content is rendered
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        <p className="text-gray-300 mt-4">Loading tributes...</p>
      </div>
    );
  }

  if (tributes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-12 border border-gray-700">
          <h3 className="text-2xl font-semibold text-white mb-4">
            No tributes yet
          </h3>
          <p className="text-gray-300">
            Be the first to share a memory of Peter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="tributes-section">
      {/* Pagination Info */}
      {totalPages > 1 && (
        <div className="text-center mb-8">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-4 border border-gray-700 inline-block">
            <span className="text-gray-300 font-medium">
              Showing {startIndex + 1}-{Math.min(endIndex, totalTributes)} of {totalTributes} tributes
            </span>
          </div>
        </div>
      )}

      {/* Tributes List */}
      <div id="tributes-list" className="space-y-8">
        {currentTributes.map((tribute) => (
          <article
            key={tribute.id}
            className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 hover:shadow-blue-500/10"
          >
            {tribute.image_url && (
              <div className="relative w-full flex justify-center items-center bg-gray-800 rounded-t-3xl overflow-hidden">
                <img
                  src={tribute.image_url}
                  alt="Memorial photo shared with tribute"
                  className="max-w-full max-h-[500px] h-auto object-contain"
                  loading="lazy"
                />
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-gray-700">
                <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="text-2xl md:text-3xl font-semibold text-white">
                    {tribute.name}
                  </h4>
                </div>
                <time className="text-base text-gray-400 font-medium">
                  {formatDate(tribute.created_at)}
                </time>
              </header>
              
              <blockquote className="relative">
                <div className="absolute -top-2 -left-2 text-5xl text-blue-400/30 font-serif">&ldquo;</div>
                {/* 
                  Using responsive truncation for public tributes:
                  - Mobile: 15 lines before truncating
                  - Desktop: 8 lines before truncating
                */}
                <TributeMessage 
                  message={tribute.message} 
                  mobileMaxLines={15}
                  desktopMaxLines={8}
                />
              </blockquote>
              
              <footer className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">In loving memory</span>
                  </div>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-transparent"></div>
                </div>
              </footer>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {/* Show page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 bg-gray-700 border border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
            
            {/* Page info */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 