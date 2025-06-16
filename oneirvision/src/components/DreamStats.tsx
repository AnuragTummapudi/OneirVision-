import { motion } from 'framer-motion';
import { FiBarChart2, FiCalendar, FiMoon, FiTrendingUp } from 'react-icons/fi';

const stats = [
  {
    id: 1,
    name: 'Total Dreams',
    value: '127',
    icon: FiMoon,
    change: '+12%',
    changeType: 'increase',
  },
  {
    id: 2,
    name: 'This Month',
    value: '8',
    icon: FiCalendar,
    change: '+2',
    changeType: 'increase',
  },
  {
    id: 3,
    name: 'Avg. Sleep',
    value: '6.2',
    unit: 'hrs',
    icon: FiTrendingUp,
    change: '+0.5',
    changeType: 'increase',
  },
  {
    id: 4,
    name: 'Common Mood',
    value: '😌',
    icon: FiBarChart2,
    change: 'Peaceful',
    changeType: 'neutral',
  },
];

const DreamStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: stat.id * 0.1 }}
          className="bg-gradient-to-br from-white/5 to-white/[0.01] backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-violet-500/30 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-violet-300">{stat.name}</p>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-white">
                  {stat.value}{' '}
                  {stat.unit && (
                    <span className="text-sm font-normal text-violet-300">
                      {stat.unit}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 group-hover:bg-violet-500/20 transition-colors">
              <stat.icon className="h-6 w-6 text-violet-400" aria-hidden="true" />
            </div>
          </div>
          {stat.change && (
            <div className="mt-4">
              <div className="flex items-center">
                <span
                  className={`text-xs font-medium ${
                    stat.changeType === 'increase'
                      ? 'text-emerald-400'
                      : stat.changeType === 'decrease'
                      ? 'text-rose-400'
                      : 'text-violet-300'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="ml-1 text-xs text-violet-400">
                  {stat.changeType === 'increase' && 'from last month'}
                  {stat.changeType === 'decrease' && 'from last month'}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default DreamStats;
