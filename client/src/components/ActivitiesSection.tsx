import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeader } from './LayoutElements';
import { 
  X, 
  PlayCircle, 
  ShieldAlert, 
  Clock, 
  Users, 
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  zone: string;
  gridCode: string;
  shortDesc: string;
  tagline: string;
  image: string;
  badgeColor: string;
  participants: string;
  duration: string;
  objective: string;
  howToPlay: string;
  rules: string[];
}

const activitiesData: ActivityItem[] = [
  {
    id: 'algorithmic-maze',
    title: 'Human Algorithmic Maze',
    subtitle: 'Blindfold Navigation',
    zone: 'BUILDER ZONE',
    gridCode: 'GRID-01',
    shortDesc: 'A blindfolded processor navigates an obstacle course guided solely by the programmer’s verbal commands.',
    tagline: 'A fun, technology-themed game that tests teamwork, communication, and logical thinking.',
    image: '/activities/algorithmic-maze.jpg',
    badgeColor: '#FF9900',
    participants: '2 per team (Programmer & Processor)',
    duration: '2–3 minutes per team',
    objective: 'Reach the finish line and retrieve the object in the shortest time!',
    howToPlay: 'Players form teams of two: a Programmer and a Processor. The blindfolded Processor navigates an obstacle course using the Programmer’s verbal commands: FORWARD, BACK, RIGHT, LEFT.',
    rules: [
      'The Processor must remain blindfolded.',
      'The Programmer cannot touch or physically guide the Processor.',
      'Touching an obstacle results in a Runtime Error penalty of two steps backward.',
      'Teams must finish within the time limit.'
    ]
  },
  {
    id: 'human-tetris',
    title: 'Human Tetris',
    subtitle: 'Dice Rolling Challenge',
    zone: 'BUILDER ZONE',
    gridCode: 'GRID-02',
    shortDesc: 'Roll the dice to determine which Tetris piece to place and complete vertical columns without gaps.',
    tagline: 'A fun, interactive game inspired by Tetris that tests logical thinking, spatial awareness, and problem-solving skills.',
    image: '/activities/human-tetris.png',
    badgeColor: '#00ffff',
    participants: '2 players',
    duration: '3–5 minutes per round',
    objective: 'Roll the dice, arrange the pieces, and complete as many vertical columns as possible!',
    howToPlay: 'Two players take turns rolling a dice to determine which Tetris-shaped piece to place on the grid. They arrange the pieces strategically to complete vertical columns without gaps.',
    rules: [
      'Players must place the piece corresponding to their dice roll.',
      'Pieces must fit within the designated grid.',
      'Players can rotate pieces to fit.',
      'The player who completes the most vertical columns within the time limit wins.'
    ]
  }
];

export const ActivitiesSection = () => {
  const [selectedId, setSelectedId] = useState<string>(activitiesData[0].id);
  const [modalItem, setModalItem] = useState<ActivityItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'algorithmic-maze' | 'human-tetris'>('all');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalItem) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [modalItem]);

  const filteredActivities = activeFilter === 'all'
    ? activitiesData
    : activitiesData.filter(a => a.id === activeFilter);

  const activeActivity = activitiesData.find(a => a.id === selectedId) || activitiesData[0];

  return (
    <section id="activities" className="relative py-20 sm:py-32 px-4 sm:px-12 lg:px-24 bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Background Ambience consistent with AWS / F1 Theme */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-aws-orange/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-f1-red/[0.03] rounded-full blur-[160px] pointer-events-none" />

      {/* Cyber Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-8 sm:mb-10">
          <SectionHeader 
            title="All the activities, in one place" 
            subtitle="Filter by activity, or tap a card to preview how to play and official rules."
            sysId="05.ARENA" 
          />

          {/* Filter Pills matching the web's AWS / F1 Dark Aesthetic */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-6">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 font-bold ${
                activeFilter === 'all'
                  ? 'bg-aws-orange text-black font-black shadow-[0_0_25px_rgba(255,153,0,0.35)] scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              All Activities
            </button>

            {activitiesData.map(game => {
              const isActive = activeFilter === game.id;
              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(game.id as any);
                    setSelectedId(game.id);
                  }}
                  className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 font-bold ${
                    isActive
                      ? 'bg-white text-black font-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  {game.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Structure: Left large preview card, Right list aligned to top */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Large Interactive Showcase Card */}
          <div className="lg:col-span-7 flex flex-col">
            <motion.div
              key={activeActivity.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-2xl sm:rounded-3xl border border-white/15 bg-[#0a0a0a] overflow-hidden flex flex-col shadow-2xl group"
            >
              {/* Crisp, Unobstructed Image Container */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] overflow-hidden bg-black/60 border-b border-white/10">
                <img 
                  src={activeActivity.image} 
                  alt={activeActivity.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-500 ease-out"
                />

                {/* Floating Zone Tag on top left */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-[11px] font-mono font-bold tracking-widest uppercase text-white shadow-xl">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeActivity.badgeColor }} />
                  {activeActivity.zone}
                </div>

                {/* Subtitle / Grid Code pill on top right */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-wider text-white/90">
                  <span className="text-aws-orange font-bold">{activeActivity.gridCode}</span>
                  <span className="text-white/30">•</span>
                  <span>{activeActivity.subtitle}</span>
                </div>
              </div>

              {/* Dedicated Content Box Below Image */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 bg-[#0a0a0a]">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs text-aws-orange uppercase tracking-widest font-bold">
                      {activeActivity.subtitle}
                    </span>
                    <span className="font-mono text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                      {activeActivity.duration}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-sans font-black italic uppercase tracking-tight text-white leading-tight">
                    {activeActivity.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-white/75 font-sans leading-relaxed">
                    {activeActivity.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-white/50">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{activeActivity.participants}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalItem(activeActivity)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-mono text-xs uppercase tracking-wider font-bold transition-all hover:bg-aws-orange hover:text-black shadow-lg"
                  >
                    <span>View Game Details</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Accent colored top strip */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, ${activeActivity.badgeColor}, transparent 80%)` }}
              />
            </motion.div>
          </div>

          {/* RIGHT: Stack of Activity Cards aligned to the top */}
          <div className="lg:col-span-5 flex flex-col justify-start gap-4 sm:gap-5">
            {filteredActivities.map((act) => {
              const isSelected = act.id === activeActivity.id;

              return (
                <div
                  key={act.id}
                  onClick={() => setSelectedId(act.id)}
                  className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all duration-300 border text-left relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#10141e] shadow-[0_0_30px_rgba(255,153,0,0.18)] scale-[1.01]'
                      : 'bg-[#0a0a0a]/90 hover:bg-[#0f1117] border-white/10 hover:border-white/25'
                  }`}
                  style={{
                    borderColor: isSelected ? act.badgeColor : undefined
                  }}
                >
                  {/* Active highlight left border */}
                  {isSelected && (
                    <motion.div 
                      layoutId="activeSideBar"
                      className="absolute top-0 left-0 bottom-0 w-1.5"
                      style={{ backgroundColor: act.badgeColor }}
                    />
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span 
                          className="font-mono text-[9px] uppercase tracking-widest font-bold"
                          style={{ color: act.badgeColor }}
                        >
                          {act.zone}
                        </span>
                        <span className="text-white/20 text-[10px]">•</span>
                        <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
                          {act.subtitle}
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-sans font-bold text-white transition-colors">
                        {act.title}
                      </h4>

                      <p className="mt-1.5 text-xs text-white/50 line-clamp-2 leading-relaxed font-sans">
                        {act.shortDesc}
                      </p>
                    </div>

                    {/* Details Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(act.id);
                        setModalItem(act);
                      }}
                      className="shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 bg-white/10 hover:bg-aws-orange text-white hover:text-black border border-white/15 shadow-sm"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Note badge */}
            <div className="mt-2 p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
              <Sparkles size={16} className="text-aws-orange shrink-0 animate-spin" />
              <p className="text-xs font-mono text-white/50 leading-relaxed uppercase tracking-wider">
                Open to all confirmed ticket holders in the interactive builder arena.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Pop-up Information Card / Modal rendered via createPortal directly into document.body */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {modalItem && (
            <div 
              data-lenis-prevent="true"
              className="fixed inset-0 z-[50000] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden"
              onClick={() => setModalItem(null)}
            >
              <motion.div
                data-lenis-prevent="true"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto overscroll-contain rounded-3xl border border-white/20 bg-[#0d0f14] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-left"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setModalItem(null)}
                  className="sticky top-0 float-right p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors z-30 mb-2"
                  aria-label="Close details"
                >
                  <X size={18} />
                </button>

                {/* Modal Header */}
                <div className="mb-5 pr-8">
                  <span className="font-mono text-[10px] uppercase tracking-widest font-bold" style={{ color: modalItem.badgeColor }}>
                    {modalItem.zone} • {modalItem.subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-sans font-black italic uppercase tracking-tight text-white mt-1">
                    {modalItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 font-sans mt-2 leading-relaxed">
                    {modalItem.tagline}
                  </p>
                </div>

                {/* Game Image Banner */}
                <div className="rounded-2xl overflow-hidden border border-white/10 mb-5 aspect-[16/9] bg-black">
                  <img src={modalItem.image} alt={modalItem.title} className="w-full h-full object-cover" />
                </div>

                {/* How to Play */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-5">
                  <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase tracking-wider mb-2">
                    <PlayCircle size={15} className="text-aws-orange" />
                    <span>How To Play</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                    {modalItem.howToPlay}
                  </p>
                </div>

                {/* Rules List */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase tracking-wider mb-2.5">
                    <ShieldAlert size={15} className="text-amber-400" />
                    <span>Official Rules</span>
                  </div>
                  <ul className="space-y-2">
                    {modalItem.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/70 font-sans">
                        <span className="font-mono font-bold text-white/40 shrink-0 mt-0.5">0{idx + 1}.</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Objective & Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">
                      <Users size={12} />
                      <span>Participants</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-white block">{modalItem.participants}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">
                      <Clock size={12} />
                      <span>Duration</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-white block">{modalItem.duration}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">
                      <Target size={12} />
                      <span>Objective</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-white block truncate" title={modalItem.objective}>
                      {modalItem.objective}
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <div className="mt-6 pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setModalItem(null)}
                    className="px-6 py-2.5 rounded-xl bg-aws-orange text-black font-mono text-xs uppercase tracking-wider font-black hover:bg-white transition-colors"
                  >
                    Got It
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};
