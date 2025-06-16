import motion from '../utils/motion';
import { FiEdit2, FiTrash2, FiClock, FiZap } from 'react-icons/fi';
import { format } from 'date-fns';

type DreamCardProps = {
  id: number;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  mood?: string;
  onEdit: () => void;
  onDelete: () => void;
};

const moodIcons: Record<string, string> = {
  peaceful: '🌙',
  happy: '✨',
  sad: '🌧️',
  confused: '🌀',
  excited: '⚡',
  scared: '👻',
  inspired: '💡',
  default: '🔮',
};

const DreamCard = ({
  id,
  title,
  date,
  description,
  tags = [],
  mood = 'default',
  onEdit,
  onDelete,
}: DreamCardProps) => {
  const moodIcon = moodIcons[mood.toLowerCase()] || moodIcons.default;
  const preview = description.length > 100 ? `${description.substring(0, 100)}...` : description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(167, 139, 250, 0.3)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative group bg-gradient-to-br from-white/5 to-white/[0.01] backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden hover:border-violet-500/30 transition-all duration-300 h-full flex flex-col"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Mood indicator */}
      <div className="absolute top-4 right-4 text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
        {moodIcon}
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-pink-300">
            {title}
          </h3>
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <FiClock className="mr-1.5" />
            {format(new Date(date), 'MMM d, yyyy • h:mm a')}
          </div>
        </div>

        {/* Preview */}
        <p className="text-gray-300 mb-4 flex-1 line-clamp-3">{preview}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-white/5">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-violet-500/10 text-violet-300 text-xs rounded-full border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2.5 py-1 bg-white/5 text-white/50 text-xs rounded-full">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Edit dream"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/70 hover:text-rose-400 transition-colors"
            aria-label="Delete dream"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            aria-label="Analyze dream"
          >
            <FiZap className="w-3.5 h-3.5" />
            <span>Interpret</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DreamCard;
