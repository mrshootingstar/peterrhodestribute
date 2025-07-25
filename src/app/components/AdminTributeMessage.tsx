'use client';

interface AdminTributeMessageProps {
  message: string;
}

export function AdminTributeMessage({ 
  message
}: AdminTributeMessageProps) {
  // NO TRUNCATION FOR ADMIN VIEW
  // Admins need to see the complete tribute content when reviewing for approval.
  // Truncation would prevent proper evaluation of tribute quality and appropriateness.
  
  return (
    <div className="relative">
      <p 
        className="text-slate-800 whitespace-pre-wrap leading-relaxed"
      >
        {message}
      </p>
    </div>
  );
} 