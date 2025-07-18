'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export function PhotoGallery() {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    // In a real implementation, you'd fetch the list of photos from an API
    // For now, we'll use a placeholder approach
    // You'll need to manually add your photos to public/photos/
    const samplePhotos = [
      '/photos/sample1.jpg',
      '/photos/sample2.jpg',
      '/photos/sample3.jpg',
    ];
    setPhotos(samplePhotos);
  }, []);

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-3xl shadow-lg p-12 border border-slate-200 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-slate-700 mb-4">
            Memorial Photos
          </h3>
          <p className="text-slate-600">
            Please add photos to the <code className="bg-slate-100 px-2 py-1 rounded">public/photos/</code> directory.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Supported formats: JPG, PNG, WEBP
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
      <h3 className="text-3xl font-bold text-center text-slate-800 mb-8">
        Cherished Memories
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <Image
              src={photo}
              alt={`Memorial photo ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 