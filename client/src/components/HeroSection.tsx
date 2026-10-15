/* eslint-disable react-doctor/no-initialize-state, react-doctor/prefer-useReducer, react-doctor/no-event-handler, react-doctor/rerender-state-only-in-handlers, react-doctor/no-derived-state */
import { motion, useScroll, useTransform } from "motion/react";
import { AngledButton } from "./LayoutElements";
import { Zap, Calendar, MapPin, Volume2, VolumeX } from "lucide-react";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

let globalIsMuted = false;

export const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(globalIsMuted);
  
  // Initialize video media immediately so the video element is preloaded & ready
  const [media] = useState<{video: string}>({ video: '/videoplayback.webm' });
  const [isLiteMode, setIsLiteMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('scd_lite_mode') === 'true';
  });
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  // Play helper that plays the F1 car video and its roaring engine sound in loop
  const ensureVideoPlaying = useCallback((forceUnmute = false) => {
    const video = videoRef.current;
    if (!video) return;

    video.loop = true;
    if (forceUnmute || !isMuted) {
      video.muted = false;
      video.volume = 0.65;
    }

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay audio blocked by browser policy, starting muted until interaction:", err);
          // If browser restricts unmuted autoplay before gesture, start muted temporarily
          video.muted = true;
          video.play().catch(() => {});
          
          // As soon as the user scrolls, clicks, or touches anywhere, instantly unmute and unleash engine roar!
          const unlockSound = () => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.volume = 0.65;
              globalIsMuted = false;
              setIsMuted(false);
              videoRef.current.play().catch(() => {});
            }
            window.removeEventListener('click', unlockSound);
            window.removeEventListener('scroll', unlockSound);
            window.removeEventListener('touchstart', unlockSound);
          };
          window.addEventListener('click', unlockSound, { once: true });
          window.addEventListener('scroll', unlockSound, { once: true, passive: true });
          window.addEventListener('touchstart', unlockSound, { once: true });
        });
      }
    }
  }, [isMuted]);

  // Toggle Sound Button handler
  const toggleSound = () => {
    const nextMuted = !isMuted;
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 0.65;
      if (!nextMuted && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
    globalIsMuted = nextMuted;
    setIsMuted(nextMuted);
    window.dispatchEvent(new CustomEvent("muteStateChange", { detail: nextMuted }));
  };

  // IntersectionObserver: automatically play when hero scrolls into view, pause when scrolled away
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          ensureVideoPlaying();
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [ensureVideoPlaying]);

  // Window scroll listener: as user scrolls above to the top, automatically resume playback and sound
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 650) {
        ensureVideoPlaying();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ensureVideoPlaying]);

  // Handle visibility and page focus
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden && inView) {
        ensureVideoPlaying();
      } else if (document.hidden) {
        videoRef.current?.pause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [inView, ensureVideoPlaying]);

  // Initial playback trigger & watchdog
  useEffect(() => {
    ensureVideoPlaying();

    const watchdog = setInterval(() => {
      if (inView && !document.hidden && videoRef.current && videoRef.current.paused) {
        ensureVideoPlaying();
      }
    }, 2500);

    return () => clearInterval(watchdog);
  }, [inView, ensureVideoPlaying]);

  // Preloader greenLight event listener - starts roaring engine sound
  useEffect(() => {
    const handleGreenLight = () => {
      const lite = localStorage.getItem('scd_lite_mode') === 'true';
      setIsLiteMode(lite);
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 0.65;
        setIsMuted(false);
      }
      ensureVideoPlaying(true);
    };

    const handleExternalToggleMute = () => {
      toggleSound();
    };

    window.addEventListener("greenLight", handleGreenLight);
    window.addEventListener("toggleMute", handleExternalToggleMute);
    return () => {
      window.removeEventListener("greenLight", handleGreenLight);
      window.removeEventListener("toggleMute", handleExternalToggleMute);
    };
  }, [ensureVideoPlaying]);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden border-b border-white/5 z-10 px-4 sm:px-12 lg:px-24 pt-24 pb-12" aria-label="Hero Section">
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0 pointer-events-none bg-[#050505]"
      >
        {isLiteMode ? (
          <img
            src="/bg.avif"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60 mix-blend-screen mix-blend-lighten"
          />
        ) : (
          <video
            ref={videoRef}
            preload="auto"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onEnded={() => ensureVideoPlaying()}
            className="w-full h-full object-cover opacity-60 mix-blend-screen mix-blend-lighten"
            src={media.video}
          >
            <track kind="captions" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        <div className="absolute -right-20 top-0 w-[500px] h-[500px] bg-aws-orange/5 blur-[150px]" />
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-f1-red to-aws-orange" />
      </motion.div>

      {/* Interactive Sound HUD Control */}
      {!isLiteMode && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute F1 Car Engine Sound" : "Mute F1 Car Engine Sound"}
          className="absolute bottom-6 right-6 sm:bottom-10 sm:right-12 z-20 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/15 hover:border-aws-orange/60 text-white font-mono text-[10px] tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] cursor-pointer group"
        >
          {isMuted ? (
            <>
              <VolumeX size={14} className="text-white/50 group-hover:text-aws-orange" />
              <span className="text-white/60 group-hover:text-white">SOUND: MUTED</span>
            </>
          ) : (
            <>
              <Volume2 size={14} className="text-aws-orange animate-pulse" />
              <span className="text-aws-orange font-bold">F1 ENGINE // ON</span>
              <span className="flex gap-0.5 items-end h-3">
                <span className="w-0.5 h-2 bg-aws-orange animate-pulse" />
                <span className="w-0.5 h-3 bg-aws-orange animate-bounce" />
                <span className="w-0.5 h-1.5 bg-aws-orange animate-pulse" />
              </span>
            </>
          )}
        </button>
      )}

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 mt-18 lg:mt-12">
        
        {/* Left Content */}
        <div className="w-full lg:w-3/5 flex flex-col gap-5 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-aws-orange/10 border border-aws-orange/20 max-w-max rounded-full"
          >
            <span className="w-2 h-2 rounded-full bg-aws-orange animate-pulse"></span>
            <span className="font-mono text-[10px] sm:text-xs text-aws-orange uppercase tracking-[0.2em] font-bold">
              AWS Student Community Day
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter leading-[0.9] uppercase text-white"
          >
            <span className="block mb-2">AWS Student</span>
            <span className="block mb-2">Community Day</span>
            <span className="block text-aws-orange">Kolhapur 2026</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-base sm:text-lg lg:text-xl font-bold tracking-tight uppercase text-white/90 border-l-4 border-aws-orange pl-4"
          >
            The Largest Student-Led Cloud Event in Western Maharashtra
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-2xl text-sm lg:text-base opacity-70 font-medium leading-relaxed"
          >
             <i><b>AWS Student Community Day Kolhapur 2026</b></i> is the largest student-led cloud event in Western Maharashtra, bringing together students, developers, AWS Heroes, Community Builders, UG Leaders, and industry experts under one roof. Supported by the global AWS community, the event offers cutting-edge cloud learning, inspiring technical sessions, and valuable networking opportunities to help the next generation of technology leaders learn, connect, and grow. 
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-2"
          >
            <Link to="/ticket">
              <AngledButton primary={true}>
                <span>Buy Ticket</span>
              </AngledButton>
            </Link>
            <a href="#schedule">
              <AngledButton primary={false}>
                <span>View Agenda</span>
              </AngledButton>
            </a>
          </motion.div>
        </div>

        {/* Right Content: Elegant Date/Time/Venue Typography */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full lg:w-2/5 flex flex-col justify-center mt-8 lg:mt-0"
        >
          <div className="flex flex-col gap-8 sm:gap-10 border-l-2 border-white/10 pl-6 sm:pl-10">
            <div className="flex flex-col group cursor-default">
              <span className="font-mono text-[10px] sm:text-xs text-aws-orange uppercase tracking-[0.3em] mb-2 font-bold flex items-center gap-2">
                <Calendar size={12} /> Date
              </span>
              <span className="font-sans text-lg sm:text-xl lg:text-2xl font-black text-white group-hover:text-f1-red transition-colors duration-300">
                01 November 2026
              </span>
            </div>

            <div className="flex flex-col group cursor-default">
              <span className="font-mono text-[10px] sm:text-xs text-aws-orange uppercase tracking-[0.3em] mb-2 font-bold flex items-center gap-2">
                <Zap size={12} /> Start Time
              </span>
              <span className="font-sans text-lg sm:text-xl lg:text-2xl font-black text-white group-hover:text-f1-red transition-colors duration-300">
                09:00 AM IST
              </span>
            </div>

            <div className="flex flex-col group">
              <span className="font-mono text-[10px] sm:text-xs text-aws-orange uppercase tracking-[0.3em] mb-2 font-bold flex items-center gap-2">
                <MapPin size={12} /> Venue
              </span>
              <span className="font-sans text-lg sm:text-xl lg:text-2xl font-black text-white leading-tight group-hover:text-aws-orange transition-colors duration-300">
                V.T. Patil Hall, Kolhapur
              </span>
              <div className="flex gap-4 mt-2 font-mono text-[9px] uppercase tracking-widest relative z-20">
                <a 
                  href="https://maps.google.com/?q=V.T.+Patil+Smruti+Bhavan,+Kolhapur" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-white/40 hover:text-aws-orange transition-colors"
                >
                  Google Maps
                </a>
                <span className="text-white/10 select-none">|</span>
                <a 
                  href="https://maps.apple/p/yY~~WHcrydco3q" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-white/40 hover:text-aws-orange transition-colors"
                >
                  Apple Maps
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
