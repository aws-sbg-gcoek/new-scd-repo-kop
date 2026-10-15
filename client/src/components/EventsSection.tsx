import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ExternalLink, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from './LayoutElements';
import { CLUB_EVENTS } from '../data/eventsData';

export const EventsSection = () => {
  return (
    <section id="events" className="relative py-20 sm:py-28 px-4 sm:px-12 lg:px-24 bg-[#050505] overflow-hidden" aria-label="Community Events">
      {/* Decorative track line and subtle background glow */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-aws-orange/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="mb-12">
        <SectionHeader 
          title="Community Events" 
          subtitle="Discover past meetups, hands-on workshops, AI seminars, and cloud lectures organized by AWS Student Builder Group GCOEK." 
          sysId="05.EVT" 
          action={
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/15 bg-white/[0.02] hover:bg-aws-orange hover:text-black hover:border-aws-orange text-white text-xs font-mono font-bold uppercase tracking-wider transition-all rounded group"
            >
              <Sparkles size={14} className="text-aws-orange group-hover:text-black" />
              <span>All Events & Gallery</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          }
        />
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto relative z-10">
        {CLUB_EVENTS.slice(0, 3).map((event, idx) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            className="group bg-[#090909] border border-white/10 rounded-2xl overflow-hidden hover:border-aws-orange/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,153,0,0.12)] flex flex-col justify-between"
          >
            <div>
              {/* Event Image */}
              <div className="relative aspect-[16/10] bg-[#111] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent opacity-80" />
                
                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/15 text-aws-orange font-mono text-[9px] font-bold uppercase tracking-widest">
                    {event.type}
                  </span>
                </div>

                {/* Status tag */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded bg-white/[0.08] backdrop-blur-md border border-white/10 text-white/70 font-mono text-[8px] uppercase tracking-wider">
                    Completed
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 text-left">
                {/* Meta Bar */}
                <div className="flex flex-wrap items-center gap-4 text-white/50 font-mono text-[11px] mb-3">
                  <span className="flex items-center gap-1.5 text-aws-orange">
                    <Calendar size={13} />
                    <span>{event.date}</span>
                  </span>
                  <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                    <MapPin size={13} />
                    <span className="truncate">{event.location}</span>
                  </span>
                </div>

                <h3 className="font-sans font-bold text-lg sm:text-xl text-white uppercase tracking-tight leading-snug mb-3 group-hover:text-aws-orange transition-colors">
                  {event.title}
                </h3>

                <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 font-sans">
                  {event.desc}
                </p>

                {/* Highlights preview */}
                <div className="space-y-1.5 mb-4 pt-3 border-t border-white/5">
                  {event.highlights.slice(0, 2).map((item, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-[11px] text-white/70 font-sans">
                      <CheckCircle2 size={12} className="text-aws-orange shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-white/5 pt-4">
              {event.link ? (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-aws-orange hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  <span>View on Meetup</span>
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
                  Community Archive
                </span>
              )}

              <Link
                to="/events"
                className="text-white/40 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1"
              >
                <span>Details</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA to all events */}
      <div className="mt-12 text-center relative z-10">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.04] hover:bg-aws-orange hover:text-black border border-white/10 hover:border-aws-orange text-white font-sans font-black italic uppercase text-xs tracking-wider skew-x-[-10deg] transition-all"
        >
          <span className="skew-x-[10deg] flex items-center gap-2">
            <span>Explore All 5 Events & Community Photo Gallery</span>
            <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </section>
  );
};
