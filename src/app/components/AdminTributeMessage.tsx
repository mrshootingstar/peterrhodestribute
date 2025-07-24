'use client';

import { useState, useRef, useEffect } from 'react';

interface AdminTributeMessageProps {
  message: string;
  maxLines?: number;
}

export function AdminTributeMessage({ message, maxLines = 4 }: AdminTributeMessageProps) {
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
          !isExpanded && shouldShowReadMore ? 'max-h-[6em]' : ''
        }`}
      >
        <p 
          ref={messageRef}
          className="text-slate-800 whitespace-pre-wrap leading-relaxed"
        >
          {message}
        </p>
        
        {/* Fade overlay when collapsed */}
        {!isExpanded && shouldShowReadMore && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent pointer-events-none" />
        )}
      </div>
      
      {shouldShowReadMore && (
        <div className="relative">
          {/* Visual continuation indicator */}
          {!isExpanded && (
            <div className="absolute -top-1 left-0 right-0 text-center">
              <div className="inline-flex items-center space-x-1 text-slate-400 text-xs">
                <span>•••</span>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all duration-200 text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-center space-x-1 group"
          >
            <span>{isExpanded ? 'Show less' : 'Read full message'}</span>
            <svg 
              className={`w-3 h-3 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              } group-hover:translate-x-0.5`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
} 