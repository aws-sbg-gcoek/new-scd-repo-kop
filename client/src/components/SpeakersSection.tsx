import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { SectionHeader } from './LayoutElements';
import { 
  Radio, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  Ticket, 
  X, 
  Terminal, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Cloud, 
  Users, 
  Binary, 
  Workflow, 
  Award,
  Lock,
  ChevronRight
} from 'lucide-react';

interface TeaserSlot {
  id: number;
  track: string;
  badge: string;
  sector: string;
  headline: string;
  focus: string;
  description: string;
  statusBadge: string;
  iconName: string;
}

const TEASER_TRACKS: TeaserSlot[] = [
  {
    id: 1,
    track: "AWS Global Keynote",
    badge: "GLOBAL KEYNOTE",
    sector: "SECTOR-A1",
    headline: "Cloud Innovation & The Next Generation of Builders",
    focus: "AWS Global Community, Builder Culture & Future Tech",
    description: "An inspiring opening keynote diving into the global momentum of student builders, cloud innovation, and strategies to thrive in the modern tech ecosystem.",
    statusBadge: "IN PADDOCK // REVEALING AT EVENT",
    iconName: "award"
  },
  {
    id: 2,
    track: "Community Leadership Keynote",
    badge: "COMMUNITY KEYNOTE",
    sector: "SECTOR-B2",
    headline: "Cloud Careers, Certifications & Community Impact",
    focus: "AWS Certifications, High-Impact Networking & Career Growth",
    description: "Actionable frameworks to accelerate your cloud journey through active community contribution, industry certifications, and leadership within the AWS ecosystem.",
    statusBadge: "IN PADDOCK // REVEALING AT EVENT",
    iconName: "users"
  },
  {
    id: 3,
    track: "Technical Architecture Keynote",
    badge: "TECH KEYNOTE",
    sector: "SECTOR-C3",
    headline: "Architecting Modern Resilient Systems on AWS",
    focus: "Serverless, Containers, Managed Databases & Event-Driven Systems",
    description: "A deep dive into building enterprise-grade, highly scalable cloud architectures using modern serverless pipelines, containerized workloads, and resilient AWS services.",
    statusBadge: "STANDBY // REVEALING AT EVENT",
    iconName: "cloud"
  },
  {
    id: 4,
    track: "DevOps & Cloud Automation",
    badge: "DEVOPS & SRE",
    sector: "SECTOR-D4",
    headline: "Zero-Downtime CI/CD & Infrastructure as Code",
    focus: "Infrastructure as Code, Automated Pipelines & Reliability",
    description: "Industry practices for building reliable continuous delivery workflows, managing infrastructure declaratively, and scaling automated operational systems on AWS.",
    statusBadge: "STANDBY // REVEALING AT EVENT",
    iconName: "workflow"
  },
  {
    id: 5,
    track: "Generative AI on AWS",
    badge: "GEN-AI & ML",
    sector: "SECTOR-E5",
    headline: "Enterprise AI Workflows with Amazon Bedrock",
    focus: "Foundation Models, RAG Pipelines & Intelligent Agents",
    description: "Hands-on engineering perspectives on deploying scalable AI applications, retrieval-augmented generation (RAG), and security guardrails using Amazon Bedrock.",
    statusBadge: "STANDBY // REVEALING AT EVENT",
    iconName: "binary"
  },
  {
    id: 6,
    track: "Cloud Security & Threat Defense",
    badge: "SECURITY & IAM",
    sector: "SECTOR-F6",
    headline: "Hardening Cloud Workloads & Zero-Trust Defense",
    focus: "IAM Least-Privilege, Threat Detection & Compliance Guardrails",
    description: "Essential cloud security fundamentals: securing cloud infrastructure against vulnerabilities, auditing access with AWS IAM, and enforcing proactive defense baselines.",
    statusBadge: "STANDBY // REVEALING AT EVENT",
    iconName: "shield"
  },
  {
    id: 7,
    track: "High-Performance Compute & Kubernetes",
    badge: "COMPUTE & CLOUD",
    sector: "SECTOR-G7",
    headline: "Scaling Microservices with Amazon ECS, EKS & Lambda",
    focus: "Distributed Compute, Auto-scaling Patterns & Cost Optimization",
    description: "Practical engineering lessons on managing containerized workloads, comparing serverless compute with managed Kubernetes, and minimizing cloud latency.",
    statusBadge: "STANDBY // REVEALING AT EVENT",
    iconName: "cpu"
  },
  {
    id: 8,
    track: "Women in Tech Leadership Panel",
    badge: "SPECIAL PANEL",
    sector: "SECTOR-H8",
    headline: "Empowering Women in Tech & Cloud Engineering",
    focus: "Career Journeys, Mentorship, Tech Leadership & Diversity",
    description: "An inspiring panel bringing together trailblazing women engineers and leaders to share their career journeys, insights, and roadmaps for the next generation in tech.",
    statusBadge: "IN PADDOCK // REVEALING AT EVENT",
    iconName: "sparkles"
  }
];

const renderTrackIcon = (iconName: string, className = "w-6 h-6") => {
  switch (iconName) {
    case 'award': return <Award className={className} />;
    case 'users': return <Users className={className} />;
    case 'cloud': return <Cloud className={className} />;
    case 'workflow': return <Workflow className={className} />;
    case 'binary': return <Binary className={className} />;
    case 'shield': return <ShieldCheck className={className} />;
    case 'cpu': return <Cpu className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export const SpeakersSection = () => {
  const [selectedSlot, setSelectedSlot] = useState<TeaserSlot | null>(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedSlot) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSlot]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSlot(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="speakers" className="relative py-20 sm:py-28 px-4 sm:px-12 lg:px-24 bg-[#050505] overflow-hidden" aria-label="Speakers section">
      {/* Decorative track line and subtle background glow */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] sm:w-[650px] h-[300px] bg-aws-orange/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="mb-12 max-w-7xl mx-auto">
        <SectionHeader 
          title="Speakers" 
          subtitle="Our speaker lineup is currently being assembled in the paddock. To see who takes the stage, attend AWS Student Community Day Kolhapur live!" 
          sysId="02.SPK" 
        />
      </div>

      {/* Live Paddock Status Banner */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-10 relative z-10">
        <div className="p-4 sm:px-6 sm:py-3.5 bg-[#090909] border border-white/5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-aws-orange animate-ping" />
            <span className="font-mono text-[9px] sm:text-[10px] text-aws-orange uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Radio size={12} className="text-aws-orange" />
              PADDOCK STATUS // LINEUP REVEALING AT EVENT
            </span>
          </div>
          <div className="font-mono text-[9px] sm:text-[10px] text-white/50 tracking-wider flex items-center gap-2">
            <span className="text-white/30 hidden md:inline">EVENT DATE:</span>
            <span className="text-white font-semibold">STAGE REVEAL // NOV 2026</span>
            <span className="text-white/20">|</span>
            <a 
              href="#tickets" 
              className="text-aws-orange hover:text-white underline underline-offset-2 transition-colors flex items-center gap-1 font-bold"
            >
              <span>Get Pass to Attend</span>
              <ChevronRight size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* Cyber Teaser Grid: 8 Track Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto relative z-10">
        {TEASER_TRACKS.map((slot, i) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            className="group relative cursor-pointer h-full"
            onClick={() => setSelectedSlot(slot)}
          >
            {/* Card Body */}
            <div className="relative bg-[#0d0d0d] border border-white/5 h-full overflow-hidden flex flex-col justify-start p-5 sm:p-6 transition-all duration-500 hover:border-aws-orange/40 hover:shadow-[0_0_30px_rgba(255,153,0,0.12)] rounded-xl">
              
              {/* Corner tech accents */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 group-hover:border-aws-orange/40 transition-colors pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/10 group-hover:border-aws-orange/40 transition-colors pointer-events-none" />

              {/* Background gradient that shifts on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF9900]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Top - Grid Position & Sector */}
              <div className="relative z-10 flex justify-between items-center font-mono text-[8px] sm:text-[9px] text-white/40 uppercase tracking-widest">
                <span>Staging Grid // 0{slot.id}</span>
                <span className="font-bold text-aws-orange/70 group-hover:text-aws-orange transition-colors">
                  {slot.sector}
                </span>
              </div>

              {/* Center - Holographic Cyber Avatar HUD */}
              <div className="relative z-10 flex-1 flex items-center justify-center my-5 sm:my-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/10 flex items-center justify-center relative bg-white/[0.01] shrink-0">
                  {/* Concentric rotating dashed borders */}
                  <div className="absolute inset-[-4px] rounded-full border border-dashed border-aws-orange/40 group-hover:animate-[spin_6s_linear_infinite]" />
                  <div className="absolute inset-[-8px] rounded-full border border-dashed border-white/10 group-hover:border-f1-red/30 group-hover:animate-[spin_4s_linear_reverse_infinite]" />
                  
                  {/* Inner Silhouette HUD */}
                  <div className="w-full h-full rounded-full overflow-hidden border border-white/10 relative bg-[#070707] flex flex-col items-center justify-center text-aws-orange group-hover:text-white transition-colors shadow-inner">
                    <div className="p-2.5 rounded-full bg-aws-orange/10 border border-aws-orange/20 mb-1 group-hover:scale-110 group-hover:bg-aws-orange group-hover:text-black transition-all duration-300">
                      {renderTrackIcon(slot.iconName, "w-6 h-6")}
                    </div>
                    <span className="font-mono text-[7px] text-white/40 uppercase tracking-widest">
                      CLASSIFIED
                    </span>

                    {/* Scanning laser line animation */}
                    <div className="absolute inset-0 w-full h-[2px] bg-aws-orange/80 shadow-[0_0_8px_#FF9900] opacity-0 group-hover:opacity-100 animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Bottom - Info */}
              <div className="relative z-10 border-t border-white/5 pt-4 text-left mt-auto flex flex-col justify-start">
                <div className="mb-2">
                  <span className="text-[7.5px] sm:text-[8.5px] font-mono px-2 py-0.5 bg-aws-orange/10 border border-aws-orange/25 text-aws-orange rounded uppercase font-bold tracking-wider inline-block">
                    {slot.badge}
                  </span>
                </div>

                <h3 className="font-sans font-black italic text-base sm:text-lg uppercase tracking-tight text-white group-hover:text-aws-orange transition-colors">
                  Speaker Revealing Soon
                </h3>

                <p className="font-mono text-[9px] sm:text-[10px] text-white/60 tracking-wider mt-1 font-semibold line-clamp-1">
                  {slot.track}
                </p>

                <p className="font-sans text-[11px] text-white/40 mt-1.5 leading-relaxed line-clamp-2">
                  {slot.headline}
                </p>

                {/* Event Teaser Pill */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[8.5px] text-white/40">
                  <span className="flex items-center gap-1.5 text-aws-orange font-bold">
                    <Eye size={11} />
                    <span>TO SEE: ATTEND EVENT</span>
                  </span>
                  <span className="text-white/30 group-hover:text-white transition-colors flex items-center gap-0.5">
                    <span>DETAILS</span>
                    <ArrowRight size={10} />
                  </span>
                </div>
              </div>

              {/* Scanning laser line effect on card edge */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-aws-orange opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_#FF9900]" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dual Paddock Action Banner Below Grid */}
      <div className="max-w-7xl mx-auto mt-12 sm:mt-16 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Banner 1: Attend Event to See Lineup */}
        <div className="relative bg-[#090909] border border-white/10 rounded-2xl p-6 sm:p-8 overflow-hidden backdrop-blur-sm group hover:border-aws-orange/40 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-aws-orange/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-aws-orange/10 border border-aws-orange/20 text-aws-orange font-mono text-[9px] uppercase tracking-widest font-bold mb-3">
                <Ticket size={11} />
                <span>EXPERIENCE ALL SESSIONS LIVE</span>
              </div>
              <h4 className="font-sans font-black italic text-xl sm:text-2xl uppercase tracking-tight text-white mb-2">
                Want to See Who Takes The Stage?
              </h4>
              <p className="font-sans text-xs sm:text-sm text-white/60 leading-relaxed mb-6">
                All 8+ keynotes, technical deep-dives, and hands-on workshops will be revealed and delivered live on stage at AWS Student Community Day Kolhapur. Secure your event pass now!
              </p>
            </div>
            <div>
              <a
                href="#tickets"
                className="inline-flex items-center gap-2 px-6 py-3 bg-aws-orange text-black font-sans font-black italic uppercase text-xs tracking-wider rounded skew-x-[-8deg] hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(255,153,0,0.25)] group/btn cursor-pointer"
              >
                <span className="skew-x-[8deg] flex items-center gap-2">
                  <Ticket size={14} />
                  <span>Get Your Event Pass</span>
                  <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Banner 2: Call for Speakers / Become Speaker */}
        <div className="relative bg-[#090909] border border-white/10 rounded-2xl p-6 sm:p-8 overflow-hidden backdrop-blur-sm group hover:border-white/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/[0.04] border border-white/15 text-white/80 font-mono text-[9px] uppercase tracking-widest font-bold mb-3">
                <Sparkles size={11} className="text-aws-orange" />
                <span>CALL FOR SPEAKERS (CFP)</span>
              </div>
              <h4 className="font-sans font-black italic text-xl sm:text-2xl uppercase tracking-tight text-white mb-2">
                Are You a Cloud Builder or Speaker?
              </h4>
              <p className="font-sans text-xs sm:text-sm text-white/60 leading-relaxed mb-6">
                Have practical expertise in AWS Cloud, Serverless, DevOps, Security, or AI? Submit your talk proposal or register your interest to take the stage at our upcoming events.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/cfp"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.04] border border-white/20 text-white font-sans font-bold italic uppercase text-xs tracking-wider rounded skew-x-[-8deg] hover:border-aws-orange/60 hover:text-aws-orange hover:bg-white/[0.08] transition-all group/btn"
              >
                <span className="skew-x-[8deg] flex items-center gap-2">
                  <Sparkles size={13} className="text-aws-orange" />
                  <span>Submit Speaker Proposal</span>
                  <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </Link>
              <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase flex items-center gap-1.5">
                <Layers size={11} className="text-aws-orange/60" />
                <span>COMMUNITY PROPOSALS</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Classified Telemetry Detail Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedSlot && (
            <div 
              className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-10"
              role="dialog"
              aria-label="Speaker Telemetry Modal"
              aria-modal="true"
            >
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSlot(null)}
                className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              />

              {/* Modal Box */}
              <motion.div
                data-lenis-prevent
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                className="relative w-full max-w-4xl bg-[#0b0b0b] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,153,0,0.05)] z-10 flex flex-col max-h-[90vh] md:max-h-[85vh]"
              >
                {/* Scanline overlay for cyber effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-40" />

                {/* Top Cyber HUD Bar */}
                <div className="relative border-b border-white/5 bg-[#0e0e0e] px-6 py-3 flex justify-between items-center text-[10px] font-mono tracking-widest text-white/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-aws-orange animate-ping" />
                    <span className="text-aws-orange font-bold">PADDOCK TELEMETRY // TRACK 0{selectedSlot.id}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden sm:inline">SECTOR: {selectedSlot.sector}</span>
                    <button 
                      type="button" 
                      onClick={() => setSelectedSlot(null)}
                      className="p-1 hover:text-white text-white/50 transition-colors border border-white/5 hover:border-aws-orange/30 rounded bg-white/[0.02] cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Tech HUD Avatar */}
                    <div className="md:col-span-4 flex flex-col items-center">
                      <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full p-2 bg-gradient-to-tr from-f1-red/20 via-transparent to-aws-orange/20 border border-white/5">
                        {/* Concentric rotating design lines */}
                        <div className="absolute inset-0 rounded-full border border-dashed border-aws-orange/30 animate-[spin_12s_linear_infinite]" />
                        <div className="absolute inset-1 rounded-full border border-dashed border-white/20 animate-[spin_8s_linear_reverse_infinite]" />
                        
                        <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-aws-orange/40 shadow-[0_0_20px_rgba(255,153,0,0.15)] bg-[#050505] flex flex-col items-center justify-center text-aws-orange">
                          <div className="p-4 rounded-full bg-aws-orange/10 border border-aws-orange/30 mb-2">
                            {renderTrackIcon(selectedSlot.iconName, "w-10 h-10")}
                          </div>
                          <span className="font-mono text-[9px] tracking-widest text-white/60 font-bold">
                            REVEALING AT EVENT
                          </span>
                          
                          {/* Laser line scanner animation */}
                          <div className="absolute inset-0 w-full h-[2px] bg-aws-orange shadow-[0_0_8px_#FF9900] animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
                        </div>
                      </div>

                      {/* Quick Telemetry Stats */}
                      <div className="w-full mt-6 bg-white/[0.02] border border-white/5 rounded-lg p-3 font-mono text-[9px] text-white/40 flex flex-col gap-1.5">
                        <div className="flex justify-between">
                          <span>STAGE STATUS:</span>
                          <span className="text-emerald-400 font-semibold">PREPARING</span>
                        </div>
                        <div className="flex justify-between">
                          <span>IDENTITY:</span>
                          <span className="text-aws-orange font-semibold">CLASSIFIED</span>
                        </div>
                        <div className="flex justify-between">
                          <span>REVEAL VENUE:</span>
                          <span className="text-white/80 font-semibold">KOLHAPUR COMMUNITY STAGE</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Information */}
                    <div className="md:col-span-8 flex flex-col text-left">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-[10px] font-mono tracking-widest text-aws-orange uppercase bg-aws-orange/10 border border-aws-orange/20 px-2.5 py-0.5 rounded font-bold">
                          {selectedSlot.badge}
                        </span>
                        <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                          {selectedSlot.sector}
                        </span>
                      </div>

                      <h2 className="font-sans font-black italic text-2xl sm:text-3xl md:text-4xl uppercase tracking-tighter text-white leading-none mb-2">
                        {selectedSlot.track}
                      </h2>

                      <div className="font-mono text-xs text-aws-orange font-bold mb-4 flex items-center gap-1.5">
                        <Terminal size={12} />
                        {selectedSlot.headline}
                      </div>

                      <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg mb-6">
                        <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-sans">
                          {selectedSlot.description}
                        </p>
                      </div>

                      {/* Session Parameters Box */}
                      <div className="bg-[#121212] border border-white/5 rounded-xl p-4 sm:p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-aws-orange/5 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30 mb-2 flex items-center gap-1.5">
                          <Sparkles size={10} className="text-aws-orange" /> Focus Areas & Takeaways
                        </div>
                        
                        <p className="font-mono text-xs text-white/80 font-bold mb-2">
                          {selectedSlot.focus}
                        </p>

                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-white/50 font-mono text-[10px]">
                          <Lock size={12} className="text-aws-orange" />
                          <span>Speaker details and slides will be unlocked during live presentation.</span>
                        </div>
                      </div>

                      {/* Attend CTA inside modal */}
                      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <a
                          href="#tickets"
                          onClick={() => setSelectedSlot(null)}
                          className="px-6 py-2.5 bg-aws-orange text-black font-sans font-black italic uppercase text-xs tracking-wider rounded skew-x-[-8deg] hover:bg-white transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,153,0,0.2)]"
                        >
                          <span className="skew-x-[8deg] flex items-center gap-1.5">
                            <Ticket size={13} />
                            <span>Get Pass To Attend Live</span>
                          </span>
                        </a>

                        <Link
                          to="/cfp"
                          onClick={() => setSelectedSlot(null)}
                          className="px-5 py-2.5 border border-white/10 hover:border-aws-orange/40 text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider rounded transition-colors text-center flex items-center justify-center gap-1.5"
                        >
                          <Sparkles size={12} className="text-aws-orange" />
                          <span>Call For Speakers</span>
                        </Link>
                      </div>

                    </div>

                  </div>
                </div>

                {/* Bottom Cyber HUD Footer */}
                <div className="border-t border-white/5 bg-[#0e0e0e] px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="font-mono text-[8px] tracking-widest text-white/30">
                    STAGE PREPARATIONS ACTIVE // SEE YOU AT THE EVENT
                  </span>
                  <button 
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="w-full sm:w-auto px-5 py-2 bg-white/[0.04] hover:bg-white/10 text-white font-mono text-[10px] tracking-widest uppercase transition-colors rounded cursor-pointer text-center border border-white/5"
                  >
                    Close Telemetry
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
