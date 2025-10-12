
import React from 'react';
import { Quote } from '../types';

interface SavedQuoteCardProps {
  quote: Quote;
  onRemove: (id: number) => void;
}

const SavedQuoteCard: React.FC<SavedQuoteCardProps> = ({ quote, onRemove }) => {
  return (
    <div className="bg-white/5 dark:bg-gray-800/50 backdrop-blur-xl border border-white/10 dark:border-gray-700/50 rounded-2xl p-6 flex flex-col h-full shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="flex-grow">
        <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">"{quote.content}"</p>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-500 dark:text-blue-400 px-2 py-1 rounded-full">{quote.category}</span>
        <button 
          onClick={() => onRemove(quote.id)} 
          className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors duration-300"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default SavedQuoteCard;
