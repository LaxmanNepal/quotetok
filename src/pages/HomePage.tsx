import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense, useRef } from 'react';
import { Quote } from '../types';
import allQuotesData from '../data/quotes.json';
import CategoryTabs from '../components/CategoryTabs';
import DashboardButton from '../components/DashboardButton';
import useLocalStorage from '../hooks/useLocalStorage';
import ThemeToggle from '../components/ThemeToggle';
import AutoScrollToggle from '../components/AutoScrollToggle';
import html2canvas from 'html2canvas';

const QuoteCard = lazy(() => import('../components/QuoteCard'));

interface HomePageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const BATCH_SIZE = 5;

const HomePage: React.FC<HomePageProps> = ({ theme, toggleTheme }) => {
  const allQuotes: Quote[] = useMemo(() => allQuotesData, []);
  
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [visibleQuotes, setVisibleQuotes] = useState<Quote[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const [likedQuotes, setLikedQuotes] = useLocalStorage<number[]>('likedQuotes', []);
  const [savedQuotes, setSavedQuotes] = useLocalStorage<Quote[]>('savedQuotes', []);
  
  const containerRef = useRef<HTMLElement>(null);

  const categories = useMemo(() => ['All', ...new Set(allQuotes.map(q => q.category))], [allQuotes]);

  useEffect(() => {
    const filtered = activeCategory === 'All'
      ? allQuotes
      : allQuotes.filter(q => q.category === activeCategory);
    const shuffled = shuffleArray(filtered);
    setQuotes(shuffled);
    setVisibleQuotes(shuffled.slice(0, BATCH_SIZE));
    // Reset scroll to top when category changes
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [activeCategory, allQuotes]);
  
  const loadMoreQuotes = useCallback(() => {
    if (isLoadingMore || visibleQuotes.length >= quotes.length) return;

    setIsLoadingMore(true);
    setTimeout(() => {
        const nextBatch = quotes.slice(visibleQuotes.length, visibleQuotes.length + BATCH_SIZE);
        setVisibleQuotes(prev => [...prev, ...nextBatch]);
        setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, visibleQuotes.length, quotes]);

  const handleSwipeNext = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    // If we're near the bottom (less than a screen away), load more quotes.
    if (scrollHeight - scrollTop - clientHeight < clientHeight) {
        loadMoreQuotes();
    }

    container.scrollBy({ top: clientHeight, behavior: 'smooth' });
  }, [loadMoreQuotes]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        const container = document.getElementById('quotesContainer');
        if (!container) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            container.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            container.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 5) {
        loadMoreQuotes();
    }
  };
  
  const toggleAutoScroll = () => {
    setIsAutoScrolling(prev => !prev);
  };

  const stopAutoScroll = () => {
    if (isAutoScrolling) {
      setIsAutoScrolling(false);
    }
  };

  useEffect(() => {
    if (!isAutoScrolling) {
      return;
    }

    const intervalId = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      const isAtBottom = scrollHeight - scrollTop - clientHeight < 1;

      if (isAtBottom && visibleQuotes.length >= quotes.length) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ top: clientHeight, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(intervalId);
  }, [isAutoScrolling, quotes.length, visibleQuotes.length]);

  const handleLike = useCallback((quoteId: number) => {
    setLikedQuotes(prev =>
      prev.includes(quoteId) ? prev.filter(id => id !== quoteId) : [...prev, quoteId]
    );
  }, [setLikedQuotes]);

  const handleSave = useCallback((quote: Quote) => {
    setSavedQuotes(prev =>
      prev.some(q => q.id === quote.id) ? prev.filter(q => q.id !== quote.id) : [...prev, quote]
    );
  }, [setSavedQuotes]);
  
  const handleShare = useCallback((quoteId: number) => {
    const element = document.getElementById(`quote-${quoteId}`);
    if (!element) return;

    const watermark = document.createElement('div');
    watermark.innerText = 'Laxman Nepal Quotes';
    watermark.style.position = 'absolute';
    watermark.style.bottom = '20px';
    watermark.style.left = '20px';
    watermark.style.fontSize = '12px';
    watermark.style.fontFamily = 'Poppins, sans-serif';
    watermark.style.color = theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
    watermark.style.zIndex = '10';
    element.appendChild(watermark);

    html2canvas(element, { 
      backgroundColor: theme === 'dark' ? '#111827' : '#f3f4f6',
      useCORS: true 
    }).then((canvas: HTMLCanvasElement) => {
      const link = document.createElement("a");
      link.download = `Laxman-Nepal-Quote-${quoteId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }).finally(() => {
      element.removeChild(watermark);
    });
  }, [theme]);
  
  const renderContent = () => {
    if (visibleQuotes.length === 0) {
      return (
         <div className="h-screen w-screen flex items-center justify-center text-white text-xl">
          <p>No quotes found for this category.</p>
        </div>
      )
    }
    
    const loader = (
        <div className="h-screen w-screen snap-start flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );
    
    return (
      <main ref={containerRef} id="quotesContainer" onScroll={handleScroll} onWheel={stopAutoScroll} onTouchStart={stopAutoScroll} className="h-full w-full snap-y snap-mandatory overflow-y-scroll scrollbar-hide">
        <Suspense fallback={loader}>
          {visibleQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              isLiked={likedQuotes.includes(quote.id)}
              isSaved={savedQuotes.some(q => q.id === quote.id)}
              onLike={handleLike}
              onSave={handleSave}
              onShare={handleShare}
              onSwipeNext={handleSwipeNext}
            />
          ))}
        </Suspense>
        {isLoadingMore && loader}
      </main>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <header className="fixed top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white py-4">QuoteTok</h1>
          <div className="flex items-center space-x-2">
            <AutoScrollToggle isAutoScrolling={isAutoScrolling} toggleAutoScroll={toggleAutoScroll} />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
        <CategoryTabs categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      </header>
      
      {renderContent()}

      <DashboardButton />
    </div>
  );
};

export default HomePage;