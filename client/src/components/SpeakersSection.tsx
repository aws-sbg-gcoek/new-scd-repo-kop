import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import { SectionHeader } from './LayoutElements';
import { Mic, Sparkles, ArrowRight, Radio, Layers, Linkedin, ArrowUpRight } from 'lucide-react';

interface SpeakerItem {
  id: string;
  name: string;
  designation: string;
  company: string;
  sessionTitle: string;
  time: string;
  image?: string;
  isAnnounced: boolean;
  linkedin?: string;
  badge: string;
}

const SPEAKERS: SpeakerItem[] = [
  {
    id: "jessica-gilmore",
    name: "Jessica Gilmore",
    designation: "Manager, Community Groups",
    company: "@Amazon",
    sessionTitle: "Keynote: Empowering Global Builders & Community Growth",
    time: "10:45 – 11:15 AM",
    image: "/Speakers/jessica-gilmore.jpg",
    isAnnounced: true,
    linkedin: "https://www.linkedin.com/in/dr-jessica-k-gilmore/",
    badge: "AWS KEYNOTE"
  },
  {
    id: "speaker-01",
    name: "Speaker 01",
    designation: "Principal Cloud Architect",
    company: "@AWS Ecosystem",
    sessionTitle: "Technical Session 01: Event-Driven Systems & Serverless at Scale",
    time: "11:15 – 12:00 PM",
    isAnnounced: false,
    badge: "TECH KEYNOTE"
  },
  {
    id: "speaker-01-workshop",
    name: "Speaker 01",
    designation: "Cloud Solutions Specialist",
    company: "@AWS Ecosystem",
    sessionTitle: "Hands-on Workshop 01: Practical Serverless Implementation",
    time: "12:00 – 12:45 PM",
    isAnnounced: false,
    badge: "WORKSHOP"
  },
  {
    id: "speaker-02",
    name: "Speaker 02",
    designation: "Head of Cloud & DevOps",
    company: "@Enterprise Cloud",
    sessionTitle: "Career Guidance: Navigating Cloud Careers, DevOps & Hiring",
    time: "13:45 – 14:30 PM",
    isAnnounced: false,
    badge: "CAREER SESSION"
  },
  {
    id: "speaker-03",
    name: "Speaker 03",
    designation: "Staff AI Solutions Architect",
    company: "@AWS Builder Circle",
    sessionTitle: "Hands-on Generative AI with Amazon Bedrock & Multi-Agent Systems",
    time: "15:30 – 17:00 PM",
    isAnnounced: false,
    badge: "AI WORKSHOP"
  },
  {
    id: "speaker-panel",
    name: "Community Leaders & Mentors",
    designation: "AWS User Group Leaders & Ambassadors",
    company: "@AWS SBG GCOEK",
    sessionTitle: "Closing Panel: The Future of Student Builders & Community Innovation",
    time: "17:30 – 18:00 PM",
    isAnnounced: false,
    badge: "COMMUNITY PANEL"
  }
];

export const SpeakersSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftListRef = useRef<HTMLDivElement>(null);
  const isClickingRef = useRef(false);

  // Desktop Pinned Scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001
  });

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (isClickingRef.current) return;
      const count = SPEAKERS.length;
      const idx = Math.min(Math.floor(latest * count), count - 1);
      if (idx !== activeIndex && idx >= 0 && idx < count) {
        setActiveIndex(idx);
      }
    });

    return () => unsubscribe();
  }, [activeIndex, smoothProgress]);

  useEffect(() => {
    const itemEl = leftItemRefs.current[activeIndex];
    if (itemEl && leftListRef.current) {
      itemEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeIndex]);

  const handleSpeakerSelect = (index: number) => {
    setActiveIndex(index);
    isClickingRef.current = true;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const containerTop = currentScrollY + rect.top;
      const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
      const targetScrollY = containerTop + (index / (SPEAKERS.length - 1)) * scrollableDistance;

      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      });
    }

    setTimeout(() => {
      isClickingRef.current = false;
    }, 500);
  };

  const activeSpeaker = SPEAKERS[activeIndex] || SPEAKERS[0];

  return (
    <section id="speakers" className="relative bg-[#050505] overflow-visible" aria-label="Speakers section">
      {/* Track Lines and Background Glow */}
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-aws-orange/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header outside the pinned container so it scrolls naturally */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-16 pb-4">
        <SectionHeader
          title="Speakers"
          subtitle="Meet our lineup of AWS leaders, architects, and community pioneers shaping the cloud racing grid."
          sysId="02.SPK"
          action={
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-white/[0.03] font-mono text-xs text-white/50 border border-white/10">
                <span className="text-aws-orange font-bold">0{activeIndex + 1}</span>
                <span>/</span>
                <span>0{SPEAKERS.length}</span>
              </div>
              <a
                href="#schedule"
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-aws-orange/40 bg-aws-orange/10 hover:bg-aws-orange hover:text-black text-aws-orange font-sans font-bold text-xs uppercase tracking-wider skew-x-[-10deg] transition-all group"
              >
                <span className="skew-x-[10deg] flex items-center gap-1.5">
                  <span>View All Sessions</span>
                  <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </a>
            </div>
          }
        />
      </div>

      {/* ── 1. PINNED SCROLL SECTION (Locks in place while scrolling speakers) ── */}
      <div ref={containerRef} className="relative h-[280vh]">
        
        {/* Sticky wrapper: sticks near top so the entire showcase card stays in full view */}
        <div className="sticky top-16 sm:top-20 z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-2">
          
          {/* Main Showcase Box */}
          <div className="relative bg-[#090909] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Tech grid texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* ── LEFT COLUMN: Speaker List ── */}
              <div
                ref={leftListRef}
                className="lg:col-span-7 flex flex-col gap-2.5 max-h-[460px] sm:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
              >
                {SPEAKERS.map((speaker, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={speaker.id}
                      data-speaker-id={speaker.id}
                      ref={(el) => { leftItemRefs.current[index] = el; }}
                      onClick={() => handleSpeakerSelect(index)}
                      className={`relative rounded-xl transition-all duration-200 cursor-pointer border text-left p-3.5 sm:p-4 ${
                        isActive
                          ? 'bg-white/[0.05] border-aws-orange/60 shadow-[0_0_20px_rgba(255,153,0,0.15)]'
                          : 'bg-[#111]/40 border-white/5 hover:border-white/15 hover:bg-white/[0.02]'
                      }`}
                    >
                      {/* AWS Orange vertical accent for active item */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-aws-orange rounded-l-xl" />
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1 min-w-0">
                          {speaker.isAnnounced ? (
                            <>
                              <div className="flex items-center gap-2">
                                <h4 className="font-sans font-black italic uppercase text-lg sm:text-xl text-white tracking-tight">
                                  {speaker.name}
                                </h4>
                                <span className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" title="Confirmed Speaker" />
                              </div>
                              <p className="font-mono text-xs font-bold uppercase tracking-wider text-aws-orange">
                                {speaker.designation} <span className="text-white/60">{speaker.company}</span>
                              </p>
                              <p className="font-sans text-xs text-white/70 line-clamp-1">
                                {speaker.sessionTitle}
                              </p>
                            </>
                          ) : (
                            <>
                              <h4 className="font-sans font-black italic uppercase text-base text-white/90">
                                {speaker.sessionTitle.split(':')[0]}
                              </h4>
                              <div className="w-40 sm:w-52 h-2 bg-white/10 rounded my-1" />
                              <p className="font-sans text-xs text-white/50 line-clamp-1">
                                {speaker.sessionTitle}
                              </p>
                            </>
                          )}
                        </div>

                        <div className="shrink-0 flex flex-col items-end justify-between gap-2">
                          {speaker.isAnnounced ? (
                            speaker.linkedin && (
                              <a
                                href={speaker.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-6 h-6 rounded bg-white/5 hover:bg-[#0A66C2] border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                                title="LinkedIn Profile"
                              >
                                <Linkedin size={12} />
                              </a>
                            )
                          ) : (
                            <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                              TO BE ANNOUNCED
                            </span>
                          )}

                          <span className="font-mono text-[10px] text-white/40 tracking-wider">
                            {speaker.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── RIGHT COLUMN: Full-Height Image with Bottom Overlay ── */}
              <div className="lg:col-span-5 relative h-[460px] sm:h-[500px] rounded-xl overflow-hidden bg-[#111] border border-white/10 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSpeaker.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative w-full h-full flex flex-col justify-end"
                  >
                    {/* Speaker Image */}
                    {activeSpeaker.image ? (
                      <img
                        src={activeSpeaker.image}
                        alt={activeSpeaker.name}
                        className="absolute inset-0 w-full h-full object-cover object-[center_18%]"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#111] via-[#090909] to-aws-orange/[0.05]">
                        <Radio size={28} className="text-aws-orange mb-2 animate-pulse" />
                        <span className="font-mono text-xs uppercase tracking-widest text-white/80 font-bold">
                          SPEAKER TO BE ANNOUNCED
                        </span>
                        <span className="font-mono text-[10px] text-white/40 mt-1">
                          Official reveal during community briefing
                        </span>
                      </div>
                    )}

                    {/* Dark gradient overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 pt-32 pb-5 px-5 bg-gradient-to-t from-[#090909] via-[#090909]/85 to-transparent flex flex-col justify-end space-y-2 z-10 text-left">
                      {/* Badge & LinkedIn Row */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-aws-orange/15 border border-aws-orange/30 text-aws-orange font-mono text-[10px] font-bold uppercase tracking-wider">
                          {activeSpeaker.badge}
                        </span>

                        {activeSpeaker.linkedin && (
                          <a
                            href={activeSpeaker.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-black/60 hover:bg-[#0A66C2] text-white border border-white/20 font-mono text-xs font-bold transition-all"
                          >
                            <Linkedin size={12} />
                            <span>LinkedIn</span>
                          </a>
                        )}
                      </div>

                      {/* Name, Role & Short Intro */}
                      <div className="space-y-0.5">
                        <h3 className="font-sans font-black italic uppercase text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                          {activeSpeaker.name}
                        </h3>

                        <p className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-aws-orange">
                          <span>{activeSpeaker.designation}</span>{' '}
                          <span className="text-white/60">{activeSpeaker.company}</span>
                        </p>

                        <p className="font-sans text-xs sm:text-sm text-white/80 leading-snug pt-1 line-clamp-2">
                          {activeSpeaker.sessionTitle}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* Scroll hint */}
          <div className="text-center mt-3 font-mono text-[10px] text-white/30 tracking-widest uppercase">
            <span>Scroll down to navigate speakers</span>
          </div>

        </div>
      </div>

      {/* ── 2. THIRD CARD: Standby Announcement & CFP (Preserved) ── */}
      <div className="max-w-4xl mx-auto relative z-10 py-16 px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-[#090909]/90 border border-white/10 rounded-2xl p-8 sm:p-14 text-center overflow-hidden backdrop-blur-sm shadow-[0_0_50px_rgba(0,0,0,0.6)]"
        >
          {/* Futuristic corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-aws-orange/40" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-aws-orange/40" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-aws-orange/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-aws-orange/40" />

          {/* Laser scanning line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-aws-orange/30 to-transparent animate-[scan_3s_ease-in-out_infinite]" />

          {/* Status HUD Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-aws-orange font-mono text-[9px] sm:text-[10px] tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-aws-orange animate-ping" />
            <Radio size={12} className="text-aws-orange" />
            <span>PADDOCK STATUS // LINEUP IN ASSEMBLY</span>
          </div>

          {/* Icon HUD */}
          <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-dashed border-aws-orange/30 flex items-center justify-center mb-6 bg-gradient-to-b from-aws-orange/10 to-transparent">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-aws-orange shadow-[0_0_20px_rgba(255,153,0,0.2)]">
              <Mic className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
          </div>

          <h3 className="font-sans font-black italic text-2xl sm:text-4xl uppercase tracking-tight text-white mb-3">
            Speaker Lineup Revealing Soon
          </h3>

          <p className="font-sans text-xs sm:text-sm text-white/50 max-w-lg mx-auto leading-relaxed mb-8">
            We are assembling an inspiring roster of AWS heroes, community champions, and cloud innovators. 
            Keynotes, deep-dive technical talks, and panel sessions will be announced here shortly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/cfp"
              className="inline-flex items-center gap-2 px-6 py-3 bg-aws-orange text-black font-sans font-black italic uppercase text-[11px] tracking-wider skew-x-[-10deg] hover:bg-white transition-all shadow-[0_0_20px_rgba(255,153,0,0.25)] group"
            >
              <span className="skew-x-[10deg] flex items-center gap-2">
                <Sparkles size={13} />
                <span>Call For Speakers (CFP)</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>

            <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase flex items-center gap-1.5">
              <Layers size={11} className="text-aws-orange/60" />
              <span>SUBMISSIONS OPEN FOR CLOUD BUILDERS</span>
            </span>
          </div>
        </motion.div>
      </div>

    </section>
  );
};
