import React, { useEffect, useState } from 'react';
import motion from '../utils/motion';

interface Quote {
  content: string;
  author: string;
  tags?: string[];
}

// Collection of dream-related quotes
const DREAM_QUOTES: Quote[] = [
  {
    content: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    tags: ["inspiration", "dreams", "future"]
  },
  {
    content: "All that we see or seem is but a dream within a dream.",
    author: "Edgar Allan Poe",
    tags: ["philosophy", "dreams", "reality"]
  },
  {
    content: "Dreams are the touchstones of our characters.",
    author: "Henry David Thoreau",
    tags: ["character", "dreams", "wisdom"]
  },
  {
    content: "The best way to make your dreams come true is to wake up.",
    author: "Paul Valery",
    tags: ["action", "dreams", "motivation"]
  },
  {
    content: "Dream no small dreams for they have no power to move the hearts of men.",
    author: "Johann Wolfgang von Goethe",
    tags: ["ambition", "dreams", "inspiration"]
  },
  {
    content: "Dreams are the royal road to the unconscious.",
    author: "Sigmund Freud",
    tags: ["psychology", "dreams", "unconscious"]
  }
];

/**
 * QuoteWidget – displays an inspirational quote about dreams.
 * 
 * Currently uses a local collection of quotes, but can be easily modified
 * to fetch from an API in the future.
 */
interface QuoteWidgetProps {
  className?: string;
}

export default function QuoteWidget({ className = '' }: QuoteWidgetProps) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get a random quote from our local collection
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * DREAM_QUOTES.length);
      return DREAM_QUOTES[randomIndex];
    };

    // Check if we have a cached quote for today
    const today = new Date().toDateString();
    const cachedQuote = localStorage.getItem('ov-quote');
    
    if (cachedQuote) {
      const { date, ...storedQuote } = JSON.parse(cachedQuote);
      if (date === today) {
        setQuote(storedQuote);
        setIsLoading(false);
        return;
      }
    }

    // No cached quote or it's from a different day, get a new random one
    const newQuote = getRandomQuote();
    
    // Cache the new quote with today's date
    localStorage.setItem('ov-quote', JSON.stringify({
      ...newQuote,
      date: today
    }));
    
    setQuote(newQuote);
    setIsLoading(false);
    
    // Set up interval to get a new quote every 30 seconds (for demo purposes)
    const intervalId = setInterval(() => {
      setQuote(getRandomQuote());
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/20 rounded w-3/4"></div>
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
          <div className="h-4 bg-white/20 rounded w-1/4 mt-4"></div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-lg hover:shadow-indigo-500/20 transition-shadow duration-300 ${className}`}
    >
      <blockquote className="relative">
        <div className="text-4xl absolute -left-2 -top-4 text-indigo-400/30">"</div>
        <p className="text-lg md:text-xl text-white/90 italic pl-6">{quote.content}</p>
        <footer className="mt-4 text-right text-indigo-300">— {quote.author}</footer>
        {quote.tags && (
          <div className="flex flex-wrap gap-2 mt-3 justify-end">
            {quote.tags.map((tag, index) => (
              <span key={index} className="text-xs px-2 py-1 rounded-full bg-indigo-900/30 text-indigo-200">
                {tag}
              </span>
            ))}
          </div>
        )}
      </blockquote>
    </motion.div>
  );
};
