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
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-slate-600 mt-4">Loading tributes...</p>
      </div>
    );
  }

  if (tributes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-3xl shadow-lg p-12 border border-slate-200">
          <h3 className="text-2xl font-semibold text-slate-700 mb-4">
            No tributes yet
          </h3>
          <p className="text-slate-600">
            Be the first to share a memory of Peter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {tributes.map((tribute) => (
        <div
          key={tribute.id}
          className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-start space-x-6">
            {tribute.image_url && (
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={tribute.image_url}
                    alt="Tribute photo"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              </div>
            )}
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-slate-800">
                  {tribute.name}
                </h4>
                <span className="text-sm text-slate-500">
                  {formatDate(tribute.created_at)}
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {tribute.message}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 