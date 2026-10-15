import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Suspense, lazy } from 'react';

const TicketsPurchasePage = lazy(() => import('./features/ticketing/pages/TicketsPurchasePage').then(module => ({ default: module.TicketsPurchasePage })));
const TicketPage = lazy(() => import('./features/ticketing/pages/TicketPage').then(module => ({ default: module.TicketPage })));
const MyReferralsPage = lazy(() => import('./features/ticketing/pages/MyReferralsPage'));
const TicketAdminPage = lazy(() => import('./pages/TicketAdminPage'));
const TicketScanner = lazy(() => import('./components/TicketScanner'));
const SpeakerPage = lazy(() => import('./features/speaker/pages/SpeakerPage').then(module => ({ default: module.SpeakerPage })));
const VolunteerPage = lazy(() => import('./features/volunteer/pages/VolunteerPage').then(module => ({ default: module.VolunteerPage })));
const MpdPage = lazy(() => import('./features/mpd/pages/MpdPage').then(module => ({ default: module.MpdPage })));
import { Preloader } from './components/Preloader';
import { HeaderSection } from './components/HeaderSection';
import { HeroSection } from './components/HeroSection';
import { LogoMarquee } from './components/LogoMarquee';
import { WhatYouGetSection } from './components/WhatYouGetSection';
import { DriversSection } from './components/DriversSection';
import { TimelineSection } from './components/TimelineSection';
import { EventsSection } from './components/EventsSection';

import { BecomeSponsorSection } from './components/BecomeSponsorSection';
import { CommunityPartnersSection } from './components/CommunityPartnersSection';
import { TicketsSection } from './components/TicketsSection';
import { SpeakersSection } from './components/SpeakersSection';
import { GallerySection } from './components/GallerySection';
import { FAQSection } from './components/FAQSection';
import { DirectionsSection } from './components/DirectionsSection';
import { FooterSection } from './components/FooterSection';
const SponsorPage = lazy(() => import('./components/SponsorPage').then(module => ({ default: module.SponsorPage })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const StatusPage = lazy(() => import('./components/StatusPage').then(module => ({ default: module.StatusPage })));
const BadgePage = lazy(() => import('./components/BadgePage').then(module => ({ default: module.BadgePage })));
const CodeOfConductPage = lazy(() => import('./components/CodeOfConductPage').then(module => ({ default: module.CodeOfConductPage })));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
import { BackToTop } from './components/BackToTop';
import { CustomCursor } from './components/CustomCursor';
import { SmoothScroll } from './components/SmoothScroll';

let preloaderShown = false;

function HomePage() {
  const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse/i.test(navigator.userAgent);
  const [loading, setLoading] = useState(() => {
    if (isBot) return false;
    return !preloaderShown;
  });

  const handlePreloaderComplete = () => {
    preloaderShown = true;
    setLoading(false);
    document.body.classList.remove('preloader-active');
    window.dispatchEvent(new Event('greenLight'));
    window.dispatchEvent(new Event('homeEntered'));
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#e0e0e0] flex flex-col overflow-x-clip">
      <AnimatePresence mode="wait">
        {loading && (
           <Preloader key="preloader" onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>

      <div className={`transition-opacity duration-1000 ${loading ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <HeaderSection />
      </div>

      <div className={loading ? "fixed inset-0 opacity-0 pointer-events-none" : "relative opacity-0 animate-[fadeIn_1s_ease-out_forwards]"}>
        <main className="flex flex-col">
            {/* Act 1: Introduction */}
            <HeroSection />
            <LogoMarquee />
            <WhatYouGetSection />

            {/* Act 2: The Program */}
            <SpeakersSection />
            <TicketsSection />
            <TimelineSection />

            {/* Community Milestones & Meetups */}
            <EventsSection />

            {/* Act 3: The Team & Tickets */}
            <BecomeSponsorSection />
            <CommunityPartnersSection />
            <DriversSection />

            {/* Act 4: Venue & Logistics */}
            <DirectionsSection />

            {/* Act 5: Social Proof & Info */}
            <GallerySection />
            <FAQSection />
            <FooterSection />
        </main>
      </div>

      {/* Tailwind inline raw utility animation for main content fade in */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; filter: blur(10px); transform: translateY(10px); }
          to { opacity: 1; filter: none; transform: none; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  // Disable right-click context menu site-wide
  useEffect(() => {
    const prevent = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', prevent);
    return () => document.removeEventListener('contextmenu', prevent);
  }, []);

  return (
  <>
    <SmoothScroll />
    <Suspense fallback={<div className="fixed inset-0 bg-[#050505] z-[100] flex items-center justify-center"><div className="w-12 h-12 border-4 border-white/10 border-t-[#E10600] rounded-full animate-spin"></div></div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sponsors" element={<SponsorPage />} />
        <Route path="/ticket" element={<TicketsPurchasePage />} />
        <Route path="/register" element={<TicketsPurchasePage />} />
        <Route path="/ticket/:id" element={<TicketPage />} />
        <Route path="/refertowin" element={<MyReferralsPage />} />
        <Route path="/cfp" element={<SpeakerPage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/womenintech" element={<MpdPage />} />
        <Route path="/scanner" element={<TicketScanner />} />
        <Route path="/admin" element={<TicketAdminPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/badge" element={<BadgePage />} />
        <Route path="/codeofconduct" element={<CodeOfConductPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
    <BackToTop />
    <CustomCursor />
  </>
  );
}
