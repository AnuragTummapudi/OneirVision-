import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FiFilter, FiCalendar, FiTag, FiMoon, FiX } from 'react-icons/fi';
import motion from '../utils/motion';

type DreamFiltersProps = {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  dateRange: {
    start: string;
    end: string;
  };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onClearFilters: () => void;
};

const DreamFilters = ({
  tags,
  selectedTags,
  onTagToggle,
  dateRange,
  onDateRangeChange,
  onClearFilters,
}: DreamFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localDateRange, setLocalDateRange] = useState(dateRange);

  // Update local state when props change
  useEffect(() => {
    setLocalDateRange(dateRange);
  }, [dateRange]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newRange = { ...localDateRange, [name]: value };
    setLocalDateRange(newRange);
    onDateRangeChange(newRange);
  };

  // Animation variants
  const sidebarVariants = {
    hidden: { 
      x: '-100%', 
      opacity: 0 
    },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: 'spring' as const,
        damping: 30,
        stiffness: 300
      }
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: {
        type: 'spring' as const,
        damping: 30,
        stiffness: 300
      }
    }
  };

  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 md:hidden p-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="Open filters"
      >
        <FiFilter className="w-5 h-5 text-white" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-gradient-to-b from-indigo-950/95 to-violet-950/95 backdrop-blur-lg border-r border-white/5 shadow-2xl z-50 overflow-y-auto`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-pink-200">
                  Filters
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="md:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  aria-label="Close filters"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Date Range */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-violet-200 mb-3">
                  <FiCalendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Date Range</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-violet-300/80 mb-1">From</label>
                    <input
                      type="date"
                      name="start"
                      value={localDateRange.start}
                      onChange={handleDateChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-violet-300/80 mb-1">To</label>
                    <input
                      type="date"
                      name="end"
                      value={localDateRange.end}
                      onChange={handleDateChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-violet-200 mb-3">
                  <FiTag className="w-4 h-4" />
                  <span className="text-sm font-medium">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onTagToggle(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-md shadow-violet-500/20'
                          : 'bg-white/5 text-violet-200 hover:bg-white/10'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                  {tags.length === 0 && (
                    <p className="text-xs text-violet-400/70">No tags available</p>
                  )}
                </div>
              </div>

              {/* Mood Filter */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-violet-200 mb-3">
                  <FiMoon className="w-4 h-4" />
                  <span className="text-sm font-medium">Mood</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['😌', '✨', '⚡', '🌀', '🌧️', '👻'].map((mood) => (
                    <button
                      key={mood}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-2xl transition-colors"
                      title={mood === '😌' ? 'Peaceful' : mood === '✨' ? 'Happy' : mood === '⚡' ? 'Excited' : mood === '🌀' ? 'Confused' : mood === '🌧️' ? 'Sad' : 'Scared'}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={onClearFilters}
                className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-violet-200 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FiX className="w-4 h-4" />
                <span>Clear All Filters</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DreamFilters;
