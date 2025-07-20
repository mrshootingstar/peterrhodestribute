'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

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

  const handleImageClick = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  const closeExpandedImage = () => {
    setExpandedImage(null);
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
    <>
      <div className="space-y-8">
        {tributes.map((tribute) => (
          <article
            key={tribute.id}
            className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 hover:shadow-blue-500/10"
          >
            {tribute.image_url && (
              <div className="relative w-full bg-gray-900">
                <div 
                  className="relative w-full min-h-[200px] max-h-[600px] cursor-pointer group"
                  onClick={() => handleImageClick(tribute.image_url!)}
                >
                  <Image
                    src={tribute.image_url}
                    alt="Memorial photo shared with tribute"
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain max-h-[600px] transition-transform duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                  {/* Overlay to indicate clickable */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full p-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
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
                <p className="text-gray-200 leading-relaxed text-xl md:text-2xl whitespace-pre-wrap italic pl-8 pr-8">
                  {tribute.message}
                </p>
                <div className="absolute -bottom-4 -right-2 text-5xl text-blue-400/30 font-serif transform rotate-180">&ldquo;</div>
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

      {/* Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeExpandedImage}
        >
          <div className="relative max-w-full max-h-full">
            <button
              onClick={closeExpandedImage}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Image
              src={expandedImage}
              alt="Expanded memorial photo"
              width={1200}
              height={900}
              className="max-w-full max-h-[90vh] object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  );
} 