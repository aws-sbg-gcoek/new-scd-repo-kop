import { useEffect, useRef } from "react";
import gsap from "gsap";

export const LogoMarquee = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;

    tweenRef.current = gsap.to(marqueeRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 20,
      repeat: -1,
    });

    // Pause on hover (desktop)
    const el = marqueeRef.current.parentElement;
    if (el) {
      const pause = () => tweenRef.current?.pause();
      const resume = () => tweenRef.current?.resume();
      el.addEventListener("mouseenter", pause);
      el.addEventListener("mouseleave", resume);

      return () => {
        tweenRef.current?.kill();
        el.removeEventListener("mouseenter", pause);
        el.removeEventListener("mouseleave", resume);
      };
    }

    return () => tweenRef.current?.kill();
  }, []);

  // Listen for tap events from touchHover.ts (mobile marquee pause)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.pause) {
        tweenRef.current?.pause();
      } else {
        tweenRef.current?.resume();
      }
    };
    window.addEventListener("marquee-tap", handler);
    return () => window.removeEventListener("marquee-tap", handler);
  }, []);

  return (
    <div className="w-full border-b border-white/10 bg-[#050505] py-6 sm:py-10 overflow-hidden relative flex z-20">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />

      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

      <div ref={marqueeRef} className="flex items-center whitespace-nowrap min-w-max">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-20 sm:space-x-32 px-10 sm:px-16"
          >
            {/* marquee-logo class is targeted by touchHover.ts */}
            <img
              src="/AWS_logo1.avif"
              alt="AWS Logo"
              width={120}
              height={48}
              loading="lazy"
              decoding="async"
              className="marquee-logo h-11 sm:h-12 w-auto object-contain opacity-95 hover:opacity-100 hover:scale-105 transition-all duration-300 drop-shadow-[0_0_12px_rgba(255,153,0,0.25)]"
            />

            <img
              src="/partner-logo.png"
              alt="Community Partner Logo"
              width={120}
              height={64}
              loading="lazy"
              decoding="async"
              className="marquee-logo h-11 sm:h-13 w-auto object-contain opacity-95 hover:opacity-100 hover:scale-105 transition-all duration-300 drop-shadow-[0_0_16px_rgba(168,85,247,0.35)]"
            />

            <img
              src="/xl-gym-badge.png"
              alt="The XL Gym - Official Fitness Partner"
              width={120}
              height={48}
              loading="lazy"
              decoding="async"
              className="marquee-logo h-10 sm:h-12 w-auto object-contain rounded-md opacity-95 hover:opacity-100 hover:scale-105 transition-all duration-300 border border-amber-400/40 shadow-[0_0_16px_rgba(250,204,21,0.3)]"
            />

            <img
              src="/AWS_Builder.webp"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/AWS_Builder.png";
              }}
              alt="AWS Student Builder Group at Kolhapur"
              width={160}
              height={48}
              loading="lazy"
              decoding="async"
              className="marquee-logo h-10 sm:h-12 w-auto object-contain rounded-md opacity-95 hover:opacity-100 hover:scale-105 transition-all duration-300 border border-purple-500/30 shadow-[0_0_16px_rgba(168,85,247,0.25)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
