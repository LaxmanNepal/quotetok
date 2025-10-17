import React, { useState, memo } from 'react';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
  isLiked: boolean;
  isSaved: boolean;
  onLike: (id: number) => void;
  onSave: (quote: Quote) => void;
  onShare: (id: number) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, isLiked, isSaved, onLike, onSave, onShare }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${quote.content}" - ${quote.category}`).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Revert icon after 2 seconds
    }).catch(err => {
      console.error('Failed to copy quote: ', err);
    });
  };

  return (
    <div className="h-screen w-screen snap-start flex items-center justify-center p-4 md:p-8 relative">
      <div id={`quote-${quote.id}`} className="relative max-w-2xl w-full p-8 rounded-lg shadow-xl bg-black/20 backdrop-blur-md text-white">
        <p className="text-2xl md:text-4xl font-semibold text-center font-serif leading-relaxed">
          "{quote.content}"
        </p>
        <p className="text-right text-lg text-white/70 mt-6 italic">
          - {quote.category}
        </p>
      </div>

      <div className="absolute right-5 bottom-20 md:right-10 md:bottom-24 flex flex-col items-center space-y-6">
        <button
          onClick={() => onLike(quote.id)}
          className="flex flex-col items-center text-white transform transition-transform duration-200 hover:scale-110 active:scale-90"
          aria-label={isLiked ? 'Unlike quote' : 'Like quote'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-8 w-8 ${isLiked ? 'text-red-500' : ''}`}
            viewBox="0 0 24 24"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <button
          onClick={() => onSave(quote)}
          className="flex flex-col items-center text-white transform transition-transform duration-200 hover:scale-110 active:scale-90"
          aria-label={isSaved ? 'Unsave quote' : 'Save quote'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-8 w-8 ${isSaved ? 'text-blue-500' : ''}`}
            viewBox="0 0 24 24"
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
        
        <button
          onClick={handleCopy}
          className="flex flex-col items-center text-white transform transition-transform duration-200 hover:scale-110 active:scale-90"
          aria-label="Copy quote"
        >
          {isCopied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => onShare(quote.id)}
          className="flex flex-col items-center text-white transform transition-transform duration-200 hover:scale-110 active:scale-90"
          aria-label="Share quote"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default memo(QuoteCard);
