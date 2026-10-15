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
          <img src="/scd-kolhapur-logo.png" alt="Student Community Day" className="h-9 sm:h-11 w-auto max-w-[220px] object-contain group-hover:scale-105 transition-transform" />
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
