import motion from '../utils/motion';
import { AnimatePresence } from 'framer-motion';
import { FiX, FiTag, FiMoon, FiSun, FiCloud, FiZap } from 'react-icons/fi';

type DreamEntryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  dream: {
    title: string;
    description: string;
    tags: string[];
    mood: string;
    date: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
  tagInput: string;
  setTagInput: (value: string) => void;
  isEditing: boolean;
};

const moods = [
  { value: 'peaceful', label: '😌 Peaceful', icon: <FiMoon className="w-4 h-4" /> },
  { value: 'happy', label: '✨ Happy', icon: <FiSun className="w-4 h-4" /> },
  { value: 'excited', label: '⚡ Excited', icon: <FiZap className="w-4 h-4" /> },
  { value: 'confused', label: '🌀 Confused', icon: <FiCloud className="w-4 h-4" /> },
  { value: 'sad', label: '🌧️ Sad', icon: <FiCloud className="w-4 h-4" /> },
  { value: 'scared', label: '👻 Scared', icon: <FiMoon className="w-4 h-4" /> },
];

const DreamEntryForm = ({
  isOpen,
  onClose,
  onSubmit,
  dream,
  onInputChange,
  onAddTag,
  onRemoveTag,
  tagInput,
  setTagInput,
  isEditing,
}: DreamEntryFormProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-indigo-950/95 to-violet-950/95 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-900/50 to-violet-900/50 backdrop-blur-sm p-6 pb-4 border-b border-white/5 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-pink-200">
                    {isEditing ? 'Edit Dream' : 'New Dream Entry'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-violet-300/80 mt-1">
                  {isEditing ? 'Update your dream details' : 'Capture the essence of your dream'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-violet-200 mb-1.5">
                    Dream Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={dream.title}
                      onChange={onInputChange}
                      placeholder="Give your dream a title..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-violet-200 mb-1.5">
                    When did you have this dream?
                  </label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={dream.date}
                    onChange={onInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Mood */}
                <div>
                  <label className="block text-sm font-medium text-violet-200 mb-1.5">
                    How did it feel?
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {moods.map((mood) => (
                      <label
                        key={mood.value}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 cursor-pointer transition-all ${
                          dream.mood === mood.value
                            ? 'bg-violet-500/20 border-violet-400 text-white'
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-violet-200/70'
                        }`}
                      >
                        <input
                          type="radio"
                          name="mood"
                          value={mood.value}
                          checked={dream.mood === mood.value}
                          onChange={onInputChange}
                          className="hidden"
                        />
                        <span className="text-2xl mb-1">
                          {mood.label.split(' ')[0]}
                        </span>
                        <span className="text-xs">
                          {mood.label.split(' ')[1]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-violet-200 mb-1.5">
                    Describe your dream
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={dream.description}
                    onChange={onInputChange}
                    rows={6}
                    placeholder="What happened in your dream? Try to recall as many details as possible..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-violet-200 mb-1.5">
                    Tags
                  </label>
                  <div className="relative">
                    <div className="flex items-center">
                      <div className="absolute left-3 text-violet-400">
                        <FiTag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            onAddTag(e as any);
                          }
                        }}
                        placeholder="Add tags (press Enter or , to add)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {dream.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-500/20 text-violet-200 border border-violet-500/30"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => onRemoveTag(tag)}
                            className="ml-1.5 text-violet-300 hover:text-white"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 text-white font-medium transition-all flex-1"
                  >
                    {isEditing ? 'Update Dream' : 'Save Dream'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DreamEntryForm;
