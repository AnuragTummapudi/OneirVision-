import { motion } from 'framer-motion';

const DreamCardSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-lg overflow-hidden"
        >
          <div className="animate-pulse space-y-4">
            {/* Title Skeleton */}
            <div className="h-6 bg-white/10 rounded-lg w-3/4"></div>
            
            {/* Date Skeleton */}
            <div className="h-4 bg-white/5 rounded w-1/2"></div>
            
            {/* Content Skeleton */}
            <div className="space-y-2">
              <div className="h-3 bg-white/5 rounded w-full"></div>
              <div className="h-3 bg-white/5 rounded w-5/6"></div>
              <div className="h-3 bg-white/5 rounded w-4/6"></div>
            </div>
            
            {/* Tags Skeleton */}
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-white/5 rounded-full"></div>
              <div className="h-6 w-12 bg-white/5 rounded-full"></div>
            </div>
            
            {/* Action Buttons Skeleton */}
            <div className="flex justify-end gap-2 pt-4">
              <div className="h-8 w-8 rounded-lg bg-white/5"></div>
              <div className="h-8 w-8 rounded-lg bg-white/5"></div>
              <div className="h-8 w-24 rounded-lg bg-gradient-to-r from-violet-500/20 to-pink-500/20"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default DreamCardSkeleton;
