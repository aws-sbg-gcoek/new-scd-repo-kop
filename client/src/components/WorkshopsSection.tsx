import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeader } from './LayoutElements';
import {
  Terminal,
  Clock,
  Laptop,
  CheckCircle2,
  Linkedin,
  Layers,
  Cpu,
  Award,
  Radio,
  AlertTriangle,
  Lightbulb,
  X,
  ArrowRight,
  Search,
  SlidersHorizontal
} from 'lucide-react';

interface WorkshopItem {
  id: string;
  number: string;
  gridCode: string;
  badge: string;
  level: string;
  timing: string;
  scheduleTime: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  tagline: string;
  description: string;
  audience: string;
  format: string;
  host: string;
  speaker: {
    name: string;
    designation: string;
    role: string;
    specialBadge: string;
    image: string;
    linkedin: string;
    portfolio?: string;
  };
  highlights: string[];
  keyTopics: string[];
  bonusLabs?: {
    number: string;
    title: string;
    desc: string;
  }[];
  prerequisites: string[];
  organizerNote: string;
  learningOutcomes: string[];
}

const WORKSHOPS: WorkshopItem[] = [
  {
    id: 'workshop-01',
    number: '01',
    gridCode: 'SECTOR-C3',
    badge: 'LIVE CONSOLE',
    level: 'AWS LEVEL 100',
    timing: '45-Min Core + 3 × 10-Min Labs',
    scheduleTime: '12:15 - 13:00',
    title: 'AWS Console Explorer',
    shortTitle: 'AWS Console Explorer',
    subtitle: 'Discover, Secure & Build Your First Cloud Resources',
    tagline: 'Live AWS Console walkthrough from cloud foundations to security, storage & serverless.',
    description:
      'New to AWS and unsure where to begin? In this live-console workshop, students will explore the AWS Management Console and its main service categories, understand AWS accounts and identity management, and discover how IAM users, groups, roles and policies differ. Participants will see a secure S3 upload, explore VPCs, subnets and CIDR through a beginner-friendly example, and learn where commonly used compute, database and monitoring services fit. Three optional 10-minute bonus labs demonstrate AWS Lambda with CloudWatch, a simple VPC build, and static website hosting through AWS Amplify.',
    audience:
      'Engineering students, first-time AWS users, freshers and aspiring cloud practitioners. No previous AWS experience required.',
    format: 'Live AWS Management Console Walkthrough + Guided Hands-on Demos',
    host: 'AWS Student Builder Group Kolhapur',
    speaker: {
      name: 'Atul Kumbhar',
      designation: 'Senior Consultant – Platform Ops, CirrusLabs',
      role: 'Former AWS Community Builder · AWS User Group Organizer',
      specialBadge: 'FORMER AWS COMMUNITY BUILDER',
      image: '/Speakers/atul-kumbhar.jpg',
      linkedin: 'https://www.linkedin.com/in/kumbharatul/',
      portfolio: 'https://bio.link/atulkumbhar'
    },
    highlights: [
      'Console navigation, Regions, AZs & AWS account hierarchies',
      'IAM identities, least-privilege policies & secure S3 storage',
      'VPC networking basics with 3 optional 10-min bonus labs'
    ],
    keyTopics: [
      'Console navigation, service categories, Regions and Availability Zones',
      'AWS accounts, Organizations, IAM Identity Center, users, groups, roles and policies',
      'Amazon S3 private bucket, objects, encryption and Block Public Access',
      'Amazon VPC, CIDR and subnet fundamentals with a simple /24 → /25 example',
      'Service discovery: EC2, Lambda, RDS, CloudWatch, Cost Management and AWS updates'
    ],
    bonusLabs: [
      {
        number: 'BONUS LAB 01',
        title: 'AWS Lambda with CloudWatch',
        desc: 'Build and trigger a serverless function with automated log streaming and metrics.'
      },
      {
        number: 'BONUS LAB 02',
        title: 'Simple Virtual Private Cloud (VPC)',
        desc: 'Step-by-step isolated network boundary build with public and private subnets.'
      },
      {
        number: 'BONUS LAB 03',
        title: 'Static Web Hosting with AWS Amplify',
        desc: 'Deploy and distribute a live web application frontend with zero server management.'
      }
    ],
    prerequisites: [
      'Bring your personal laptop with Google Chrome or Firefox installed',
      'Organizer-approved AWS sandbox identity (arranged by the event team)',
      'Temporary credentials will be provided; no personal credit card needed',
      'Stable campus Wi-Fi connection and modern web browser',
      'Sample reference files and architectural slides will be provided by the instructor'
    ],
    organizerNote:
      'AWS account registration and access will be arranged separately by the event team. Attendees should bring laptops and use an organizer-approved AWS sandbox identity, preferably with temporary credentials. Stable internet and a projected live AWS Console are required. Optional creation labs depend on account permissions; some AWS services can incur charges. The instructor will provide sample files and reference slides.',
    learningOutcomes: [
      'Confidently navigate the AWS Management Console & locate foundational services',
      'Distinguish AWS root accounts from IAM users, groups, and temporary assumption roles',
      'Apply least-privilege security policies, S3 encryption, and Block Public Access',
      'Understand core cloud networking concepts: VPC, CIDR blocks, subnets, and routing'
    ]
  },
  {
    id: 'workshop-02',
    number: '02',
    gridCode: 'SECTOR-D4',
    badge: 'SPEC-DRIVEN AI',
    level: 'AWS LEVEL 200',
    timing: '45 Minutes Practical Implementation',
    scheduleTime: '16:00 - 16:45',
    title: 'From Specs to Agents with Amazon Kiro',
    shortTitle: 'Amazon Kiro & Agents',
    subtitle: 'Building Production-Ready Full-Stack Applications',
    tagline: 'Spec-driven development, serverless architectures, and specialized AI developer agents.',
    description:
      'Explore Spec-Driven Development with Amazon Kiro in this hands-on workshop by building a full-stack application using React, Node.js, Amazon DynamoDB, and AWS CDK. Learn to transform requirements into specifications, automate infrastructure and testing, and build specialized AI agents for development, code review, and security. Discover best practices for creating reliable, secure, production-ready cloud applications.',
    audience:
      'Developers, computer science students, cloud practitioners, and engineers interested in modern cloud-native architectures & AI-driven coding agents.',
    format: 'Live Code Along + Infrastructure as Code (AWS CDK) + AI Agent Automation',
    host: 'AWS Student Builder Group Kolhapur',
    speaker: {
      name: 'Jayesh Ashok Shinde',
      designation: 'AWS Golden Jacket Holder',
      role: '20+ Years Technology Professional · Backend & Scalable Architectures',
      specialBadge: 'AWS GOLDEN JACKET',
      image: 'https://i.ibb.co/Ng7s0J5V/IMG-20261020-WA0036-jpg-1.jpg',
      linkedin: 'https://www.linkedin.com/in/jayeshshinde?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      portfolio: 'https://www.credly.com/users/jayesh-a-shinde/badges/credly'
    },
    highlights: [
      'Spec-Driven Development with Amazon Kiro for rapid architectures',
      'Full-stack React, Node.js & DynamoDB deployment via AWS CDK',
      'Building specialized AI agents for automated testing & security'
    ],
    keyTopics: [
      'Spec-Driven Development with Amazon Kiro — Requirements to structured architecture tasks',
      'Full-Stack App Development — React frontend + Node.js REST APIs with Amazon DynamoDB',
      'Infrastructure as Code with AWS CDK — Serverless provisioning of API Gateway & Lambda',
      'Building Specialized AI Agents — Automated code generation, test suites, and security review',
      'Production Readiness & Quality — Automated testing, least-privilege IAM, and deployment validation'
    ],
    prerequisites: [
      'Laptop with Node.js 18+ and code editor (VS Code recommended)',
      'Basic knowledge of JavaScript / TypeScript and REST APIs',
      'AWS CLI and CDK installed (pre-installation instructions will be shared)',
      'Curiosity for AI-assisted development and cloud automation'
    ],
    organizerNote:
      'Starter repository, sample architectural templates, and CDK project boilerplate will be provided before the session. Ensure your laptop is fully charged.',
    learningOutcomes: [
      'Master specification-driven engineering for enterprise-grade cloud applications',
      'Deploy serverless full-stack infrastructure in minutes using AWS CDK',
      'Build custom AI agents for rapid development, test generation, and pull request audits',
      'Implement enterprise cloud security best practices with DynamoDB and IAM'
    ]
  }
];

export const WorkshopsSection = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopItem | null>(null);
  const [modalTab, setModalTab] = useState<'topics' | 'labs' | 'prereqs' | 'outcomes'>('topics');

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedWorkshop) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedWorkshop]);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedWorkshop(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered workshops based on pills and search input
  const filteredWorkshops = useMemo(() => {
    return WORKSHOPS.filter(ws => {
      // Pill check
      const matchesPill = activeFilter === 'all' || ws.id === activeFilter;
      if (!matchesPill) return false;

      // Search query check
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        ws.title.toLowerCase().includes(q) ||
        ws.subtitle.toLowerCase().includes(q) ||
        ws.speaker.name.toLowerCase().includes(q) ||
        ws.keyTopics.some(t => t.toLowerCase().includes(q)) ||
        ws.level.toLowerCase().includes(q)
      );
    });
  }, [activeFilter, searchQuery]);

  return (
    <section id="workshops" className="relative py-16 sm:py-24 px-4 sm:px-12 lg:px-24 bg-[#050505] overflow-hidden" aria-label="Workshops section">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[300px] bg-aws-orange/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <SectionHeader
          title="Workshops"
          subtitle="Filter by workshop or search services to explore hands-on masterclasses and console walkthroughs."
          sysId="04.WKS"
        />

        {/* Search & Filter Bar matching ActivitiesSection aesthetic */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
          {/* Filter Pills matching the web's AWS / F1 Dark Aesthetic */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 font-bold cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-aws-orange text-black font-black shadow-[0_0_25px_rgba(255,153,0,0.35)] scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
              }`}
            >
              All Workshops
            </button>

            {WORKSHOPS.map(ws => {
              const isActive = activeFilter === ws.id;
              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => setActiveFilter(ws.id)}
                  className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 font-bold cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  {ws.shortTitle}
                </button>
              );
            })}
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search topics (S3, VPC, CDK)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-aws-orange/60 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-white/40 font-mono focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Status Bar */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8 relative z-10">
        <div className="p-3 sm:px-5 sm:py-2.5 bg-[#090909] border border-white/10 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-aws-orange animate-ping" />
            <span className="font-mono text-[9px] sm:text-[10px] text-aws-orange uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Radio size={11} className="text-aws-orange" />
              PADDOCK LABS // {filteredWorkshops.length} OF {WORKSHOPS.length} WORKSHOPS DISPLAYED
            </span>
          </div>
          <div className="font-mono text-[9px] sm:text-[10px] text-white/50 tracking-wider flex items-center gap-2">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Laptop size={11} />
              <span>BRING YOUR LAPTOP</span>
            </span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-white/40 hidden sm:inline">AWS SANDBOX PROVIDED</span>
          </div>
        </div>
      </div>

      {/* Workshops Cards Display */}
      {filteredWorkshops.length === 0 ? (
        <div className="max-w-7xl mx-auto p-12 text-center bg-[#090909] border border-white/10 rounded-2xl">
          <p className="font-mono text-sm text-white/60 mb-3">No workshops found matching "{searchQuery}"</p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-aws-orange text-black font-mono text-xs font-bold uppercase rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-7xl mx-auto relative z-10">
          {filteredWorkshops.map((ws, i) => (
            <motion.div
              key={ws.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onClick={() => {
                setSelectedWorkshop(ws);
                setModalTab('topics');
              }}
              className="group relative cursor-pointer bg-[#0d0d0d] border border-white/10 hover:border-aws-orange/60 rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,153,0,0.12)] hover:-translate-y-1 overflow-hidden"
            >
              {/* Tech corner accents */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 group-hover:border-aws-orange/50 transition-colors pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/10 group-hover:border-aws-orange/50 transition-colors pointer-events-none" />

              <div>
                {/* Top Meta Line */}
                <div className="flex items-center justify-between gap-2 mb-3 font-mono text-[9px] uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-aws-orange text-black font-black">
                      WORKSHOP {ws.number}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-emerald-400 border border-emerald-500/20 font-bold">
                      {ws.level}
                    </span>
                  </div>
                  <span className="text-aws-orange font-bold flex items-center gap-1">
                    <Clock size={11} />
                    <span>{ws.scheduleTime}</span>
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-sans font-black italic text-lg sm:text-xl text-white uppercase tracking-tight group-hover:text-aws-orange transition-colors mb-1 line-clamp-1">
                  {ws.title}
                </h3>
                <p className="font-sans text-xs text-white/50 mb-4 line-clamp-2 leading-relaxed">
                  {ws.subtitle}
                </p>

                {/* Instructor Compact Pill */}
                <div className="flex items-center gap-3 p-2.5 bg-white/[0.02] border border-white/5 rounded-xl mb-4 group-hover:border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-aws-orange/60 shrink-0 bg-black">
                    <img
                      src={ws.speaker.image}
                      alt={ws.speaker.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-sans font-bold text-xs text-white uppercase truncate">
                      {ws.speaker.name}
                    </div>
                    <div className="font-mono text-[9px] text-aws-orange truncate">
                      {ws.speaker.designation}
                    </div>
                  </div>
                </div>

                {/* 3 Highlights Bullets */}
                <div className="space-y-1.5 mb-5 font-sans text-xs text-white/70">
                  {ws.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[9px]">
                <span className="text-white/40 uppercase tracking-wider flex items-center gap-1">
                  <Laptop size={11} className="text-aws-orange" />
                  <span>{ws.timing.split('+')[0].trim()}</span>
                </span>
                <span className="text-aws-orange font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>VIEW SYLLABUS & LABS</span>
                  <ArrowRight size={11} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cyber Telemetry Modal for Complete Syllabus & Details */}
      {createPortal(
        <AnimatePresence>
          {selectedWorkshop && (
            <div
              className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6"
              role="dialog"
              aria-label="Workshop Telemetry Modal"
              aria-modal="true"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedWorkshop(null)}
                className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              />

              {/* Modal Box */}
              <motion.div
                data-lenis-prevent
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                className="relative w-full max-w-3xl bg-[#0b0b0b] border border-aws-orange/40 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,153,0,0.08)] z-10 flex flex-col max-h-[92vh] sm:max-h-[85vh]"
              >
                {/* Top Cyber HUD Bar */}
                <div className="relative border-b border-white/10 bg-[#0e0e0e] px-5 py-3 flex justify-between items-center text-[10px] font-mono tracking-widest text-white/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-aws-orange animate-ping" />
                    <span className="text-aws-orange font-bold">
                      WORKSHOP {selectedWorkshop.number} // {selectedWorkshop.scheduleTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-white/30">{selectedWorkshop.gridCode}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedWorkshop(null)}
                      className="p-1 hover:text-white text-white/50 transition-colors border border-white/5 hover:border-aws-orange/30 rounded bg-white/[0.02] cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-7 text-left">
                  {/* Title & Tagline */}
                  <div className="mb-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[9px] font-bold uppercase">
                        {selectedWorkshop.level}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-white/60 font-mono text-[9px] uppercase">
                        {selectedWorkshop.timing}
                      </span>
                    </div>
                    <h3 className="font-sans font-black italic text-xl sm:text-2xl text-white uppercase tracking-tight mb-1">
                      {selectedWorkshop.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-aws-orange font-medium">
                      {selectedWorkshop.subtitle}
                    </p>
                  </div>

                  {/* Speaker Card Pill */}
                  <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-aws-orange/60 shrink-0 bg-black">
                        <img
                          src={selectedWorkshop.speaker.image}
                          alt={selectedWorkshop.speaker.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <div className="font-sans font-bold text-sm text-white uppercase">
                          {selectedWorkshop.speaker.name}
                        </div>
                        <div className="font-mono text-[10px] text-aws-orange">
                          {selectedWorkshop.speaker.designation}
                        </div>
                        <div className="font-sans text-[11px] text-white/50">
                          {selectedWorkshop.speaker.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {selectedWorkshop.speaker.linkedin && (
                        <a
                          href={selectedWorkshop.speaker.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 font-mono text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 font-bold"
                        >
                          <Linkedin size={11} className="text-blue-400" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {selectedWorkshop.speaker.portfolio && (
                        <a
                          href={selectedWorkshop.speaker.portfolio}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-mono text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 font-bold"
                        >
                          <Award size={11} className="text-yellow-400" />
                          <span>Bio</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Overview Text */}
                  <div className="mb-5 p-3.5 bg-black/40 border border-white/5 rounded-xl text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                    {selectedWorkshop.description}
                  </div>

                  {/* Subtabs for Clean Modular Mobile Experience */}
                  <div className="flex flex-wrap gap-1.5 border-b border-white/10 pb-3 mb-4 font-mono text-[9px] sm:text-[10px]">
                    <button
                      type="button"
                      onClick={() => setModalTab('topics')}
                      className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        modalTab === 'topics'
                          ? 'bg-aws-orange text-black border-aws-orange'
                          : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      <Layers size={11} />
                      <span>Key Topics ({selectedWorkshop.keyTopics.length})</span>
                    </button>

                    {selectedWorkshop.bonusLabs && (
                      <button
                        type="button"
                        onClick={() => setModalTab('labs')}
                        className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          modalTab === 'labs'
                            ? 'bg-aws-orange text-black border-aws-orange'
                            : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        <Cpu size={11} />
                        <span>3 × Bonus Labs</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setModalTab('prereqs')}
                      className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        modalTab === 'prereqs'
                          ? 'bg-aws-orange text-black border-aws-orange'
                          : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      <Laptop size={11} />
                      <span>Prerequisites & Notes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModalTab('outcomes')}
                      className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        modalTab === 'outcomes'
                          ? 'bg-aws-orange text-black border-aws-orange'
                          : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      <Lightbulb size={11} />
                      <span>Outcomes</span>
                    </button>
                  </div>

                  {/* Subtab Content */}
                  {modalTab === 'topics' && (
                    <div className="space-y-2">
                      {selectedWorkshop.keyTopics.map((topic, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#0f0f0f] border border-white/5 rounded-xl flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded bg-aws-orange/10 border border-aws-orange/30 text-aws-orange font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            0{idx + 1}
                          </span>
                          <span className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {modalTab === 'labs' && selectedWorkshop.bonusLabs && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedWorkshop.bonusLabs.map((lab, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 bg-[#0f0f0f] border border-white/10 rounded-xl flex flex-col justify-between"
                        >
                          <div>
                            <span className="font-mono text-[8px] uppercase tracking-wider text-aws-orange font-bold block mb-1">
                              {lab.number}
                            </span>
                            <h4 className="font-sans font-bold text-xs sm:text-sm text-white mb-1.5">
                              {lab.title}
                            </h4>
                            <p className="font-sans text-[11px] text-white/60 leading-relaxed">
                              {lab.desc}
                            </p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-white/5 font-mono text-[9px] text-white/40 flex items-center gap-1">
                            <Clock size={10} className="text-aws-orange" />
                            <span>~10 MINS</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {modalTab === 'prereqs' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedWorkshop.prerequisites.map((req, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 bg-[#0f0f0f] border border-white/5 rounded-xl flex items-start gap-2 text-xs text-white/80"
                          >
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </div>
                        ))}
                      </div>

                      {selectedWorkshop.organizerNote && (
                        <div className="p-3.5 bg-amber-500/[0.04] border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed">
                          <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
                              ORGANIZER NOTE:
                            </span>
                            <span>{selectedWorkshop.organizerNote}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {modalTab === 'outcomes' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedWorkshop.learningOutcomes.map((outcome, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#0f0f0f] border border-white/5 rounded-xl flex items-start gap-2.5"
                        >
                          <Lightbulb size={15} className="text-aws-orange shrink-0 mt-0.5" />
                          <span className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed">
                            {outcome}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="border-t border-white/10 bg-[#0e0e0e] px-5 py-3 flex items-center justify-between font-mono text-[9px] text-white/50">
                  <span className="flex items-center gap-1">
                    <Laptop size={11} className="text-emerald-400" />
                    <span>HOST: {selectedWorkshop.host}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedWorkshop(null)}
                    className="px-3 py-1 bg-aws-orange text-black font-bold uppercase rounded hover:bg-white transition-colors cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};
