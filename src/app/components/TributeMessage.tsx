'use client';

import { useState, useRef, useEffect } from 'react';

interface TributeMessageProps {
  message: string;
  maxLines?: number;
}

export function TributeMessage({ message, maxLines = 7 }: TributeMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkIfTruncated = () => {
      if (messageRef.current) {
        const lineHeight = parseInt(getComputedStyle(messageRef.current).lineHeight);
        const maxHeight = lineHeight * maxLines;
        const actualHeight = messageRef.current.scrollHeight;
        setShouldShowReadMore(actualHeight > maxHeight);
      }
    };

    checkIfTruncated();
    
    // Recheck on window resize
    window.addEventListener('resize', checkIfTruncated);
    return () => window.removeEventListener('resize', checkIfTruncated);
  }, [maxLines, message]);

  return (
    <div className="relative">
      <div 
        className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
          !isExpanded && shouldShowReadMore ? 'max-h-[12em]' : ''
        }`}
      >
        <p 
          ref={messageRef}
          className="text-gray-200 leading-relaxed text-xl md:text-2xl whitespace-pre-wrap not-italic pl-8 pr-8"
        >
          {message}
        </p>
        
        {/* Fade overlay when collapsed */}
        {!isExpanded && shouldShowReadMore && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-800 via-gray-800/95 via-gray-800/80 to-transparent pointer-events-none" />
        )}
      </div>
      
      {shouldShowReadMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 hover:border-blue-400/50 text-blue-400 hover:text-blue-300 transition-all duration-200 text-lg font-medium py-3 px-4 rounded-xl flex items-center justify-center space-x-2 group"
        >
          <span>{isExpanded ? 'Show less' : 'Continue reading'}</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            } group-hover:translate-x-1`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
} 