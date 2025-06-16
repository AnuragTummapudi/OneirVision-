import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';

type NewDreamButtonProps = {
  onClick: () => void;
};

const NewDreamButton = ({ onClick }: NewDreamButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-300" />
        
        {/* Button */}
        <div className="relative flex items-center justify-center px-6 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white font-medium text-sm tracking-wide shadow-lg group-hover:shadow-xl group-hover:shadow-violet-500/20 transition-all duration-300">
          <FiPlus className="w-5 h-5 mr-2" />
          <span>New Dream</span>
        </div>
        
        {/* Sparkle effect */}
        <motion.div 
          className="absolute -top-2 -right-2 text-yellow-300 text-xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ✨
        </motion.div>
      </div>
    </motion.button>
  );
};

export default NewDreamButton;
