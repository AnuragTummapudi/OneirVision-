import motion from '../utils/motion';
import { FiMoon, FiBookOpen } from 'react-icons/fi';

const DreamJournalHeader = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 relative"
    >
      {/* Animated floating elements */}
      <motion.div 
        className="absolute -top-8 -left-8 text-4xl opacity-20"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🌙
      </motion.div>
      
      <motion.div 
        className="absolute -top-4 -right-4 text-3xl opacity-20"
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        ✨
      </motion.div>

      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-white/10 mb-4">
          <FiBookOpen className="text-3xl text-violet-300" />
        </div>
        
        <motion.h1 
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-pink-300 pb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Dream Journal
        </motion.h1>
        
        <motion.p 
          className="text-lg text-violet-200/80 max-w-md mx-auto mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Where thoughts take shape and dreams find their voice
        </motion.p>
        
        <motion.div 
          className="h-0.5 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mt-6 w-1/3 mx-auto"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.header>
  );
};

export default DreamJournalHeader;
