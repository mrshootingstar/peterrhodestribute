'use client';

import { useState, useRef, useEffect } from 'react';

interface AdminTributeMessageProps {
  message: string;
  // Optional props to override default responsive behavior
  mobileMaxLines?: number;
  desktopMaxLines?: number;
}

export function AdminTributeMessage({ 
  message, 
  mobileMaxLines = 12,    // More lines on mobile since each line has fewer words
  desktopMaxLines = 6     // Fewer lines on desktop since each line has more words
}: AdminTributeMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
  const [currentMaxLines, setCurrentMaxLines] = useState(desktopMaxLines);
  const messageRef = useRef<HTMLParagraphElement>(null);

  // Responsive truncation logic: Determine appropriate maxLines based on screen size
  useEffect(() => {
    const updateMaxLines = () => {
      // Mobile breakpoint at 768px (Tailwind's md breakpoint)
      // Mobile devices need more lines because:
      // - Narrower screens = fewer words per line
      // - Same character count results in more lines
      // - Users expect to see more content before truncation on mobile
      const isMobile = window.innerWidth < 768;
      const newMaxLines = isMobile ? mobileMaxLines : desktopMaxLines;
      setCurrentMaxLines(newMaxLines);
    };

    // Set initial max lines
    updateMaxLines();
    
    // Update on window resize to handle device rotation and responsive changes
    window.addEventListener('resize', updateMaxLines);
    return () => window.removeEventListener('resize', updateMaxLines);
  }, [mobileMaxLines, desktopMaxLines]);

  // Truncation detection: Check if message content exceeds the current line limit
  useEffect(() => {
    const checkIfTruncated = () => {
      if (messageRef.current) {
        // Calculate the expected height based on line height and max lines
        const lineHeight = parseInt(getComputedStyle(messageRef.current).lineHeight);
        const maxHeight = lineHeight * currentMaxLines;
        
        // Compare with actual content height to determine if truncation is needed
        const actualHeight = messageRef.current.scrollHeight;
        setShouldShowReadMore(actualHeight > maxHeight);
      }
    };

    // Recheck whenever maxLines, message, or screen size changes
    checkIfTruncated();
    
    // Also recheck on window resize for responsive behavior
    window.addEventListener('resize', checkIfTruncated);
    return () => window.removeEventListener('resize', checkIfTruncated);
  }, [currentMaxLines, message]);

  // Dynamic height calculation for smooth transitions
  // Mobile gets more height since it shows more lines before truncating
  const getMaxHeight = () => {
    if (currentMaxLines === mobileMaxLines) {
      return 'max-h-[18em]'; // Mobile: ~18em for 12 lines
    }
    return 'max-h-[9em]';     // Desktop: ~9em for 6 lines
  };

  // Dynamic fade overlay height - taller on mobile for better visibility
  const getFadeHeight = () => {
    if (currentMaxLines === mobileMaxLines) {
      return 'h-12'; // Mobile: 3rem fade overlay
    }
    return 'h-8';    // Desktop: 2rem fade overlay
  };

  return (
    <div className="relative">
      {/* Message container with responsive truncation */}
      <div 
        className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
          !isExpanded && shouldShowReadMore ? getMaxHeight() : ''
        }`}
      >
        <p 
          ref={messageRef}
          className="text-slate-800 whitespace-pre-wrap leading-relaxed"
        >
          {message}
        </p>
        
        {/* Responsive fade overlay when content is truncated */}
        {/* Taller overlay on mobile for better content visibility transition */}
        {!isExpanded && shouldShowReadMore && (
          <div className={`absolute bottom-0 left-0 right-0 ${getFadeHeight()} bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent pointer-events-none`} />
        )}
      </div>
      
      {/* Continue Reading / Show Less button */}
      {/* Only shown when content actually exceeds the responsive line limit */}
      {shouldShowReadMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all duration-200 text-sm font-medium py-2 px-3 rounded-lg flex items-center justify-center space-x-1 group"
        >
          <span>
            {isExpanded ? 'Show less' : `Continue reading (${currentMaxLines} lines shown)`}
          </span>
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
      )}
    </div>
  );
} 