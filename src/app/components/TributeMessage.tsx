'use client';

import { useState, useRef, useEffect } from 'react';

interface TributeMessageProps {
  message: string;
  // Optional props to override default responsive behavior
  mobileMaxLines?: number;
  desktopMaxLines?: number;
}

export function TributeMessage({ 
  message, 
  mobileMaxLines = 15,    // More lines on mobile since each line has fewer words
  desktopMaxLines = 8     // Fewer lines on desktop since each line has more words
}: TributeMessageProps) {
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
      return 'max-h-[22.5em]'; // Mobile: ~22.5em for 15 lines
    }
    return 'max-h-[14em]';     // Desktop: ~14em for 8 lines
  };

  // Dynamic fade overlay height - taller on mobile for better visibility
  const getFadeHeight = () => {
    if (currentMaxLines === mobileMaxLines) {
      return 'h-32'; // Mobile: 8rem fade overlay
    }
    return 'h-32';   // Desktop: 8rem fade overlay (keeping same for consistency)
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
          className="text-gray-200 leading-relaxed text-xl md:text-2xl whitespace-pre-wrap not-italic pl-8 pr-8"
        >
          {message}
        </p>
        
        {/* Responsive fade overlay when content is truncated - covers last 4-5 lines for visibility */}
        {/* Maintains visual consistency across different screen sizes */}
        {!isExpanded && shouldShowReadMore && (
          <div className={`absolute bottom-0 left-0 right-0 ${getFadeHeight()} bg-gradient-to-t from-gray-800 via-gray-800/95 via-gray-800/85 via-gray-800/70 via-gray-800/40 to-transparent pointer-events-none`} />
        )}
      </div>
      
      {/* Show closing quote only when content is fully visible */}
      {(!shouldShowReadMore || isExpanded) && (
        <div className="absolute -bottom-4 -right-2 text-5xl text-blue-400/30 font-serif transform rotate-180">&ldquo;</div>
      )}
      
      {/* Continue Reading / Show Less button */}
      {/* Only shown when content actually exceeds the responsive line limit */}
      {shouldShowReadMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 hover:border-blue-400/50 text-blue-400 hover:text-blue-300 transition-all duration-200 text-lg font-medium py-3 px-4 rounded-xl flex items-center justify-center space-x-2 group"
        >
                     <span>
             {isExpanded ? 'Show less' : 'Continue reading'}
           </span>
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