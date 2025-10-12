import React, { useState } from 'react';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
  isLiked: boolean;
  isSaved: boolean;
  onLike: (id: number) => void;
  onSave: (quote: Quote) => void;
  onShare: (id: number) => void;
}

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className = '' }) => (
    <button
        onClick={onClick}
        className={`bg-white/10 dark:bg-black/20 backdrop-blur-lg p-4 rounded-full text-3xl transform transition-transform duration-300 hover:scale-110 active:scale-95 ${className}`}
    >
        {children}
    </button>
);

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, isLiked, isSaved, onLike, onSave, onShare }) => {
    const [likeAnimation, setLikeAnimation] = useState(false);

    const handleLikeClick = () => {
        onLike(quote.id);
        if (!isLiked) {
            setLikeAnimation(true);
            setTimeout(() => setLikeAnimation(false), 300);
        }
    };

    return (
        <section
            id={`quote-${quote.id}`}
            className="h-screen w-screen snap-start flex items-center justify-center relative p-4"
        >
            <div className="relative w-full max-w-2xl flex flex-col items-center justify-center text-center">
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">{quote.category}</span>
                </div>
                
                <div className="p-8">
                    <p className="text-2xl md:text-4xl font-semibold dark:text-white leading-relaxed md:leading-snug shadow-text">
                        "{quote.content}"
                    </p>
                </div>

                <div className="absolute bottom-8 right-8 flex flex-col space-y-4">
                    <ActionButton onClick={handleLikeClick}>
                        <span className={`transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-white'}`}>
                            <svg className={`w-8 h-8 ${likeAnimation ? 'animate-bounce' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                        </span>
                    </ActionButton>
                    <ActionButton onClick={() => onSave(quote)}>
                         <span className={`transition-colors duration-300 ${isSaved ? 'text-blue-400' : 'text-white'}`}>
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3.13L5 18V4z"></path></svg>
                        </span>
                    </ActionButton>
                    <ActionButton onClick={() => onShare(quote.id)}>
                        <span className="text-white">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        </span>
                    </ActionButton>
                </div>
            </div>
        </section>
    );
};

export default QuoteCard;