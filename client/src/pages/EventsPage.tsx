import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, MapPin, ExternalLink, Clock, Sparkles, CheckCircle2, Filter, X } from 'lucide-react';
import { CLUB_EVENTS, CLUB_GALLERY_IMAGES, ClubEvent } from '../data/eventsData';
import { FooterSection } from '../components/FooterSection';

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const eventTypes = ['All', 'Meetup', 'Workshop', 'Seminar', 'Expert Lecture'];

  const filteredEvents = selectedType === 'All'
    ? CLUB_EVENTS
    : CLUB_EVENTS.filter(e => e.type.toLowerCase() === selectedType.toLowerCase());

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#070707]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-12 lg:px-24 py-4 flex items-center justify-between shadow-xl">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/aws-logo-white.svg" alt="AWS" className="h-8 sm:h-10 w-auto max-w-[220px] object-contain group-hover:scale-105 transition-transform" />
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-aws-orange hover:text-black text-white/80 hover:border-aws-orange text-xs font-mono font-bold uppercase tracking-wider transition-all border border-white/10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-14 sm:py-20 px-4 sm:px-12 lg:px-24 max-w-7xl mx-auto w-full">
        
        {/* Title HUD */}
        <div className="mb-12 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/[0.03] border border-white/10 text-aws-orange font-mono text-[10px] tracking-widest uppercase mb-4">
            <Sparkles size={12} />
            <span>COMMUNITY MILESTONES & MEETUPS</span>
          </div>

          <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tight uppercase text-white leading-tight">
            Club Events & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aws-orange via-amber-400 to-orange-500">
              Technical Workshops
            </span>
          </h1>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
            From our founding meetup to deep-dive AI seminars and full-day developer bootcamps, explore 
            the milestones powering the AWS Student Builder Group at GCOEK.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-10 flex flex-wrap gap-2 items-center">
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 uppercase tracking-widest mr-2">
            <Filter size={11} className="text-aws-orange" /> Type:
          </span>
          {eventTypes.map(type => {
            const count = type === 'All' ? CLUB_EVENTS.length : CLUB_EVENTS.filter(e => e.type.toLowerCase() === type.toLowerCase()).length;
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-aws-orange text-black border-aws-orange font-bold shadow-[0_0_15px_rgba(255,153,0,0.3)]'
                    : 'bg-[#0c0c0c] text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <span>{type}</span>
                <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[9px] ${isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-white/50'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Event List */}
        <div className="space-y-10 sm:space-y-12">
          {filteredEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-[#090909] border border-white/10 rounded-2xl overflow-hidden hover:border-aws-orange/40 transition-all duration-300 shadow-xl flex flex-col lg:flex-row"
            >
              {/* Event Image */}
              <div className="lg:w-2/5 relative min-h-[260px] bg-[#111] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent to-[#090909]/80 lg:to-[#090909]" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-white/15 text-aws-orange font-mono text-[10px] font-bold uppercase tracking-wider">
                    {event.type}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-white/[0.08] backdrop-blur-md border border-white/10 text-white/80 font-mono text-[9px] uppercase tracking-wider">
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="lg:w-3/5 p-6 sm:p-8 flex flex-col justify-between text-left">
                <div>
                  <div className="flex flex-wrap items-center gap-4 text-white/50 font-mono text-xs mb-3">
                    <span className="flex items-center gap-1.5 text-aws-orange font-bold">
                      <Calendar size={13} />
                      <span>{event.date}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      <span>{event.time}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} />
                      <span>{event.location}</span>
                    </span>
                  </div>

                  <h2 className="font-sans text-xl sm:text-2xl font-black italic uppercase tracking-tight text-white mb-3 leading-snug">
                    {event.title}
                  </h2>

                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                    {event.desc}
                  </p>

                  {/* Highlights Grid */}
                  <div className="mb-6">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-aws-orange font-bold block mb-2">
                      Key Highlights & Agenda:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {event.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2 text-xs text-white/80 font-sans">
                          <CheckCircle2 size={13} className="text-aws-orange shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule timeline if present */}
                  {event.schedule && event.schedule.length > 0 && (
                    <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 block mb-3 font-bold">
                        Detailed Schedule:
                      </span>
                      <div className="space-y-2">
                        {event.schedule.map((s, sIdx) => (
                          <div key={sIdx} className="flex gap-3 text-xs">
                            <span className="font-mono text-aws-orange text-[11px] shrink-0 font-bold w-20">{s.time}</span>
                            <div>
                              <span className="font-bold text-white block">{s.title}</span>
                              <span className="text-white/50 text-[11px]">{s.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  {event.link ? (
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-aws-orange text-black font-sans font-black italic uppercase text-xs tracking-wider skew-x-[-10deg] hover:bg-white transition-all shadow-[0_0_15px_rgba(255,153,0,0.2)]"
                    >
                      <span className="skew-x-[10deg] flex items-center gap-1.5">
                        <span>View Meetup / Registration Page</span>
                        <ExternalLink size={13} />
                      </span>
                    </a>
                  ) : (
                    <span className="font-mono text-[11px] text-white/30 uppercase tracking-widest">
                      In-Person Campus Meetup
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Photo Gallery Section */}
        <section className="mt-20 pt-16 border-t border-white/10">
          <div className="mb-8 text-left">
            <span className="font-mono text-xs uppercase tracking-widest text-aws-orange font-bold block mb-2">
              [ 02 // ARCHIVE ]
            </span>
            <h2 className="font-sans text-2xl sm:text-4xl font-black italic tracking-tight uppercase text-white leading-none">
              Community Moments & Gallery
            </h2>
            <p className="text-white/50 text-xs sm:text-sm mt-2">
              Snapshots from our hands-on labs, hackathon prep, and community meetups at GCOEK.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CLUB_GALLERY_IMAGES.map((imgSrc, pIdx) => (
              <motion.div
                key={pIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: pIdx * 0.04 }}
                onClick={() => setSelectedPhoto(imgSrc)}
                className="aspect-square bg-[#111] border border-white/10 rounded-xl overflow-hidden cursor-pointer group relative hover:border-aws-orange/40 transition-all duration-300 shadow-md"
              >
                <img
                  src={imgSrc}
                  alt={`Community Event photo ${pIdx + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-aws-orange font-bold">
                    View Photo
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white p-2 rounded-full bg-white/10 border border-white/20 transition-colors"
              >
                <X size={20} />
              </button>
              <img
                src={selectedPhoto}
                alt="Enlarged community photo"
                className="max-w-full max-h-[85vh] object-contain rounded-xl border border-white/20 shadow-2xl"
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      <FooterSection />
    </div>
  );
}
