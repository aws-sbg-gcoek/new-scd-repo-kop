import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import TeamSection from '../components/TeamSection';
import { FooterSection } from '../components/FooterSection';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#070707]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-12 lg:px-24 py-4 flex items-center justify-between shadow-xl">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-aws-orange/10 border border-aws-orange/30 flex items-center justify-center text-aws-orange font-bold font-mono text-xs group-hover:scale-105 transition-transform">
            AWS
          </div>
          <div className="flex flex-col text-left">
            <span className="font-sans font-black italic text-sm tracking-tight text-white leading-none">
              COMMUNITY DAY
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-aws-orange mt-0.5">
              KOLHAPUR 2026
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-aws-orange hover:text-black text-white/80 hover:border-aws-orange text-xs font-mono font-bold uppercase tracking-wider transition-all border border-white/10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Team Section */}
      <main className="flex-1">
        <TeamSection />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
