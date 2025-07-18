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
    <div className="space-y-8">
      {tributes.map((tribute) => (
        <article
          key={tribute.id}
          className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 hover:shadow-blue-500/10"
        >
          {tribute.image_url && (
            <div className="relative w-full h-64 md:h-80">
              <Image
                src={tribute.image_url}
                alt="Memorial photo shared with tribute"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-gray-700">
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-xl md:text-2xl font-semibold text-white">
                  {tribute.name}
                </h4>
              </div>
              <time className="text-sm text-gray-400 font-medium">
                {formatDate(tribute.created_at)}
              </time>
            </header>
            
            <blockquote className="relative">
              <div className="absolute -top-2 -left-2 text-4xl text-blue-400/30 font-serif">&ldquo;</div>
              <p className="text-gray-200 leading-relaxed text-lg md:text-xl whitespace-pre-wrap italic pl-6 pr-6">
                {tribute.message}
              </p>
              <div className="absolute -bottom-4 -right-2 text-4xl text-blue-400/30 font-serif transform rotate-180">&ldquo;</div>
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
  );
} 