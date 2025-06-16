import React, { useState, useEffect } from 'react';
import motion from '../utils/motion';
import { AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiMusic, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import QuoteWidget from '../components/QuoteWidget';
import { useDreamContext, DreamEntry, NewDreamEntry } from '../contexts/DreamContext';

const JournalPage: React.FC = () => {
  const {
    dreamJournal,
    journalLoading,
    addDreamEntryAsync,
    updateDreamEntryAsync,
    deleteDreamEntryAsync,
  } = useDreamContext();

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DreamEntry | null>(null);
  const emptyDream: NewDreamEntry = {
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    tags: [],
    mood: '', // required by type but hidden in UI
    favorite: false,
    interpretation: '',
    visualization: '',
    visualizationUrl: '',
  };
  const [draft, setDraft] = useState<NewDreamEntry>(emptyDream);
  const [tagInput, setTagInput] = useState('');
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [sort, setSort] = useState<'date' | 'alpha'>('date');
  const [ambient, setAmbient] = useState(false);

  // derived
  const allTags = Array.from(new Set(dreamJournal.flatMap((d) => d.tags || [])));
  const entries = dreamJournal
    .filter((d) =>
      [d.title, d.description].some((t) => t.toLowerCase().includes(search.toLowerCase()))
    )
    .filter((d) => (filterTag ? d.tags?.includes(filterTag) : true))
    .sort((a, b) => {
      if (sort === 'alpha') return a.title.localeCompare(b.title);
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // handle ambient audio (basic)
  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    if (ambient) {
      audio = new Audio('https://cdn.pixabay.com/download/audio/2021/09/11/audio_7e2af3f4c1.mp3?filename=rain-ambient-110734.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      audio.play();
    }
    return () => {
      if (audio) audio.pause();
    };
  }, [ambient]);

  const openForm = (entry?: DreamEntry) => {
    if (entry) {
      setEditing(entry);
      setDraft({ ...entry });
    } else {
      setEditing(null);
      setDraft(emptyDream);
    }
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!draft.title.trim() || !draft.description.trim()) return;
    if (editing) {
      await updateDreamEntryAsync({ ...(draft as DreamEntry), id: editing.id });
    } else {
      await addDreamEntryAsync(draft);
    }
    setShowForm(false);
  };

  // Animated gradient background
  const AnimatedGradient = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#6e45e2_0%,#88d3ce_50%,#6e45e2_100%)] animate-gradient-xy opacity-20" style={{
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
      }}></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFucm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTTAgMjBMMjAgMEg0MEwyMCA0MEgweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-10"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0514] to-[#1a0b2e] pt-24 pb-16 text-white relative overflow-hidden">
      <AnimatedGradient />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-vivid-blue drop-shadow-lg">
            My Journal
          </h1>
          <p className="text-gray-400 mt-2">Reflect. Write. Grow.</p>
        </motion.div>

        {/* Quote */}
        <QuoteWidget className="mb-8" />

        {/* Search and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glassmorphism p-4 rounded-2xl mb-8 backdrop-blur-lg border border-white/10 shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <input
                type="text"
                placeholder="Search entries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200 relative z-10"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200 appearance-none relative z-10 cursor-pointer"
                >
                  <option value="">All Tags</option>
                  {allTags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as 'date' | 'alpha')}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200 appearance-none relative z-10 cursor-pointer"
                >
                  <option value="date">Newest First</option>
                  <option value="alpha">A to Z</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Entry list */}
        {journalLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-vivid-blue border-t-transparent rounded-full"></div></div>
        ) : entries.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">🌱</p>
            <p className="text-xl">Start your journey of self-reflection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {entries.map((d) => (
              <motion.div 
                key={d.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4 }} 
                className="glassmorphism p-6 rounded-2xl border border-white/20 bg-gradient-to-br from-white/5 to-white/[0.03] backdrop-blur-lg hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 h-full flex flex-col"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-semibold flex items-center gap-2">{d.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{format(new Date(d.date), 'PP p')}</p>
                    <p className="mb-3 text-gray-300 line-clamp-3">{d.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {d.tags?.map((t) => (
                        <span key={t} onClick={() => setFilterTag(t)} className="px-3 py-1 bg-vivid-blue/20 text-vivid-blue rounded-full text-xs cursor-pointer">#{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 text-gray-400">
                    <button title="Edit" onClick={() => openForm(d)} className="hover:text-white"><FiEdit2 /></button>
                    <button title="Delete" onClick={() => deleteDreamEntryAsync(d.id as number)} className="hover:text-red-400"><FiTrash2 /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <button 
          onClick={() => setShowForm(true)} 
          className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
        >
          <FiPlus className="h-6 w-6" />
        </button>
        {/* Ambient toggle */}
        <button onClick={() => setAmbient(!ambient)} title="Ambient sound" className="fixed bottom-6 left-6 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full">
          {ambient ? <FiX /> : <FiMusic />}
        </button>

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            >
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gradient-to-br from-[#1A0B2E] to-[#2D0F4F] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{editing ? 'Edit Entry' : 'New Entry'}</h2>
                  <button onClick={() => setShowForm(false)}><FiX /></button>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full bg-dark-bg/60 border border-gray-700 p-3 rounded-lg" />
                  <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="w-full bg-dark-bg/60 border border-gray-700 p-3 rounded-lg" />
                  <textarea rows={5} placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="w-full bg-dark-bg/60 border border-gray-700 p-3 rounded-lg" />

                  {/* Tags */}
                  <div>
                    <div className="flex gap-3 mt-4 pt-3 border-t border-white/10">
                      <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setDraft({ ...draft, tags: [...(draft.tags || []), tagInput.trim()] }); setTagInput(''); } }} className="flex-1 bg-dark-bg/60 border border-gray-700 p-3 rounded-lg" placeholder="Add tag and press Enter" />
                      <button type="button" onClick={() => { if (tagInput.trim()) { setDraft({ ...draft, tags: [...(draft.tags || []), tagInput.trim()] }); setTagInput(''); } }} className="px-4 py-2 bg-vivid-blue/20 text-vivid-blue rounded-lg">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {draft.tags?.map((t, i) => (
                        <span className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 px-2.5 py-1 rounded-full text-xs transition-colors">#{t} <button onClick={() => setDraft({ ...draft, tags: draft.tags?.filter((tg) => tg !== t) })}><FiX /></button></span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-gray-600 rounded-lg">Cancel</button>
                    <button onClick={handleSave} className="px-5 py-2 bg-gradient-to-r from-vivid-blue to-teal-500 rounded-lg">Save</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JournalPage;

// Global styles for animations and glassmorphism effect
const styles = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  .glassmorphism {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-gradient-xy {
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
