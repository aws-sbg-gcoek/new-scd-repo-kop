import React from "react";

export const LogoMarquee = () => {
  const logos = [
    {
      src: "/AWS_logo1.avif",
      alt: "AWS Logo",
      className: "h-9 sm:h-11 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,153,0,0.3)] hover:scale-105 transition-transform duration-300",
    },
    {
      src: "/AWS_Builder.webp",
      fallbackSrc: "/AWS_Builder.png",
      alt: "AWS Student Builder Group at Kolhapur",
      className: "h-9 sm:h-11 w-auto object-contain rounded-md border border-purple-500/30 shadow-[0_0_16px_rgba(168,85,247,0.3)] hover:scale-105 transition-transform duration-300",
    },
  ];

  return (
    <div className="w-full border-b border-white/10 bg-[#050505] py-7 sm:py-10 overflow-hidden relative flex z-20">
      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none" />

      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none" />

      {/* Inline styles for 100% reliable hardware-accelerated continuous infinite marquee */}
      <style>{`
        @keyframes continuousMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .continuous-marquee-track {
          display: flex;
          align-items: center;
          width: max-content;
          will-change: transform;
          animation: continuousMarquee 28s linear infinite !important;
        }
      `}</style>

      {/* Marquee Track (Repeated twice for seamless infinite -50% loop) */}
      <div className="continuous-marquee-track">
        {/* Set 1 */}
        <div className="flex items-center gap-16 sm:gap-28 pr-16 sm:pr-28">
          {[...Array(6)].map((_, groupIdx) => (
            <React.Fragment key={`set1-${groupIdx}`}>
              {logos.map((logo, logoIdx) => (
                <div key={`s1-${groupIdx}-${logoIdx}`} className="shrink-0 flex items-center justify-center">
                  <img
                    src={logo.src}
                    onError={(e) => {
                      if (logo.fallbackSrc) {
                        (e.currentTarget as HTMLImageElement).src = logo.fallbackSrc;
                      }
                    }}
                    alt={logo.alt}
                    loading="lazy"
                    decoding="async"
                    className={logo.className}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Set 2 (Identical duplicate for seamless wrap) */}
        <div className="flex items-center gap-16 sm:gap-28 pr-16 sm:pr-28">
          {[...Array(6)].map((_, groupIdx) => (
            <React.Fragment key={`set2-${groupIdx}`}>
              {logos.map((logo, logoIdx) => (
                <div key={`s2-${groupIdx}-${logoIdx}`} className="shrink-0 flex items-center justify-center">
                  <img
                    src={logo.src}
                    onError={(e) => {
                      if (logo.fallbackSrc) {
                        (e.currentTarget as HTMLImageElement).src = logo.fallbackSrc;
                      }
                    }}
                    alt={logo.alt}
                    loading="lazy"
                    decoding="async"
                    className={logo.className}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
