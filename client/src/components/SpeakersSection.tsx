import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { SectionHeader } from './LayoutElements';
import { Mic, Sparkles, ArrowRight, Radio, Layers } from 'lucide-react';

export const SpeakersSection = () => {
  return (
    <section id="speakers" className="relative py-20 sm:py-28 px-4 sm:px-12 lg:px-24 bg-[#050505] overflow-hidden" aria-label="Speakers section">
      {/* Decorative track line and subtle background glow */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[250px] sm:h-[400px] bg-aws-orange/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mb-12">
        <SectionHeader 
          title="Speakers" 
          subtitle="Our lineup of industry experts, AWS architects, and community pioneers is currently being curated. Speaker announcements will be revealed soon." 
          sysId="02.SPK" 
        />
      </div>

      {/* Futuristic Blank / Standby Announcement Space */}
      <div className="max-w-4xl mx-auto relative z-10">
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
