import React from 'react';
import { Link } from 'react-router-dom';
import { Quote } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import SavedQuoteCard from '../components/SavedQuoteCard';

const DashboardPage: React.FC = () => {
  const [savedQuotes, setSavedQuotes] = useLocalStorage<Quote[]>('savedQuotes', []);

  const handleRemove = (quoteId: number) => {
    setSavedQuotes(prev => prev.filter(q => q.id !== quoteId));
  };

  return (
    <div className="min-h-screen container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold dark:text-white">Saved Quotes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">You have {savedQuotes.length} saved quotes.</p>
        </div>
        <Link 
          to="/" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
      
      {savedQuotes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedQuotes.map(quote => (
            <SavedQuoteCard key={quote.id} quote={quote} onRemove={handleRemove} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600 dark:text-gray-300">You haven't saved any quotes yet.</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Go back and tap the save icon 💾 to keep your favorites!</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
