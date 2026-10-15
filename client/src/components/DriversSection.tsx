/* eslint-disable react-doctor/no-initialize-state, react-doctor/prefer-useReducer, react-doctor/no-event-handler, react-doctor/rerender-state-only-in-handlers, react-doctor/no-derived-state */
"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Linkedin, ChevronLeft, ChevronRight, Mail, Users, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { SectionHeader } from './LayoutElements';

interface TeamMember {
  name: string;
  role: string;
  department: string;
  description: string;
  image: string;
  linkedin: string;
  email?: string;
  skills?: string;
}

const coreCrew: TeamMember[] = [
  {
    name: "Shardul Kolekar",
    role: "Captain (President)",
    department: "Leadership Dept",
    description: "Leading the AWS Student Builder Group with a vision to build a thriving cloud computing community at GCOEK. Passionate about serverless architectures and cloud-native development.",
    image: "https://i.ibb.co/YBzRTFVx/Chat-GPT-Image-Sep-4-2026-12-34-54-PM.png",
    linkedin: "https://www.linkedin.com/in/shardulkolekar",
    email: "kolekarshardul23@gmail.com",
    skills: "AWS, Leadership, Cloud Architecture, Serverless, React, Node.js"
  },
  {
    name: "Apeksha Khodave",
    role: "Vice President",
    department: "Leadership Dept",
    description: "Supporting the President in club leadership, coordinating multi-disciplinary activities, and driving community growth, engagement, and operational initiatives.",
    image: "https://i.ibb.co/tw7N7xCJ/Apeksha-Khodave.jpg",
    linkedin: "https://www.linkedin.com/in/apeksha-khodave-9644b32b9?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    email: "apekshakhodave1106@gmail.com",
    skills: "Leadership, Event Coordination, Team Management"
  },
  {
    name: "Vidula Powar",
    role: "General Secretary",
    department: "Leadership Dept",
    description: "Managing club operations, institutional communication, and ensuring smooth execution of all community activities and conference logistics.",
    image: "https://i.ibb.co/5W0h4c8y/Whats-App-Image-2026-03-17-at-9-01-47-AM.jpg",
    linkedin: "https://www.linkedin.com/in/vidula-p-372734294",
    email: "powarvidula11@gmail.com",
    skills: "Operations, Communication, Event Management"
  },
  {
    name: "Shubham Sonwane",
    role: "Joint Secretary",
    department: "Leadership Dept",
    description: "Supporting the General Secretary in daily club operations, event planning, and student builder community coordination.",
    image: "https://i.ibb.co/LDDfM6hn/Gemini-Generated-Image-nbpxu8nbpxu8nbpx-Shubham-Sonwane.png",
    linkedin: "https://www.linkedin.com/in/shubham-sonwane-b9b056312",
    email: "sonwaneshubham38@gmail.com",
    skills: "Management, Coordination, Community Building"
  },
  {
    name: "Atharv Patil",
    role: "Technical Lead",
    department: "Technical Dept",
    description: "Spearheading technical workshops, cloud architecture masterclasses, and assisting in the strategic and operational direction of the club.",
    image: "https://i.ibb.co/wZYNhv1R/Whats-App-Image-2026-04-18-at-1-54-07-PM.jpg",
    linkedin: "https://www.linkedin.com/in/atharvpatilw",
    email: "atharvpatil1808@gmail.com",
    skills: "Cloud Computing, Management, AWS"
  },
  {
    name: "Yash Nawal",
    role: "Technical Associate",
    department: "Technical Dept",
    description: "Passionate about cloud computing, AWS infrastructure, and eager to contribute to the club's technical initiatives and hands-on workshops.",
    image: "https://i.ibb.co/gFrBmXJv/Whats-App-Image-2026-04-18-at-8-14-43-AM-2.jpg",
    linkedin: "https://www.linkedin.com/in/yash-nawal-51b5a228b/",
    email: "yashsanjaynawal810@gmail.com",
    skills: "AWS, Python, Cloud Native"
  },
  {
    name: "Bhushan Jadhav",
    role: "Treasurer",
    department: "Finance & Marketing Dept",
    description: "Managing conference finances, ticketing workflows, budgeting for community events, and ensuring seamless financial operations.",
    image: "https://i.ibb.co/4Ztn2gvb/Bhushan-png.png",
    linkedin: "https://www.linkedin.com/in/bhushan-jadhav-93b94630b?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    email: "aj6244249@gmail.com",
    skills: "Finance, Budgeting, Accounting, Operations"
  },
  {
    name: "Tushant Tagade",
    role: "Marketing Lead",
    department: "Finance & Marketing Dept",
    description: "Leading strategic promotional campaigns, sponsorships, and digital marketing to amplify community outreach across engineering colleges.",
    image: "https://i.ibb.co/zWbTwkBX/tushant-Tagade.jpg",
    linkedin: "https://www.linkedin.com/in/tushant-tagade-06a210254",
    email: "awssbggcoek@gmail.com",
    skills: "Marketing, Strategy, Analytics"
  },
  {
    name: "Dhrupata Wankhede",
    role: "Design & Branding Lead",
    department: "Media & Content Dept",
    description: "Designing high-impact visual identities, conference collateral, and maintaining brand excellence across all AWS Student Builder Group digital touchpoints.",
    image: "https://i.ibb.co/9mS6qrPr/IMG-20260316-WA0033-Dhrupata-Wankhede.jpg",
    linkedin: "https://www.linkedin.com/in/dhrupata-wankhede-b68b323a3",
    email: "dhrupatawankhede@gmail.com",
    skills: "Graphic Design, Figma, Branding"
  },
  {
    name: "Punam Age",
    role: "Event Coordinator",
    department: "Events & Operations Dept",
    description: "Organizing engaging, educational, and high-energy cloud events, guest lectures, and student hackathons for the regional builder community.",
    image: "https://i.ibb.co/spsQqkZ3/Professional-passport-style-headshot-with-smile-1-Punam-age.png",
    linkedin: "https://www.linkedin.com/in/punam-age-5219a52b6",
    email: "punamage123@gmail.com",
    skills: "Event Planning, Public Speaking, Coordination"
  },
  {
    name: "Shekhar",
    role: "Social Media & Content Lead",
    department: "Media & Content Dept",
    description: "Directing digital storytelling, video content creation, and active community management across social channels.",
    image: "https://i.ibb.co/HpV9qJwH/shekhar.jpg",
    linkedin: "https://www.linkedin.com/in/shekhar-varekar-530b97384",
    email: "varekarshekhar@gmail.com",
    skills: "Content Creation, Social Media, Writing"
  },
  {
    name: "Siddhi",
    role: "PR Lead",
    department: "PR, Outreach & Corporate Dept",
    description: "Managing corporate outreach, campus ambassadors, and strategic partnerships to scale regional participation.",
    image: "https://i.ibb.co/4RnZt8mK/IMG-20260316-WA0049-Shruti-Paul-41.jpg",
    linkedin: "https://www.linkedin.com/in/siddhi-agedkar-35b042385",
    email: "siddhiagedkar22@gmail.com",
    skills: "Public Relations, Networking, Communication"
  }
];

const LiteModeSection = ({ crew }: { crew: TeamMember[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.1 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const animateStack = useCallback((activeIndex: number, prevIndex?: number) => {
    if (!stackRef.current || isAnimating.current) return;
    isAnimating.current = true;

    const cards = cardRefs.current;
    const tl = gsap.timeline({
      onComplete: () => { isAnimating.current = false; },
      defaults: { ease: "power3.inOut" },
    });

    if (prevIndex !== undefined && prevIndex !== activeIndex && cards[prevIndex]) {
      tl.to(cards[prevIndex]!, {
        scale: 0.88,
        y: 30,
        rotation: -8,
        opacity: 0.5,
        duration: 0.35,
        ease: "power2.in",
      }, 0);

      if (overlayRefs.current[prevIndex]) {
        tl.to(overlayRefs.current[prevIndex]!, {
          opacity: 0.5,
          duration: 0.3,
        }, 0);
      }
    }

    cards.forEach((card, i) => {
      if (!card) return;

      let offset = i - activeIndex;
      if (offset > crew.length / 2) offset -= crew.length;
      if (offset < -crew.length / 2) offset += crew.length;
      const absOffset = Math.abs(offset);

      if (i === activeIndex) {
        tl.to(card, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          rotation: 0,
          zIndex: 20,
          duration: 0.55,
          ease: "back.out(1.2)",
        }, prevIndex !== undefined ? 0.12 : 0);

        if (imgRefs.current[i]) {
          tl.to(imgRefs.current[i]!, { filter: "grayscale(0)", duration: 0.4 }, 0);
        }
        if (overlayRefs.current[i]) {
          tl.to(overlayRefs.current[i]!, { opacity: 0, duration: 0.3 }, 0);
        }
      } else if (absOffset === 1) {
        const dir = offset > 0 ? 1 : -1;
        tl.to(card, {
          opacity: 0.75,
          scale: 0.92,
          x: dir * 45,
          y: 12,
          rotation: dir * 5,
          zIndex: 10,
          duration: 0.45,
        }, 0);

        if (imgRefs.current[i]) {
          tl.to(imgRefs.current[i]!, { filter: "grayscale(1)", duration: 0.4 }, 0);
        }
        if (overlayRefs.current[i]) {
          tl.to(overlayRefs.current[i]!, { opacity: 0.4, duration: 0.3 }, 0);
        }
      } else {
        const dir = offset > 0 ? 1 : -1;
        tl.to(card, {
          opacity: 0.35,
          scale: 0.84,
          x: dir * 85,
          y: 24,
          rotation: dir * 10,
          zIndex: 5,
          duration: 0.4,
        }, 0);

        if (imgRefs.current[i]) {
          tl.to(imgRefs.current[i]!, { filter: "grayscale(1)", duration: 0.4 }, 0);
        }
        if (overlayRefs.current[i]) {
          tl.to(overlayRefs.current[i]!, { opacity: 0.65, duration: 0.3 }, 0);
        }
      }
    });

    if (infoRef.current) {
      tl.fromTo(
        infoRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0.15
      );
    }
  }, [crew.length]);

  const handleNext = useCallback(() => {
    if (isAnimating.current) return;
    const prev = currentIndex;
    const next = (currentIndex + 1) % crew.length;
    setCurrentIndex(next);
    animateStack(next, prev);
  }, [currentIndex, crew.length, animateStack]);

  const handlePrev = useCallback(() => {
    if (isAnimating.current) return;
    const prev = currentIndex;
    const next = (currentIndex - 1 + crew.length) % crew.length;
    setCurrentIndex(next);
    animateStack(next, prev);
  }, [currentIndex, crew.length, animateStack]);

  const handleCardClick = useCallback((clickedIndex: number) => {
    if (clickedIndex === currentIndex || isAnimating.current) return;
    const prev = currentIndex;
    setCurrentIndex(clickedIndex);
    animateStack(clickedIndex, prev);
  }, [currentIndex, animateStack]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isInView) return;
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);
  }, [handleNext, isInView]);

  useEffect(() => {
    if (!isInView) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer, isInView]);

  useEffect(() => {
    animateStack(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const withReset = (fn: () => void) => () => {
    fn();
    resetTimer();
  };

  const handleCardClickWithReset = (index: number) => {
    handleCardClick(index);
    resetTimer();
  };

  const handleDotClickWithReset = (index: number) => {
    if (index === currentIndex || isAnimating.current) return;
    const prev = currentIndex;
    setCurrentIndex(index);
    animateStack(index, prev);
    resetTimer();
  };

  const currentMember = crew[currentIndex];

  return (
    <section ref={sectionRef} className="w-full relative z-10 py-10" aria-label="Team member carousel">
      <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-14 md:gap-24 min-h-[300px] sm:min-h-[380px] md:min-h-[420px] w-full max-w-6xl mx-auto">
        {/* Photo Side — GSAP stacked cards */}
        <div
          ref={stackRef}
          className="relative w-56 h-72 sm:w-64 sm:h-80 md:w-80 md:h-[400px] shrink-0 mx-auto"
        >
          {crew.map((member, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              onClick={() => handleCardClickWithReset(i)}
              className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 cursor-pointer shadow-2xl shadow-black/80 group bg-[#111]"
              style={{ willChange: 'transform, opacity' }}
            >
              <img
                ref={(el) => { imgRefs.current[i] = el; }}
                src={member.image}
                alt={member.name}
                width={320}
                height={400}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-[filter] duration-500 group-hover:!grayscale-0"
                style={{ filter: 'grayscale(1)' }}
                draggable={false}
                onError={(e) => {
                  // Fallback placeholder if image load fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div
                ref={(el) => { overlayRefs.current[i] = el; }}
                className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:!opacity-0"
              />
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-aws-orange/40 transition-[border-color] duration-300 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <span className="font-mono text-[10px] text-aws-orange font-bold uppercase tracking-widest block">
                  {member.role}
                </span>
                <span className="font-sans font-bold text-sm text-white uppercase tracking-tight">
                  {member.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Info Side - High-tech Telemetry HUD Console */}
        <div 
          ref={infoRef} 
          className="flex-1 w-full bg-[#0a0a0a]/80 border border-white/10 p-6 sm:p-8 rounded-2xl relative overflow-hidden text-left shadow-2xl backdrop-blur-sm"
        >
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-aws-orange/40" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-aws-orange/40" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-aws-orange/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-aws-orange/40" />

          {/* Scanning Laser Line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-aws-orange/20 to-transparent animate-[scan_3s_ease-in-out_infinite]" />

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 font-mono text-[9px] text-white/40 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                BUILDER PROFILE // {currentMember.department}
              </span>
              <span className="text-aws-orange font-bold">SECTOR {String(currentIndex + 1).padStart(2, '0')} / {String(crew.length).padStart(2, '0')}</span>
            </div>

            <div>
              <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-aws-orange/80 mb-1 block font-bold">
                {currentMember.department}
              </span>
              <h3 className="font-sans text-2xl sm:text-4xl font-black italic uppercase tracking-tight text-white leading-none">
                {currentMember.name}
              </h3>
            </div>

            <div className="border-y border-white/5 py-3 my-0.5">
              <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30 block mb-0.5 font-bold">Designation</span>
              <span className="font-mono text-xs sm:text-sm text-aws-orange font-bold tracking-wide uppercase">{currentMember.role}</span>
            </div>

            <div>
              <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30 block mb-1 font-bold">Bio & Directive</span>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans">
                {currentMember.description}
              </p>
            </div>

            {currentMember.skills && (
              <div className="pt-2">
                <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30 block mb-1.5 font-bold">Core Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentMember.skills.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white/[0.04] text-white/80 border border-white/10 rounded text-[9px] sm:text-[10px] font-mono"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-2 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                {currentMember.linkedin && currentMember.linkedin !== "#" && currentMember.linkedin !== "N/A" && (
                  <a
                    href={currentMember.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 font-mono text-[11px] text-white/60 hover:text-[#0a66c2] transition-colors"
                  >
                    <Linkedin size={13} /> LinkedIn
                  </a>
                )}
                {currentMember.email && currentMember.email !== "N/A" && (
                  <a
                    href={`mailto:${currentMember.email}`}
                    className="flex items-center gap-1.5 font-mono text-[11px] text-white/60 hover:text-aws-orange transition-colors"
                  >
                    <Mail size={13} /> Email
                  </a>
                )}
              </div>

              <Link
                to="/team"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-aws-orange hover:text-white transition-colors"
              >
                <span>View All 28 Builders</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-8 sm:mt-12">
        <button type="button"
          onClick={withReset(handlePrev)}
          aria-label="Previous team member"
          className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-aws-orange/50 transition-all duration-300 hover:shadow-lg hover:shadow-aws-orange/10 cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <button type="button"
          onClick={withReset(handleNext)}
          aria-label="Next team member"
          className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-aws-orange/50 transition-all duration-300 hover:shadow-lg hover:shadow-aws-orange/10 cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-5">
        {crew.map((_, i) => (
          <button type="button"
            key={i}
            onClick={() => handleDotClickWithReset(i)}
            aria-label={`Go to team member ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIndex
                ? 'bg-aws-orange w-6'
                : 'bg-white/20 w-2 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export const DriversSection = () => {
  return (
    <section id="team" className="relative w-full bg-[#050505] pt-24 pb-32 px-4 sm:px-12 lg:px-24 min-h-screen flex flex-col items-center justify-center overflow-hidden" aria-label="Team section">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-aws-orange/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none z-0" />

      <div className="w-full mb-0 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <SectionHeader 
          title="Meet Our Team" 
          subtitle="Discover the passionate student leaders, cloud builders, and coordinators behind AWS Student Community Day Kolhapur 2026." 
          sysId="07.DRV" 
          action={
            <Link
              to="/team"
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/15 bg-white/[0.02] hover:bg-aws-orange hover:text-black hover:border-aws-orange text-white text-xs font-mono font-bold uppercase tracking-wider transition-all rounded group"
            >
              <Users size={14} className="text-aws-orange group-hover:text-black" />
              <span>Full Team Directory (28)</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          }
        />
      </div>

      <LiteModeSection crew={coreCrew} />

      {/* Quick link banner to all 29 members */}
      <div className="w-full max-w-6xl mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-aws-orange/10 border border-aws-orange/20 flex items-center justify-center text-aws-orange">
            <Users size={18} />
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
              AWS Student Builder Group GCOEK
            </span>
            <span className="font-mono text-[11px] text-white/40">
              28 Builders across Leadership, Tech, Operations, Media, PR & Finance
            </span>
          </div>
        </div>

        <Link
          to="/team"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-aws-orange text-black font-sans font-black italic uppercase text-[11px] tracking-wider skew-x-[-10deg] hover:bg-white transition-all shadow-[0_0_20px_rgba(255,153,0,0.2)]"
        >
          <span className="skew-x-[10deg] flex items-center gap-2">
            <span>View All 28 Builders</span>
            <ExternalLink size={13} />
          </span>
        </Link>
      </div>
    </section>
  );
};
