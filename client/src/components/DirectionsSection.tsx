import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeader } from './LayoutElements';
import { MapPin, Plane, Train, Bus, Navigation } from 'lucide-react';

const tabs = [
  { id: 'venue', label: 'Venue Address', icon: MapPin, color: 'text-aws-orange', borderColor: 'border-aws-orange' },
  { id: 'train', label: 'By Train', icon: Train, color: 'text-f1-red', borderColor: 'border-f1-red' },
  { id: 'road', label: 'By Road', icon: Bus, color: 'text-[#00ff00]', borderColor: 'border-[#00ff00]' },
  { id: 'air', label: 'By Air', icon: Plane, color: 'text-blue-400', borderColor: 'border-blue-400' },
];

const contentMap: Record<string, ReactNode> = {
  venue: (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
        <strong className="text-white text-base">V.T. Patil Convention Hall</strong><br />
        Tararani High School Compound, Poorvarang,<br />
        Mahalaxminagar, Rajarampuri, Kolhapur,<br />
        Maharashtra 416008, India
      </p>
      <div className="flex flex-wrap gap-2.5 mt-2">
        <a 
          href="https://www.google.com/maps?q=V.T.+Patil+Convention+Hall,+Tararani+High+School+Compound,+Poorvarang,+Mahalaxminagar,+Rajarampuri,+Kolhapur,+Maharashtra+416008" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-aws-orange hover:text-black border border-white/10 transition-colors font-mono text-[10px] uppercase tracking-widest"
        >
          <Navigation size={14} /> Open in Google Maps
        </a>
      </div>
    </div>
  ),
  train: (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
        The nearest major railway stations to the venue:
      </p>
      <ul className="flex flex-col gap-3 mt-2">
        <li className="flex flex-col bg-[#0a0a0a] p-3 border border-white/5">
          <span className="font-sans font-bold text-white">Chhatrapati Shahu Maharaj Terminus (CSMT / KOP)</span>
          <span className="font-mono text-[10px] text-aws-orange uppercase tracking-widest mt-1">Approx. 2.5km away · 8 min auto / taxi drive</span>
        </li>
        <li className="flex flex-col bg-[#0a0a0a] p-3 border border-white/5">
          <span className="font-sans font-bold text-white">Miraj Railway Junction (MRJ)</span>
          <span className="font-mono text-[10px] text-f1-red uppercase tracking-widest mt-1">Approx. 45km away · 1 hour drive (express trains hub)</span>
        </li>
      </ul>
      <p className="font-sans text-xs text-white/50 mt-2">
        Auto-rickshaws, city cabs, and city buses are readily available from CSMT Kolhapur Station directly to V.T. Patil Convention Hall.
      </p>
    </div>
  ),
  road: (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
        Kolhapur is prominently located on <strong className="text-white">National Highway 48 (NH-48, Pune-Bengaluru Highway)</strong> with seamless arterial connectivity across Maharashtra and Karnataka.
      </p>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {[
          { city: "Pune", time: "~ 4.5 hours (NH-48)" },
          { city: "Mumbai", time: "~ 7.5 hours" },
          { city: "Sangli", time: "~ 50 mins" },
          { city: "Belagavi", time: "~ 2 hours" },
        ].map(route => (
          <div key={route.city} className="bg-[#0a0a0a] border border-white/5 p-3 flex flex-col">
            <span className="font-sans font-bold text-white text-sm">{route.city}</span>
            <span className="font-mono text-[10px] text-[#00ff00] uppercase tracking-widest mt-1">{route.time}</span>
          </div>
        ))}
      </div>
      <p className="font-sans text-xs text-white/50 mt-2">
        Central Bus Stand (CBS Kolhapur) is just 2 km away from V.T. Patil Convention Hall with round-the-clock state & private luxury buses.
      </p>
    </div>
  ),
  air: (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
        The closest airports for national & international attendees:
      </p>
      <ul className="flex flex-col gap-3 mt-2">
        <li className="flex flex-col bg-[#0a0a0a] p-3 border border-white/5">
          <span className="font-sans font-bold text-white">Kolhapur Airport (KLH / Ujalaiwadi)</span>
          <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mt-1">Approx. 8km · 15 min drive (Direct flights from Mumbai, Hyderabad, Bengaluru)</span>
        </li>
        <li className="flex flex-col bg-[#0a0a0a] p-3 border border-white/5">
          <span className="font-sans font-bold text-white">Pune International Airport (PNQ)</span>
          <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mt-1">Approx. 235km · 4.5 hr drive or direct train/bus</span>
        </li>
      </ul>
      <p className="font-sans text-xs text-white/50 mt-2">
        Prepaid taxis and auto-rickshaws connect Kolhapur Airport directly to V.T. Patil Convention Hall.
      </p>
    </div>
  ),
};

export const DirectionsSection = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeTabConfig = tabs.find(t => t.id === activeTab)!;
  const ActiveIcon = activeTabConfig.icon;

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-12 lg:px-24 bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Background glow based on active tab */}
      <div className={`absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.03] transition-colors duration-1000 pointer-events-none ${
        activeTab === 'venue' ? 'bg-aws-orange' : 
        activeTab === 'train' ? 'bg-f1-red' : 
        activeTab === 'road' ? 'bg-[#00ff00]' : 'bg-blue-400'
      }`} />

      <SectionHeader title="Track Directions" subtitle="Navigate to the circuit. Find the best routes to V.T. Patil Convention Hall, Kolhapur via air, train, or road." sysId="08.NAV" />

      <div className="w-full flex flex-col lg:flex-row gap-6 sm:gap-10 mt-12 sm:mt-16 relative z-10 bg-[#111] border border-white/5 p-4 sm:p-6 lg:p-8">
        
        {/* Left: Tabbed Dashboard */}
        <div className="w-full lg:w-1/2 flex flex-col">
          
          {/* Tab Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 sm:mb-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 sm:p-4 border transition-all duration-300 ${
                    isActive 
                      ? `bg-[#1a1a1a] ${tab.borderColor} shadow-[0_0_15px_rgba(255,255,255,0.05)]` 
                      : 'bg-[#0a0a0a] border-white/5 hover:border-white/20 hover:bg-[#151515]'
                  }`}
                >
                  <Icon size={18} className={isActive ? tab.color : 'text-white/40'} />
                  <span className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-widest ${isActive ? 'text-white font-bold' : 'text-white/40'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 bg-[#0a0a0a] border border-white/5 relative overflow-hidden flex flex-col">
            {/* Top accent bar */}
            <div className={`h-1 w-full transition-colors duration-500 bg-gradient-to-r from-transparent via-current to-transparent ${activeTabConfig.color}`} />
            
            <div className="p-6 sm:p-8 flex-1">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <ActiveIcon size={24} className={activeTabConfig.color} />
                <h3 className="font-sans font-black italic text-xl sm:text-2xl uppercase text-white tracking-tighter">
                  {activeTabConfig.label}
                </h3>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {contentMap[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: Google Maps Embed */}
        <div className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto lg:h-[500px] bg-[#0a0a0a] border border-white/5 p-2 relative group overflow-hidden">
          {/* Scanning line effect */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-aws-orange/50 shadow-[0_0_10px_#FF9900] z-20 animate-[scan_3s_ease-in-out_infinite] opacity-50 pointer-events-none"></div>
          
          {/* Quick link button */}
          <a
            href="https://www.google.com/maps?q=V.T.+Patil+Convention+Hall,+Tararani+High+School+Compound,+Poorvarang,+Mahalaxminagar,+Rajarampuri,+Kolhapur,+Maharashtra+416008"
            target="_blank"
            rel="noreferrer"
            className="absolute top-4 left-4 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/85 hover:bg-aws-orange hover:text-black border border-white/20 text-white font-mono text-[10px] uppercase tracking-wider backdrop-blur-md transition-all shadow-lg"
          >
            <Navigation size={12} /> Open in Maps ↗
          </a>

          <iframe 
            src="https://maps.google.com/maps?q=V.T.+Patil+Convention+Hall,+Tararani+High+School+Compound,+Poorvarang,+Mahalaxminagar,+Rajarampuri,+Kolhapur,+Maharashtra+416008&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full relative z-10 transition-all duration-700"
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="V.T. Patil Convention Hall Kolhapur Location"
          ></iframe>
        </div>

      </div>
    </section>
  );
};
