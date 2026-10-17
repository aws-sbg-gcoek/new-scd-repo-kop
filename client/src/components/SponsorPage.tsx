/* eslint-disable react-doctor/label-has-associated-control, react-doctor/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  ArrowLeft,
  Send,
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Upload,
  Check,
  X,
  Sparkles,
  ArrowDown,
  Briefcase,
  Store,
  Calendar,
  MapPin,
  Users,
  Award,
  ExternalLink,
  Flame,
  CheckCircle2,
  ShieldCheck,
  Radio,
  Eye,
  Megaphone,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  SponsorApplication,
  saveSponsorApplication,
} from '../utils/sponsorStore';
import { compressImageToBase64 } from '../utils/registrationStore';

export interface SponsorTierItem {
  name: string;
  price: string;
  amount: number;
  highlight: boolean;
  tag: string;
  perks: string[];
}

export const sponsorTiers: SponsorTierItem[] = [
  {
    name: 'Platinum Sponsor',
    price: '₹35,000 - ₹45,000',
    amount: 35000,
    highlight: true,
    tag: '★ Title Partner Tier',
    perks: [
      'Largest logo on every asset (banners, slides, stage backdrop)',
      'Stage mention (opening & closing) — Named as Platinum Sponsor',
      'Premium stall space — largest area in the hall',
      'Dedicated social media post + all-event mentions',
      'Branding on official attendee certificates',
      'Largest logo on event registration page & website',
    ],
  },
  {
    name: 'Gold Sponsor',
    price: '₹15,000 - ₹20,000',
    amount: 15000,
    highlight: false,
    tag: 'Flagship Partner',
    perks: [
      'Prominent logo placement on main event assets',
      'Stage mention during opening and closing ceremonies',
      'Priority stall space spot in exhibition area',
      'Dedicated social media feature post',
      'Branding on official attendee certificates',
      'Standard logo on event registration page & website',
    ],
  },
  {
    name: 'Silver Sponsor',
    price: '₹8,000 - ₹12,000',
    amount: 8000,
    highlight: false,
    tag: 'Community Supporter',
    perks: [
      'Standard logo placement on banners and presentation slides',
      'Standard spot stall space for direct engagement',
      'Shared social media shoutout post',
      'Small logo on event registration page & website',
    ],
  },
  {
    name: 'Bronze Sponsor',
    price: '₹3,000 - ₹5,000',
    amount: 3000,
    highlight: false,
    tag: 'Ecosystem Backer',
    perks: [
      'Listed on event banner & presentation slides',
      'Mention in official sponsor list social media post',
      'Listed on event registration page & website',
    ],
  },
];

const REACH_METRICS = [
  {
    label: 'Expected Event Participants',
    value: '250 - 300',
    desc: 'Passionate student developers, cloud engineers & AI builders',
  },
  {
    label: 'Meetup Community Members',
    value: '1,000+',
    desc: 'Active student builders across Kolhapur & Western Maharashtra',
  },
  {
    label: 'AWS Builder Center Sign-ups',
    value: '400+',
    desc: 'Registered builders actively exploring hands-on cloud skills',
  },
  {
    label: 'LinkedIn Followers',
    value: '430+',
    desc: 'Growing network of students, alumni, and tech professionals',
  },
];

const WHY_SPONSOR_POINTS = [
  {
    title: 'Direct Talent Access',
    desc: 'Direct access to 250+ engaged student developers, emerging tech talent, and future cloud architects.',
    icon: Users,
  },
  {
    title: 'Massive Brand Exposure',
    desc: 'Brand exposure to 1,000+ community members and 430+ LinkedIn followers through banners, slides, social shoutouts, and event recaps.',
    icon: Megaphone,
  },
  {
    title: 'Live Booth & Stall Space',
    desc: 'Dedicated booth / stall space for live, face-to-face demonstrations, recruitment discussions, and product showcases.',
    icon: Store,
  },
  {
    title: 'Prestigious AWS Association',
    desc: 'Direct association with the AWS Student Builder Community and its flagship Student Community Day initiative.',
    icon: ShieldCheck,
  },
  {
    title: 'Long-Tail Content Visibility',
    desc: 'Long-tail visibility through post-event content, high-res photos, video recaps, and testimonials shared across channels for weeks.',
    icon: Eye,
  },
  {
    title: 'Wide Regional Reach',
    desc: "Students from Kolhapur as well as outside the city are expected to attend, extending your brand's visibility well beyond the local campus crowd.",
    icon: Globe,
  },
];

const SHOWCASE_OPTIONS = [
  '🎪 Product Expo Stall & Booth',
  '🎤 Speaking Slot / Tech Demo',
  '🎁 Distribute Goodies / Swag / Kits',
  '🏷️ Logo on Stage Backdrop & Banners',
  '🎫 Student Pass Lanyards & Badges',
  '💼 Direct Student Talent Hiring & Internships',
  '💻 Software / Developer Tool Trials',
  '🏆 Hackathon / Challenge Prize Sponsorship',
];

export const SponsorPage = () => {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedTier, setSelectedTier] = useState<string>('Platinum Sponsor');
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Cloud & IT Services');
  const [showcaseInterests, setShowcaseInterests] = useState<string[]>([
    '🎪 Product Expo Stall & Booth',
    '🏷️ Logo on Stage Backdrop & Banners',
  ]);
  const [customShowcase, setCustomShowcase] = useState('');
  const [details, setDetails] = useState('');
  const [companyPhotoBase64, setCompanyPhotoBase64] = useState<string>('');
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState('');

  const handleSelectTier = (tierName: string) => {
    setSelectedTier(tierName);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleShowcaseInterest = (option: string) => {
    if (showcaseInterests.includes(option)) {
      setShowcaseInterests(showcaseInterests.filter(o => o !== option));
    } else {
      setShowcaseInterests([...showcaseInterests, option]);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    try {
      setIsCompressingPhoto(true);
      setPhotoFileName(file.name);
      const compressed = await compressImageToBase64(file, 900, 900, 0.8);
      setCompanyPhotoBase64(compressed);
    } catch (err) {
      console.error('Error compressing photo:', err);
      alert('Failed to process image. Please try a different photo.');
    } finally {
      setIsCompressingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const tierObj = sponsorTiers.find(t => t.name === selectedTier) || sponsorTiers[0];
      const appId = `SPN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newApp: SponsorApplication = {
        id: appId,
        company: company.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        website: website.trim(),
        industry,
        tier: tierObj.name,
        price: tierObj.price,
        companyPhotoBase64: companyPhotoBase64 || undefined,
        showcaseInterests,
        customShowcase: customShowcase.trim(),
        details: details.trim(),
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveSponsorApplication(newApp);
      setSubmittedAppId(appId);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred while saving.');
    }
  };

  const currentTierObj = sponsorTiers.find(t => t.name === selectedTier) || sponsorTiers[0];

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-aws-orange selection:text-black">
      {/* Background radial grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Navbar */}
      <div className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-aws-orange tracking-widest uppercase hidden sm:inline">
              AWS SBG GCOEK • SCD 2026
            </span>
            <button
              type="button"
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-aws-orange text-black font-black italic uppercase text-xs px-3.5 py-1.5 rounded tracking-wider hover:bg-white transition-all cursor-pointer"
            >
              Apply to Sponsor ↓
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-8 lg:px-12 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-aws-orange/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#E10600]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aws-orange/10 border border-aws-orange/30 text-aws-orange text-xs font-mono tracking-widest uppercase font-bold">
            <Sparkles size={13} />
            <span>Sponsorship Proposal • AWS Student Community Day 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase text-white leading-none">
            AWS Student Community Day 2026<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aws-orange via-amber-400 to-[#E10600]">
              Sponsorship Proposal
            </span>
          </h1>

          <p className="text-sm sm:text-base font-mono uppercase tracking-widest text-aws-orange font-bold">
            AWS Student Builder Group, GCOEK Kolhapur
          </p>

          <p className="text-sm sm:text-base text-white/70 max-w-3xl mx-auto leading-relaxed">
            We're inviting your organization to be part of that moment as a sponsor of SCD 2026 and in return, get direct, high-visibility access to a fast-growing, highly engaged student tech community that's actively building in cloud, AI, and open source.
          </p>

          {/* Date & Venue Badges */}
          <div className="pt-3 flex flex-wrap justify-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-2 bg-[#111] border border-white/10 px-4 py-2 rounded-xl text-white">
              <Calendar size={15} className="text-aws-orange shrink-0" />
              <span><strong>Date:</strong> 1st November 2026</span>
            </div>
            <div className="flex items-center gap-2 bg-[#111] border border-white/10 px-4 py-2 rounded-xl text-white">
              <MapPin size={15} className="text-aws-orange shrink-0" />
              <span><strong>Venue:</strong> V. T. Patil Convention Hall, Rajarampuri, Kolhapur</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Opportunity Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto">
        <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-[#121620] via-[#0c0f16] to-[#07090e] border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-aws-orange/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-aws-orange via-amber-400 to-[#E10600]" />

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-aws-orange font-bold">
              <Flame size={14} />
              <span>Flagship Annual Initiative</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
              The Opportunity
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
              <p>
                AWS Student Community Day (SCD) is the biggest event our AWS Student Builder Group organizes each year. SCD is the flagship annual event of our AWS Student Builder Group. Unlike a typical single topic meetup, SCD brings together multiple tracks, expert speakers, hands-on workshops, games and activities in one large-scale event, drawing students, developers, and tech enthusiasts from across the region.
              </p>
              <p>
                For AWS, it represents the most ambitious event a Student Builder Group can run in a year. For us, it's a chance to bring that experience to Kolhapur and put our college and community on the map as one of the most active student tech chapters in the country.
              </p>
              <p className="text-white font-medium border-l-2 border-aws-orange pl-3 py-1 bg-white/[0.02]">
                We're inviting your organization to be part of that moment as a sponsor of SCD 2026 and in return, get direct, high-visibility access to a fast-growing, highly engaged student tech community that's actively building in cloud, AI, and open source.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Reach Section */}
      <section className="py-10 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="font-mono text-xs text-aws-orange uppercase tracking-widest mb-1 font-bold">
            Community Footprint
          </div>
          <h2 className="text-3xl sm:text-4xl font-black italic tracking-tight uppercase text-white">
            Our Reach
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Verified engagement metrics across our builder channels and student network.
          </p>
        </div>

        {/* Reach Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {REACH_METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl bg-[#0c0e14] border border-white/10 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[11px] text-white/50 uppercase tracking-wider block mb-1">
                  {metric.label}
                </span>
                <div className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-aws-orange to-amber-300 font-mono">
                  {metric.value}
                </div>
              </div>
              <p className="text-[11px] text-white/60 mt-3 pt-3 border-t border-white/5 leading-snug">
                {metric.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Reach Summary Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#090b10]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#121622] text-white/80 uppercase tracking-wider text-[11px] border-b border-white/10">
              <tr>
                <th className="py-3 px-5">Metric</th>
                <th className="py-3 px-5 text-right sm:text-left text-aws-orange">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/70">
              <tr>
                <td className="py-3 px-5 font-sans font-medium text-white">Expected event participants</td>
                <td className="py-3 px-5 font-bold text-amber-300 text-right sm:text-left">250-300</td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-sans font-medium text-white">Meetup community members</td>
                <td className="py-3 px-5 font-bold text-amber-300 text-right sm:text-left">1,000+</td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-sans font-medium text-white">AWS Builder Center sign-ups</td>
                <td className="py-3 px-5 font-bold text-amber-300 text-right sm:text-left">400+</td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-sans font-medium text-white">LinkedIn followers</td>
                <td className="py-3 px-5 font-bold text-amber-300 text-right sm:text-left">430+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Why Sponsor SCD 2026? Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="font-mono text-xs text-aws-orange uppercase tracking-widest mb-1 font-bold">
            Value Proposition
          </div>
          <h2 className="text-3xl sm:text-4xl font-black italic tracking-tight uppercase text-white">
            Why Sponsor SCD 2026?
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
            High-impact returns on investment designed to drive brand recall, recruitment, and live engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_SPONSOR_POINTS.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <motion.div
                key={pt.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl bg-[#0b0e14] border border-white/10 hover:border-aws-orange/40 transition-all group flex flex-col justify-start"
              >
                <div className="w-10 h-10 rounded-lg bg-aws-orange/10 border border-aws-orange/30 flex items-center justify-center text-aws-orange mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold text-white mb-2 font-sans group-hover:text-aws-orange transition-colors">
                  {pt.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  {pt.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Suggested Sponsorship Tiers Cards */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center sm:text-left mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-aws-orange uppercase tracking-widest mb-1 font-bold">
              Investment Options
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl font-black italic tracking-tight uppercase text-white">
              Suggested Sponsorship Tiers
            </h2>
            <p className="text-white/50 text-xs sm:text-sm mt-1">
              Select your tier below to auto-fill the exhibition application form.
            </p>
          </div>
          <span className="font-mono text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg self-start">
            ⚡ Click any tier to select
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sponsorTiers.map((tier, idx) => {
            const isSelected = selectedTier === tier.name;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                onClick={() => handleSelectTier(tier.name)}
                className={`p-6 border rounded-xl flex flex-col justify-between relative overflow-hidden group transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-[#141A26] border-aws-orange shadow-[0_0_25px_rgba(255,153,0,0.25)] ring-2 ring-aws-orange/40 scale-[1.02]'
                    : tier.highlight
                    ? 'bg-gradient-to-br from-aws-orange/10 via-[#101010] to-[#050505] border-aws-orange/40 hover:border-aws-orange'
                    : 'bg-[#0E0E0E] border-white/10 hover:border-white/30 hover:bg-[#141414]'
                }`}
              >
                {/* Highlight top stripe */}
                {tier.highlight && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-aws-orange to-[#E10600]" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-mono text-[10px] tracking-widest uppercase font-bold px-2 py-0.5 rounded ${
                        tier.highlight
                          ? 'bg-aws-orange text-black'
                          : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}
                    >
                      {tier.tag}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-mono font-bold text-aws-orange flex items-center gap-1 animate-pulse">
                        <Check size={12} /> Selected
                      </span>
                    )}
                  </div>

                  <h3 className="font-sans font-black italic tracking-tight text-xl uppercase text-white">
                    {tier.name}
                  </h3>

                  <div className="font-mono text-xl font-bold text-amber-400 mt-2 mb-4">
                    {tier.price}
                  </div>

                  <ul className="space-y-2 border-t border-white/10 pt-4 text-xs font-sans text-white/70">
                    {tier.perks.map((perk, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <ChevronRight size={14} className="text-aws-orange shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleSelectTier(tier.name);
                    }}
                    className={`w-full py-2.5 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-aws-orange text-black shadow-lg shadow-aws-orange/30'
                        : 'bg-white/10 text-white hover:bg-white hover:text-black'
                    }`}
                  >
                    <span>{isSelected ? 'Selected (Apply Below ↓)' : 'Select Tier'}</span>
                    <ArrowDown size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Sponsorship Matrix / Comparison Table */}
      <section className="py-10 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="font-mono text-xs text-aws-orange uppercase tracking-widest mb-1 font-bold">
            Full Breakdown
          </div>
          <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight uppercase text-white">
            Sponsorship Benefits Comparison
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1">
            Compare deliverables, branding sizes, stage time, and booth entitlements across tiers.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#090c12] shadow-2xl">
          <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
            <thead className="bg-[#121724] border-b border-white/10 text-xs font-mono uppercase tracking-wider">
              <tr>
                <th className="py-4 px-5 text-white/90">Benefit</th>
                <th className="py-4 px-5 text-amber-300 font-bold bg-aws-orange/10 border-x border-aws-orange/20">
                  Platinum
                </th>
                <th className="py-4 px-5 text-amber-400 font-bold">Gold</th>
                <th className="py-4 px-5 text-slate-300 font-bold">Silver</th>
                <th className="py-4 px-5 text-slate-400 font-bold">Bronze</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans text-xs">
              {/* Contribution */}
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-5 font-bold text-white font-mono uppercase text-[11px]">
                  Contribution
                </td>
                <td className="py-3.5 px-5 font-mono font-bold text-amber-300 bg-aws-orange/5 border-x border-aws-orange/20">
                  ₹35,000 - ₹45,000
                </td>
                <td className="py-3.5 px-5 font-mono font-bold text-amber-400">
                  ₹15,000 - ₹20,000
                </td>
                <td className="py-3.5 px-5 font-mono font-bold text-white/90">
                  ₹8,000 - ₹12,000
                </td>
                <td className="py-3.5 px-5 font-mono font-bold text-white/70">
                  ₹3,000 - ₹5,000
                </td>
              </tr>

              {/* Logo placement */}
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-5 font-medium text-white/90">Logo placement</td>
                <td className="py-3.5 px-5 text-white bg-aws-orange/5 border-x border-aws-orange/20">
                  <strong>Largest</strong>, on every asset (banners, slides, stage backdrop)
                </td>
                <td className="py-3.5 px-5 text-white/80">
                  <strong>Prominent</strong>, on main assets
                </td>
                <td className="py-3.5 px-5 text-white/70">
                  Standard, on banners/slides
                </td>
                <td className="py-3.5 px-5 text-white/60">
                  Listed on banner/slides
                </td>
              </tr>

              {/* Stage mention */}
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-5 font-medium text-white/90">Stage mention</td>
                <td className="py-3.5 px-5 text-white bg-aws-orange/5 border-x border-aws-orange/20">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-0.5">
                    <CheckCircle2 size={14} /> (opening &amp; closing)
                  </div>
                  <span className="text-[11px] text-white/80">Named as Platinum Sponsor</span>
                </td>
                <td className="py-3.5 px-5 text-emerald-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Yes
                  </div>
                </td>
                <td className="py-3.5 px-5 text-white/30 font-mono">--</td>
                <td className="py-3.5 px-5 text-white/30 font-mono">--</td>
              </tr>

              {/* Stall space */}
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-5 font-medium text-white/90">Stall space</td>
                <td className="py-3.5 px-5 text-white bg-aws-orange/5 border-x border-aws-orange/20">
                  <strong>Premium spot</strong>, largest area
                </td>
                <td className="py-3.5 px-5 text-white/80">
                  <strong>Priority spot</strong>
                </td>
                <td className="py-3.5 px-5 text-white/70">
                  Standard spot
                </td>
                <td className="py-3.5 px-5 text-white/30 font-mono">--</td>
              </tr>

              {/* Social media */}
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-5 font-medium text-white/90">Social media</td>
                <td className="py-3.5 px-5 text-white bg-aws-orange/5 border-x border-aws-orange/20">
                  <strong>Dedicated post + all-event mentions</strong>
                </td>
                <td className="py-3.5 px-5 text-white/80">
                  Dedicated post
                </td>
                <td className="py-3.5 px-5 text-white/70">
                  Shared shoutout post
                </td>
                <td className="py-3.5 px-5 text-white/60">
                  Mention in sponsor list post
                </td>
              </tr>

              {/* Branding on certificates */}
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-5 font-medium text-white/90">Branding on certificates</td>
                <td className="py-3.5 px-5 text-emerald-400 font-bold bg-aws-orange/5 border-x border-aws-orange/20">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Yes
                  </div>
                </td>
                <td className="py-3.5 px-5 text-emerald-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Yes
                  </div>
                </td>
                <td className="py-3.5 px-5 text-white/30 font-mono">--</td>
                <td className="py-3.5 px-5 text-white/30 font-mono">--</td>
              </tr>

              {/* Logo on registration page/website */}
              <tr className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-5 font-medium text-white/90">
                  Logo on registration page / website
                </td>
                <td className="py-3.5 px-5 text-white font-bold bg-aws-orange/5 border-x border-aws-orange/20">
                  Largest
                </td>
                <td className="py-3.5 px-5 text-white/80 font-medium">Standard</td>
                <td className="py-3.5 px-5 text-white/70">Small</td>
                <td className="py-3.5 px-5 text-white/60">Listed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Let's Build The Future Together & Contact Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto">
        <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-r from-[#111] via-[#161a24] to-[#111] border border-aws-orange/30 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-aws-orange font-bold">
              Call For Partnerships
            </span>
            <h2 className="text-3xl sm:text-4xl font-black italic tracking-tight uppercase text-white">
              Let's Build The Future Together
            </h2>
            <p className="text-xs sm:text-base text-white/80 leading-relaxed font-sans">
              AWS Student Community Day 2026 is our chance to prove what a student community can build when given the right support. We'd love to have you as part of that story.
            </p>

            {/* Direct Core Contacts */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <a
                href="tel:7020926643"
                className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-aws-orange transition-all flex items-center gap-3 text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-aws-orange/10 flex items-center justify-center text-aws-orange group-hover:scale-110 transition-transform">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="font-sans font-bold text-white text-sm block">Bhushan Jadhav</span>
                  <span className="font-mono text-xs text-amber-300">7020926643</span>
                </div>
              </a>

              <a
                href="tel:7620900361"
                className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-aws-orange transition-all flex items-center gap-3 text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-aws-orange/10 flex items-center justify-center text-aws-orange group-hover:scale-110 transition-transform">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="font-sans font-bold text-white text-sm block">Tushant Tagade</span>
                  <span className="font-mono text-xs text-amber-300">7620900361</span>
                </div>
              </a>
            </div>

            {/* Official Community Channels */}
            <div className="pt-6 border-t border-white/10">
              <span className="text-xs font-mono uppercase tracking-widest text-white/50 block mb-3 font-semibold">
                Official Community Channels
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
                <a
                  href="https://www.meetup.com/aws-sbg-at-government-college-of-engineeringkolhapur/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-aws-orange transition-all flex items-center gap-1.5"
                >
                  <span>Meetup Page</span>
                  <ExternalLink size={12} className="text-aws-orange" />
                </a>

                <a
                  href="https://www.linkedin.com/company/aws-sbg-gcoe-kolhapur/home/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-aws-orange transition-all flex items-center gap-1.5"
                >
                  <span>LinkedIn Page</span>
                  <ExternalLink size={12} className="text-aws-orange" />
                </a>

                <a
                  href="https://www.instagram.com/aws.sbg.gcoe.kolhapur?stkn=eGl0bG5kbjJvbjN1"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:border-aws-orange transition-all flex items-center gap-1.5"
                >
                  <span>Instagram</span>
                  <ExternalLink size={12} className="text-aws-orange" />
                </a>

                <a
                  href="mailto:awssbggcoek@gmail.com"
                  className="px-3.5 py-1.5 rounded-lg bg-aws-orange/10 border border-aws-orange/30 text-aws-orange hover:bg-aws-orange hover:text-black transition-all flex items-center gap-1.5 font-bold"
                >
                  <Mail size={12} />
                  <span>awssbggcoek@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Application Form Section */}
      <section
        id="apply"
        ref={formRef}
        className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 border-t border-white/10 bg-[#080808]"
      >
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="font-mono text-xs text-aws-orange uppercase tracking-widest mb-2 flex items-center justify-center gap-2 font-bold">
              <Store size={14} />
              <span>Sponsor Exhibition &amp; Partnership Application</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl font-black italic tracking-tight uppercase text-white">
              Lock In Your Brand's Grid Slot
            </h2>
            <p className="text-white/60 text-xs sm:text-sm max-w-lg mx-auto mt-2">
              Select your tier, share details about your business and stall requirements, and upload photos of your company, showroom, or products.
            </p>

            {/* Currently Selected Tier Badge */}
            <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-aws-orange/10 border border-aws-orange/40 text-aws-orange">
              <span className="font-mono text-xs uppercase font-bold">Current Selection:</span>
              <strong className="text-sm sm:text-base font-black text-white">
                {currentTierObj.name} ({currentTierObj.price})
              </strong>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-[#0F131D] border border-[#233147] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Top racing accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-aws-orange via-amber-400 to-[#E10600]" />

            {status === 'success' ? (
              <div className="text-center py-12 space-y-5 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
                  <Check size={32} />
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-bold block">
                    Application Received &amp; Logged
                  </span>
                  <h3 className="text-2xl font-black italic text-white uppercase tracking-tight">
                    Welcome to the Circuit, {company}!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Your proposal for <strong className="text-amber-400">{selectedTier}</strong> has been transmitted to the core SCD Kolhapur organizing committee.
                  </p>
                </div>

                <div className="bg-[#0B0F19] border border-[#233147] p-4 rounded-xl max-w-sm mx-auto font-mono text-xs space-y-1 text-left">
                  <div className="text-slate-400 text-[10px] uppercase">Application Reference ID:</div>
                  <div className="text-amber-400 text-lg font-bold select-all">{submittedAppId}</div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Contact: {contactName} ({phone})
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setCompany('');
                      setContactName('');
                      setEmail('');
                      setPhone('');
                      setWebsite('');
                      setCustomShowcase('');
                      setDetails('');
                      setCompanyPhotoBase64('');
                    }}
                    className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                  <Link
                    to="/"
                    className="px-5 py-2.5 rounded-lg bg-aws-orange hover:bg-white text-black font-mono text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tier Selection Radio / Dropdown */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Sponsorship Tier &amp; Contribution *
                  </label>
                  <select
                    required
                    value={selectedTier}
                    onChange={e => setSelectedTier(e.target.value)}
                    className="w-full bg-[#080C14] border border-[#243044] rounded-lg px-4 py-3 text-white text-sm font-mono focus:border-aws-orange outline-none"
                  >
                    {sponsorTiers.map(t => (
                      <option key={t.name} value={t.name} className="bg-[#0B0F19] text-white">
                        {t.name} — {t.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Company & Industry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
                      <Building2 size={13} className="text-aws-orange" />
                      <span>Company / Organization Name *</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="e.g. Apex Cloud Solutions Pvt Ltd"
                      className="w-full bg-[#080C14] border border-[#243044] rounded-lg px-3.5 py-2.5 text-white text-xs sm:text-sm font-sans focus:border-aws-orange outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
                      <Briefcase size={13} className="text-aws-orange" />
                      <span>Industry / Business Category *</span>
                    </label>
                    <select
                      value={industry}
                      onChange={e => setIndustry(e.target.value)}
                      className="w-full bg-[#080C14] border border-[#243044] rounded-lg px-3.5 py-2.5 text-white text-xs sm:text-sm font-sans focus:border-aws-orange outline-none"
                    >
                      <option value="Cloud & IT Services">Cloud Infrastructure &amp; IT Services</option>
                      <option value="Software & SaaS">Software, Apps &amp; SaaS</option>
                      <option value="AI & Machine Learning">AI &amp; Data Intelligence</option>
                      <option value="EdTech & Training">EdTech &amp; Career Training</option>
                      <option value="Hardware, IoT & Electronics">Hardware, IoT &amp; Electronics</option>
                      <option value="Local Business & Retail">Local Business &amp; Retail Showroom</option>
                      <option value="Finance & Fintech">Fintech &amp; Banking</option>
                      <option value="Startup">Early-Stage Startup</option>
                      <option value="Other">Other Category</option>
                    </select>
                  </div>
                </div>

                {/* Contact Name & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
                      <User size={13} className="text-aws-orange" />
                      <span>Contact Person *</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full bg-[#080C14] border border-[#243044] rounded-lg px-3.5 py-2.5 text-white text-xs sm:text-sm font-sans focus:border-aws-orange outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
                      <Mail size={13} className="text-aws-orange" />
                      <span>Official Email *</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="contact@company.com"
                      className="w-full bg-[#080C14] border border-[#243044] rounded-lg px-3.5 py-2.5 text-white text-xs sm:text-sm font-sans focus:border-aws-orange outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
                      <Phone size={13} className="text-aws-orange" />
                      <span>Phone / WhatsApp *</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98220 00000"
                      className="w-full bg-[#080C14] border border-[#243044] rounded-lg px-3.5 py-2.5 text-white text-xs sm:text-sm font-sans focus:border-aws-orange outline-none"
                    />
                  </div>
                </div>

                {/* Website URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
                    <Globe size={13} className="text-aws-orange" />
                    <span>Company Website or LinkedIn Link</span>
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://company.com or https://linkedin.com/company/..."
                    className="w-full bg-[#080C14] border border-[#243044] rounded-lg px-3.5 py-2.5 text-white text-xs sm:text-sm font-sans focus:border-aws-orange outline-none"
                  />
                </div>

                {/* Company / Shop / Stall Photo Upload */}
                <div className="space-y-2 pt-2 border-t border-[#1E293B]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
                      <Upload size={13} className="text-amber-400" />
                      <span>Photo of Company Logo, Showroom, Stall or Products</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">JPG, PNG, WebP (Max 5MB)</span>
                  </div>

                  {companyPhotoBase64 ? (
                    <div className="bg-[#080C14] border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={companyPhotoBase64}
                          alt="Company preview"
                          className="w-14 h-14 object-cover rounded-lg border border-white/20"
                        />
                        <div className="min-w-0">
                          <span className="text-xs text-white font-mono block truncate">
                            {photoFileName || 'Uploaded Photo'}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                            <Check size={12} /> Ready for submission
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCompanyPhotoBase64('');
                          setPhotoFileName('');
                        }}
                        className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-mono transition-colors"
                        title="Remove photo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-[#243044] hover:border-aws-orange rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#080C14]/60 group">
                      <Upload size={22} className="text-slate-400 group-hover:text-aws-orange mb-1.5" />
                      <span className="text-xs text-slate-200 font-sans group-hover:text-white font-medium">
                        {isCompressingPhoto ? 'Processing photo…' : 'Click or Drag to Upload Showroom / Logo / Stall Photo'}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        Will be displayed in sponsor catalog and reviewed by committee
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={isCompressingPhoto}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* What they want to showcase */}
                <div className="space-y-2 pt-2 border-t border-[#1E293B]">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block font-bold">
                    What would you like to showcase or feature in the event? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SHOWCASE_OPTIONS.map(opt => {
                      const active = showcaseInterests.includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => toggleShowcaseInterest(opt)}
                          className={`text-left text-xs p-2.5 rounded-lg border font-mono transition-all flex items-center justify-between cursor-pointer ${
                            active
                              ? 'bg-aws-orange/15 border-aws-orange text-white font-bold'
                              : 'bg-[#080C14] border-[#243044] text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{opt}</span>
                          {active && <Check size={14} className="text-aws-orange shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2">
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Specific details on what you want to exhibit / demonstrate:
                    </label>
                    <textarea
                      rows={2}
                      value={customShowcase}
                      onChange={e => setCustomShowcase(e.target.value)}
                      placeholder="e.g. We want to exhibit our developer tools and host a hands-on live demo for student participants..."
                      className="w-full bg-[#080C14] border border-[#243044] rounded-lg p-3 text-white text-xs font-sans focus:border-aws-orange outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
                    <MessageSquare size={13} className="text-aws-orange" />
                    <span>Additional Goals, Stall Requirements or Questions</span>
                  </label>
                  <textarea
                    rows={3}
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    placeholder="Tell us any custom booth size requirements, electrical connections, or branding requests..."
                    className="w-full bg-[#080C14] border border-[#243044] rounded-lg p-3 text-white text-xs font-sans focus:border-aws-orange outline-none resize-none"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-950/80 border border-red-700 text-red-300 text-xs font-mono">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-aws-orange to-amber-500 hover:from-white hover:to-white text-black font-sans font-black italic uppercase text-sm sm:text-base tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-aws-orange/20 transition-all cursor-pointer"
                >
                  <Send size={16} />
                  <span>{status === 'loading' ? 'Transmitting Proposal…' : 'Submit Sponsorship Proposal'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-8 lg:px-12 bg-[#030303]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <span>© 2026 AWS Student Builder Group, GCOEK Kolhapur. All rights reserved.</span>
          <Link to="/" className="text-aws-orange hover:text-white transition-colors">
            ← Return to SCD 2026 Home
          </Link>
        </div>
      </footer>
    </div>
  );
};
