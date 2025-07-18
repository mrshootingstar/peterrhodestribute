'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export function PhotoGallery() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [photos] = useState([
    '/photos/Peter-Rhodes-1.jpeg',
    '/photos/Peter-Rhodes-2.jpeg',
    '/photos/Peter-Rhodes-3.jpeg',
    '/photos/Peter-Rhodes-4.jpeg',
    '/photos/Peter-Rhodes-5.jpeg',
    '/photos/Peter-Rhodes-6.jpeg',
    '/photos/Peter-Rhodes-7.jpeg',
  ]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  if (photos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-white mb-4">
            Memorial Photos
          </h3>
          <p className="text-gray-300">
            No photos available at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
        Cherished Memories
      </h3>
      
      {/* Main carousel container */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-4 md:p-8 border border-gray-200">
        {/* Main image display */}
        <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={photos[currentImageIndex]}
            alt={`Memorial photo ${currentImageIndex + 1} of Peter Frederick Rhodes`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            priority={currentImageIndex === 0}
          />
          
          {/* Navigation arrows */}
          <button
            onClick={prevImage}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 md:p-3 rounded-full transition-all duration-200 z-10"
            aria-label="Previous image"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 md:p-3 rounded-full transition-all duration-200 z-10"
            aria-label="Next image"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-black bg-opacity-50 text-white px-2 md:px-3 py-1 md:py-2 rounded-full text-sm md:text-base">
            {currentImageIndex + 1} / {photos.length}
          </div>
        </div>

        {/* Thumbnail navigation */}
        <div className="flex justify-center mt-4 md:mt-6 space-x-2 md:space-x-3 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Image
                src={photo}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 48px, 64px"
              />
            </button>
          ))}
        </div>

        {/* Progress dots (alternative to thumbnails on very small screens) */}
        <div className="flex justify-center mt-4 space-x-2 md:hidden">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 