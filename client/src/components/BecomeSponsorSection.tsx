import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeader } from './LayoutElements';
import {
  Mail,
  ArrowUpRight,
  Trophy,
  Users,
  GraduationCap,
  Dumbbell,
  MapPin,
  Sparkles,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Activity,
  Flame,
  ShieldCheck,
  Instagram,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SponsorGalleryItem {
  src: string;
  title: string;
  subtitle: string;
  badge: string;
}

const XL_GYM_GALLERY: SponsorGalleryItem[] = [
  {
    src: '/xl-gym-poster.jpg',
    title: 'Flagship Facility Exterior',
    subtitle: '1st Floor, Desai house, 7th Ln, near Lucky Bazar, Rajarampuri, Kolhapur',
    badge: 'ENTRANCE'
  },
  {
    src: '/xl-gym-cardio.jpg',
    title: 'Cardio & StarTrac Arena',
    subtitle: 'High-end endurance treadmills & sprint lane',
    badge: 'CARDIO ZONE'
  },
  {
    src: '/xl-gym-office.jpg',
    title: 'Consultation & InBody Desk',
    subtitle: 'Decathlon alliance & certified nutrition guidance',
    badge: 'WELLNESS'
  },
  {
    src: '/xl-gym-group.jpg',
    title: 'Endurance & Athlete Community',
    subtitle: 'CrossFit, kettlebells & functional fitness squad',
    badge: 'COMMUNITY'
  }
];

export const BecomeSponsorSection = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('awssbggcoek@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const closeLightbox = useCallback(() => {
    setActiveImageIdx(null);
  }, []);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIdx((prev) => (prev !== null ? (prev + 1) % XL_GYM_GALLERY.length : null));
  }, []);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIdx((prev) => (prev !== null ? (prev - 1 + XL_GYM_GALLERY.length) % XL_GYM_GALLERY.length : null));
  }, []);

  // Lock body scroll and handle keyboard navigation when modal is open
  useEffect(() => {
    if (activeImageIdx === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeImageIdx, closeLightbox, nextImage, prevImage]);

  const activeImage = activeImageIdx !== null ? XL_GYM_GALLERY[activeImageIdx] : null;

  return (
    <section id="sponsors" className="relative py-20 sm:py-28 px-4 sm:px-12 lg:px-24 bg-[#050505] border-t border-white/5 overflow-hidden" aria-label="Sponsors and Partners">
      {/* Background high-tech accents matching website */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute -top-1/4 right-0 w-[600px] h-[600px] bg-aws-orange/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-f1-red/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/4 left-0 w-[500px] h-[500px] bg-aws-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full relative z-10 max-w-7xl mx-auto space-y-20 sm:space-y-28">

        {/* ========================================================================= */}
        {/* ACT 1: OFFICIAL EVENT SPONSORS SHOWCASE                                   */}
        {/* ========================================================================= */}
        <div>
          <SectionHeader
            title="Event Sponsors & Partners"
            subtitle="Proudly backed by forward-thinking industry, fitness, and regional leaders empowering Western Maharashtra's next generation of student builders."
            sysId="05.SPN"
          />

          {/* Featured Sponsor Card: The XL Gym - Styled exactly like SCD website */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 rounded-2xl border border-white/10 hover:border-aws-orange/40 bg-[#0a0a0a] p-6 sm:p-10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,153,0,0.06)] group transition-all duration-500"
          >
            {/* Top Orange Cyber Racing Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-aws-orange to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            
            {/* Cyber Corner Accents */}
            <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-white/20 group-hover:border-aws-orange/60 transition-colors pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-white/20 group-hover:border-aws-orange/60 transition-colors pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Brand details & perks (7 cols) */}
              <div className="lg:col-span-7 space-y-5 text-left">
                
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-aws-orange/10 border border-aws-orange/30 text-aws-orange font-mono text-[9px] font-bold uppercase tracking-widest">
                    <Dumbbell size={11} className="text-aws-orange" />
                    <span>Official Fitness Partner</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-white/50 font-mono text-[9px] uppercase tracking-wider">
                    <Sparkles size={10} className="text-aws-orange" />
                    <span>SCD Kolhapur 2026</span>
                  </div>
                </div>

                {/* Brand Logo & Name */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl p-1 bg-[#111] border border-white/10 shadow-[0_0_20px_rgba(255,153,0,0.15)] shrink-0 group-hover:border-aws-orange/50 transition-colors flex items-center justify-center overflow-hidden">
                    <img
                      src="/xl-gym-badge.png"
                      alt="The XL Gym Logo"
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-sans text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white leading-none">
                      The XL Gym
                    </h3>
                    <p className="font-mono text-xs sm:text-sm text-aws-orange font-semibold italic mt-1">
                      Fitness is life <span className="text-white/40 font-normal not-italic text-[11px]">· Powered by Being Fit</span>
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=1st+Floor,+Desai+house,+7th+Ln,+near+Lucky+Bazar,+Rajarampuri,+Kolhapur,+Maharashtra+416008"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 mt-3 px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/10 hover:border-aws-orange/60 hover:bg-white/[0.04] transition-all group/map shadow-md"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 group-hover/map:scale-105 transition-transform">
                        <MapPin size={16} className="text-red-400" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-aws-orange font-bold flex items-center gap-1">
                          Gym Location · Open in Google Maps <ArrowUpRight size={10} className="inline opacity-70 group-hover/map:translate-x-0.5 group-hover/map:-translate-y-0.5 transition-transform" />
                        </span>
                        <span className="font-sans text-xs text-white/90 group-hover/map:text-white leading-snug transition-colors">
                          1st Floor, Desai house, 7th Ln, near Lucky Bazar, Rajarampuri, Kolhapur, MH 416008
                        </span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Description */}
                <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed max-w-2xl">
                  Empowering Western Maharashtra's student developer summit with health, endurance, and elite conditioning. The XL Gym is Kolhapur's premier modern training center featuring world-class StarTrac cardio technology, CrossFit functional zones, and certified athletic conditioning.
                </p>

                {/* Telemetry Feature Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-mono text-xs">
                  <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 px-3 py-2.5 rounded-lg group/pill hover:border-white/20 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-aws-orange shrink-0" />
                    <span className="text-white/80 text-[11px]">StarTrac Pro Cardio & Sprint Track</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 px-3 py-2.5 rounded-lg group/pill hover:border-white/20 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-aws-orange shrink-0" />
                    <span className="text-white/80 text-[11px]">CrossFit & Functional Training Arena</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 px-3 py-2.5 rounded-lg group/pill hover:border-white/20 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-aws-orange shrink-0" />
                    <span className="text-white/80 text-[11px]">InBody 370 Composition & Nutrition</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 px-3 py-2.5 rounded-lg group/pill hover:border-white/20 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-aws-orange shrink-0" />
                    <span className="text-white/80 text-[11px]">Decathlon Certified Equipment Alliance</span>
                  </div>
                </div>

                {/* Direct Contact & Social */}
                <div className="flex flex-wrap items-center gap-3 pt-2">

                  {/* Instagram — Gym Official */}
                  <a
                    href="https://www.instagram.com/thexlgymkolhapur/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gradient-to-br from-[#833ab4]/20 via-[#fd1d1d]/15 to-[#fcb045]/15 border border-[#fd1d1d]/40 hover:border-[#fd1d1d]/80 hover:scale-[1.02] transition-all group/insta shadow-lg"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shrink-0 shadow-md group-hover/insta:rotate-6 transition-transform">
                      <Instagram size={17} className="text-white" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-pink-300 font-bold flex items-center gap-1">
                        Gym Instagram <ArrowUpRight size={10} className="inline opacity-70 group-hover/insta:translate-x-0.5 group-hover/insta:-translate-y-0.5 transition-transform" />
                      </span>
                      <span className="font-sans text-xs font-bold text-white group-hover/insta:text-pink-100 transition-colors leading-tight">
                        @thexlgymkolhapur
                      </span>
                    </div>
                  </a>

                  {/* Instagram / Contact Person — Shiva Kanse */}
                  <a
                    href="https://www.instagram.com/shivakanse_?cplk=MXZ1ZGM4a2RyZjdvMw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/15 hover:border-aws-orange/60 hover:bg-white/[0.04] hover:scale-[1.02] transition-all group/contact shadow-lg"
                  >
                    <div className="w-8 h-8 rounded-lg bg-aws-orange/20 border border-aws-orange/40 flex items-center justify-center shrink-0 shadow-md group-hover/contact:rotate-6 transition-transform">
                      <Instagram size={17} className="text-aws-orange" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-aws-orange font-bold flex items-center gap-1">
                        Contact Person <ArrowUpRight size={10} className="inline opacity-70 group-hover/contact:translate-x-0.5 group-hover/contact:-translate-y-0.5 transition-transform" />
                      </span>
                      <span className="font-sans text-xs font-bold text-white group-hover/contact:text-aws-orange transition-colors leading-tight">
                        Shiva Kanse <span className="font-mono text-[10px] text-white/50 font-normal">(@shivakanse_)</span>
                      </span>
                    </div>
                  </a>

                  {/* Phone / Call / WhatsApp */}
                  <a
                    href="tel:+919371629175"
                    className="inline-flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-500/25 hover:scale-[1.02] transition-all group/phone shadow-lg"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/25 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-md group-hover/phone:rotate-6 transition-transform">
                      <Phone size={17} className="text-emerald-400" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 font-bold">
                        Call / WhatsApp
                      </span>
                      <span className="font-sans text-xs font-bold text-white group-hover/phone:text-emerald-100 transition-colors leading-tight">
                        +91 93716 29175
                      </span>
                    </div>
                  </a>

                </div>

              </div>

              {/* Right Column: Interactive 4-Photo Telemetry Grid (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-white/50 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-aws-orange animate-ping" />
                    <span className="uppercase tracking-widest text-[10px] text-aws-orange font-bold">GYM ARENA TELEMETRY</span>
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">Click to view ↗</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {XL_GYM_GALLERY.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className="group/img relative rounded-xl overflow-hidden border border-white/10 hover:border-aws-orange/50 bg-[#050505] aspect-[4/3] focus:outline-none focus:ring-1 focus:ring-aws-orange transition-all duration-300 cursor-pointer text-left"
                    >
                      <img
                        src={img.src}
                        alt={img.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover/img:opacity-90 transition-opacity" />
                      
                      {/* Corner Cyber Accents on Tile */}
                      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 border-t border-r border-white/20 group-hover/img:border-aws-orange/70 transition-colors" />

                      {/* Badge */}
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 font-mono text-[8px] text-aws-orange font-bold uppercase tracking-wider">
                        {img.badge}
                      </span>

                      {/* Expand Icon */}
                      <div className="absolute top-2 right-2 w-5 h-5 rounded bg-black/70 border border-white/10 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <Maximize2 size={10} className="text-white" />
                      </div>

                      {/* Title at bottom */}
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-[10px] font-sans font-bold text-white truncate leading-tight">
                          {img.title}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* ACT 2: BECOME A SPONSOR / APPLICATION CONSOLE                              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Information & Details */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <SectionHeader
              title="Become a Sponsor"
              subtitle="Partner with one of Western Maharashtra's largest student-driven cloud conferences. Empower regional talent, showcase your products, and connect with emerging cloud builders."
              sysId="05.SPN"
            />
            
            {/* Sponsoring Highlights / Benefits */}
            <div className="flex flex-col gap-5 mt-2">
              
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-aws-orange/10 border border-aws-orange/20 flex items-center justify-center shrink-0 mt-1">
                  <GraduationCap className="text-aws-orange" size={20} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-sm uppercase tracking-wider mb-1">Empower Regional Talent</h4>
                  <p className="font-sans text-xs text-white/50 leading-relaxed">
                    Enable hands-on workshops, cloud engineering learning paths, and active developer projects for students in Western Maharashtra.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-aws-orange/10 border border-aws-orange/20 flex items-center justify-center shrink-0 mt-1">
                  <Trophy className="text-aws-orange" size={20} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-sm uppercase tracking-wider mb-1">Elevate Brand Visibility</h4>
                  <p className="font-sans text-xs text-white/50 leading-relaxed">
                    Gain high-impact exposure across digital platforms, stage backdrops, student badges, marketing flyers, and expo stall areas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-aws-orange/10 border border-aws-orange/20 flex items-center justify-center shrink-0 mt-1">
                  <Users className="text-aws-orange" size={20} />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-white text-sm uppercase tracking-wider mb-1">Direct Recruitment Pipeline</h4>
                  <p className="font-sans text-xs text-white/50 leading-relaxed">
                    Interact directly with top-tier student builders, developers, and cloud enthusiasts for hiring, internships, and mentoring.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: High-tech HUD Console Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0c0c0c]/80 backdrop-blur-md overflow-hidden shadow-2xl"
            >
              {/* Racing orange accent bar */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-aws-orange to-red-600" />
              
              {/* Corner tech lines */}
              <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/20" />
              <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/20" />

              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-aws-orange block mb-2 font-bold">
                PARTNERSHIP CIRCUIT / SCD.2026
              </span>
              <h3 className="font-sans text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-6 italic">
                Sponsorship Console
              </h3>

              {/* Grid of Outreach Metrics */}
              <div className="grid grid-cols-2 gap-6 mb-8 bg-white/[0.02] border border-white/5 p-4 rounded-xl font-mono text-left">
                <div>
                  <span className="text-[9px] uppercase text-white/40 block tracking-wider mb-1">Community Reach</span>
                  <span className="text-sm font-black text-white">1,000+ Members</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-white/40 block tracking-wider mb-1">Expected Participants</span>
                  <span className="text-sm font-black text-white">250–300 Builders</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-white/40 block tracking-wider mb-1">Date</span>
                  <span className="text-sm font-black text-white">1st November 2026</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-white/40 block tracking-wider mb-1">Venue</span>
                  <span className="text-sm font-black text-white">V.T. Patil Hall, Kolhapur</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                <Link
                  to="/sponsors"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-aws-orange text-black font-sans font-black italic uppercase text-xs tracking-widest skew-x-[-10deg] transition-all hover:bg-white hover:text-black shadow-[0_0_20px_rgba(255,153,0,0.2)] cursor-pointer"
                >
                  <span className="skew-x-[10deg] flex items-center gap-1.5">
                    Apply to Sponsor <ArrowUpRight size={14} />
                  </span>
                </Link>

                <div className="flex items-center justify-center gap-3">
                  <div className="h-px bg-white/5 flex-1" />
                  <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">or email us</span>
                  <div className="h-px bg-white/5 flex-1" />
                </div>

                <button type="button"
                  onClick={handleCopyEmail}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-white font-mono text-[10px] uppercase tracking-widest hover:border-white/30 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Mail size={12} className="text-aws-orange" />
                  {copiedEmail ? "Copied to clipboard!" : "awssbggcoek@gmail.com"}
                </button>
              </div>

            </motion.div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* DIRECT VIEWPORT LIGHTBOX (Portaled directly to document.body)              */}
      {/* ========================================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeImage && (
            <div
              className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-10"
              role="dialog"
              aria-label="Sponsor Photo Lightbox"
              aria-modal="true"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeLightbox}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                data-lenis-prevent
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
                className="relative w-full max-w-4xl bg-[#0b0b0b] border border-white/15 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,153,0,0.1)] z-10 flex flex-col max-h-[92vh]"
              >
                {/* Top Cyber HUD Bar */}
                <div className="relative border-b border-white/10 bg-[#0e0e0e] px-4 sm:px-6 py-3 flex justify-between items-center text-[10px] font-mono tracking-widest text-white/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-aws-orange animate-ping" />
                    <span className="text-aws-orange font-bold uppercase">
                      SPONSOR TELEMETRY // {activeImage.badge}
                    </span>
                    <span className="text-white/30 hidden sm:inline">
                      [{((activeImageIdx ?? 0) + 1).toString().padStart(2, '0')}/04]
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-white/30 hidden sm:inline text-[9px]">ESC TO CLOSE</span>
                    <button
                      type="button"
                      onClick={closeLightbox}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                      aria-label="Close"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Main Image Area with Left / Right Navigation */}
                <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[460px] max-h-[70vh]">
                  <img
                    src={activeImage.src}
                    alt={activeImage.title}
                    className="max-h-[70vh] w-auto max-w-full object-contain select-none"
                  />

                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 p-2.5 rounded-full bg-black/70 border border-white/10 text-white/70 hover:text-white hover:bg-black hover:border-aws-orange/50 transition-all z-20 cursor-pointer"
                    aria-label="Previous Photo"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 p-2.5 rounded-full bg-black/70 border border-white/10 text-white/70 hover:text-white hover:bg-black hover:border-aws-orange/50 transition-all z-20 cursor-pointer"
                    aria-label="Next Photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Bottom Metadata Bar */}
                <div className="border-t border-white/10 bg-[#0e0e0e] px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-sans font-bold text-white text-sm">{activeImage.title}</h4>
                    <p className="font-mono text-xs text-white/50">{activeImage.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-aws-orange/10 border border-aws-orange/30 text-aws-orange font-mono text-[9px] font-bold uppercase tracking-wider">
                      The XL Gym
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      Photo {((activeImageIdx ?? 0) + 1)} of 4
                    </span>
                  </div>
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
