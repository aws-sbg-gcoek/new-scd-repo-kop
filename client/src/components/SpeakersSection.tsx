import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { SectionHeader } from './LayoutElements';
import { 
  Radio, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  Ticket, 
  X, 
  Terminal, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Cloud, 
  Users, 
  Binary, 
  Workflow, 
  Award,
  Lock,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Linkedin
} from 'lucide-react';

interface SpeakerSlot {
  id: number;
  revealed: boolean;
  name?: string;
  image?: string;
  designation?: string;
  role?: string;
  badge: string;
  specialBadge?: string;
  subTrackBadge?: string;
  experience?: string;
  accreditation?: string;
  sector: string;
  track: string;
  headline: string;
  focus: string;
  description: string;
  sessionTitle?: string;
  sessionType?: string;
  sessionDescription?: string;
  keyTopics?: string[];
  certifications?: string[];
  credlyLink?: string;
  linkedinLink?: string;
  statusBadge: string;
  iconName: string;
}

const SPEAKER_SLOTS: SpeakerSlot[] = [
  {
    id: 1,
    revealed: true,
    name: "Rana Okan",
    image: "/Speakers/rana-okan.jpg",
    designation: "Associate Account Manager — SBGL Program, Amazon Web Services (AWS)",
    role: "AWS Student Builder Group Leader Program · Strategy & Analytics Professional",
    badge: "SPEAKER 01 // KEYNOTE",
    specialBadge: "AMAZON WEB SERVICES",
    subTrackBadge: "Short Introduction (Between Events)",
    experience: "GLOBAL PROGRAMS",
    accreditation: "AWS SBGL",
    sector: "SECTOR-A1",
    track: "Keynote Address",
    headline: "Greetings from Boston — AWS & the SBGL Program",
    focus: "AWS SBGL Program, Student Empowerment & Cloud Leadership",
    description: "Data-driven strategy and analytics professional with experience leading global programs, analyzing business performance, and developing insight-driven recommendations that support strategic decision-making. With foundations in finance, marketing, and analytics, Rana brings a unique approach to problem-solving — connecting financial performance with consumer behavior, engagement trends, and growth opportunities. Skilled at translating complex quantitative and qualitative data into actionable business insights that inform strategy, optimize performance, and drive organizational growth. Education: Babson College, BS in Finance | Boston University, MS in Marketing Analytics & Advertising.",
    sessionType: "Short Introduction (Between Events)",
    sessionTitle: "Greetings from Boston — AWS & the SBGL Program",
    sessionDescription: "In this short session, Rana shares a warm greeting from Boston and introduces the AWS Student Builder Group Leader (SBGL) Program — a global initiative designed to empower student communities through cloud technology, leadership, and hands-on learning. She also shares a few words of encouragement for the students of Kolhapur as they build their futures in tech.",
    keyTopics: [
      "Overview of the AWS SBGL Program — Understanding the global initiative designed to empower student communities.",
      "Benefits of the SBGL Program for student communities — Resources, mentorship, and opportunities available to student builders.",
      "How students can get involved and grow with AWS — Pathways to join, contribute, and advance within the AWS ecosystem.",
      "Words of inspiration for the students of Kolhapur — Encouragement and guidance for students building their futures in tech."
    ],
    linkedinLink: "https://www.linkedin.com/company/aws-sbg-gcoe-kolhapur/",
    statusBadge: "CONFIRMED // STAGE READY",
    iconName: "award"
  },
  {
    id: 2,
    revealed: true,
    name: "Ameya Prakash Vaidya",
    image: "/Speakers/1780647595003.png",
    designation: "Founder, DreamWorld Tech",
    role: "AWS Community Builder · AWS User Group Pune Leader · 16+ Years Experience",
    badge: "SPEAKER 02 // CONFIRMED",
    specialBadge: "AWS COMMUNITY BUILDER",
    subTrackBadge: "Conducting Session 01 & Workshop 01",
    experience: "16+ YEARS",
    accreditation: "14x CERTIFIED",
    sector: "SECTOR-B2",
    track: "Technical Session 01 & Workshop 01",
    headline: "From Zero to Cloud: Discover the World of AWS",
    focus: "Cloud Computing Foundations, AWS Core Services & Modern Cloud Careers",
    description: "Ameya Vaidya is the Founder of DreamWorld Tech, an EdTech and innovation startup focused on cloud computing, AI, and emerging technologies. With over 16 years of industry experience, he is a technical trainer, speaker, and technology leader passionate about empowering learners and professionals. He leads AWS User Group Pune and is an AWS Community Builder. Ameya holds 6 AWS certifications, 4 Microsoft Azure certifications, and 4 Google Cloud certifications. He also serves as a Board Advisory Member at PCCOE and a Board of Studies Member at MIT ADT University, Pune. He is committed to bridging the gap between industry and academia.",
    sessionType: "Technical Talk & Hands-on Workshop 01",
    sessionTitle: "From Zero to Cloud: Discover the World of AWS",
    sessionDescription: "Ever wondered how websites, mobile apps, and online platforms work behind the scenes? Join us to explore the exciting world of cloud computing and Amazon Web Services (AWS). Discover how the cloud powers our digital world, learn the basics of AWS, and explore the opportunities it offers for your future career. No prior cloud computing knowledge is required — just curiosity and a willingness to learn!",
    keyTopics: [
      "Demystifying the Cloud — Understanding how modern websites, mobile apps, and online platforms operate behind the scenes.",
      "Core AWS Building Blocks — Exploring compute, storage, databases, and global cloud regions in simple, intuitive terms.",
      "Hands-on Cloud Exploration — Guided practical experience taking your very first steps in the AWS management console.",
      "Multi-Cloud Certification Mastery — Practical roadmap and strategy for earning AWS, Azure, and Google Cloud credentials.",
      "Bridging Academia & Industry — How student builders can leverage community contribution and early cloud skills for standout tech careers."
    ],
    linkedinLink: "https://www.linkedin.com/in/ameya-vaidya-9a164317?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    statusBadge: "CONFIRMED // STAGE READY",
    iconName: "cloud"
  },
  {
    id: 3,
    revealed: true,
    name: "Atul Kumbhar",
    image: "/Speakers/atul-kumbhar.jpg",
    designation: "Senior Consultant – Platform Ops, CirrusLabs",
    role: "Former AWS Community Builder · Cloud Architecture & AI Governance Specialist",
    badge: "SPEAKER 03 // CONFIRMED",
    specialBadge: "FORMER AWS COMMUNITY BUILDER",
    subTrackBadge: "Technical Talk",
    experience: "SENIOR CONSULTANT",
    accreditation: "3x AWS CERTIFIED",
    sector: "SECTOR-C3",
    track: "Technical Talk // Cloud Engineering Blueprint",
    headline: "The Cloud Engineering Blueprint: Build, Scale, Modernize & Extend with AI",
    focus: "Cloud Architecture, Platform Engineering, FinOps, Cloud Security & AI Governance",
    description: "Atul Kumbhar is a Senior Consultant – Platform Ops at CirrusLabs, specializing in Cloud Architecture, Platform Engineering, Cloud Security, FinOps, and AI Governance. A former AWS Community Builder and AWS User Group organizer, he actively contributes to the cloud community through technical sessions, workshops, and knowledge sharing. His professional credentials span AWS architecture, security, FinOps, cybersecurity auditing, and AI governance. Passionate about mentoring aspiring engineers, he focuses on bridging engineering fundamentals with real-world cloud architectures, emerging AI technologies, and career development.",
    sessionType: "Technical Talk",
    sessionTitle: "The Cloud Engineering Blueprint: Build, Scale, Modernize & Extend with AI",
    sessionDescription: "How does a simple application evolve into a scalable, secure, cloud-native, and AI-powered system? This session takes participants through a practical engineering journey from application fundamentals and monolithic architectures to AWS cloud infrastructure, scalability, modernization, and Generative AI integration. Along the way, attendees will explore architectural decisions, essential engineering skills, evolving career roles, AWS certification pathways, and the value of community-driven learning.",
    keyTopics: [
      "Engineering Fundamentals & Architectural Thinking — Operating systems, networking, application architecture, functional and non-functional requirements.",
      "Cloud Engineering & Scalability — AWS infrastructure, cloud migration strategies, networking, high availability, reliability, and scaling.",
      "Cloud-Native Modernization — Containers, DevOps, microservices, event-driven architectures, and the Strangler Fig pattern.",
      "AI-Powered Cloud Engineering — Generative AI, LLMs, RAG, AI integration, AI security, and emerging AI engineering opportunities.",
      "Cloud Career Roadmap — Engineering roles, essential competencies, AWS certifications, hands-on learning, and community contributions."
    ],
    certifications: [
      "AWS Certified Solutions Architect – Professional",
      "AWS Certified Security – Specialty",
      "AWS Certified Solutions Architect – Associate",
      "ISACA Advanced in AI Audit (AAIA)",
      "ISACA CISA",
      "ISACA Certified Cybersecurity Operations Analyst (CCOA)",
      "ISO/IEC 42001 AI Management Systems Lead Auditor",
      "ISO/IEC 27001:2022 Lead Auditor",
      "FinOps Certified Practitioner"
    ],
    credlyLink: "https://bio.link/atulkumbhar",
    linkedinLink: "https://www.linkedin.com/in/kumbharatul/",
    statusBadge: "CONFIRMED // STAGE READY",
    iconName: "cloud"
  },
  {
    id: 4,
    revealed: true,
    name: "Jayesh Ashok Shinde",
    image: "https://i.ibb.co/Ng7s0J5V/IMG-20261020-WA0036-jpg-1.jpg",
    designation: "AWS Golden Jacket Holder",
    role: "20+ Years Technology Professional · Backend & Scalable Architectures",
    badge: "SPEAKER 04 // CONFIRMED",
    specialBadge: "AWS GOLDEN JACKET",
    subTrackBadge: "Conducting Session 03 & Workshop 03",
    experience: "20+ YEARS",
    accreditation: "GOLDEN JACKET",
    sector: "SECTOR-D4",
    track: "Technical Session 03 & Workshop 03",
    headline: "From Specs to Agents: Building Production-Ready Full-Stack Applications with Amazon Kiro",
    focus: "Amazon Kiro, React, Node.js, Amazon DynamoDB, AWS CDK & AI Agents",
    description: "A technology professional with 20 years of experience specializing in building scalable, reliable, and production-grade software systems. Experienced in backend engineering, API development, database technologies, and designing robust application architectures. Passionate about cloud-native development, modern engineering practices, and helping developers build practical solutions using emerging AI-powered development tools. Focuses on bridging the gap between application design and implementation through hands-on learning, specification-driven development, and real-world engineering use cases.",
    sessionType: "Technical Session 03 & Hands-on Workshop 03",
    sessionTitle: "From Specs to Agents: Building Production-Ready Full-Stack Applications with Amazon Kiro",
    sessionDescription: "Explore Spec-Driven Development with Amazon Kiro in this hands-on workshop by building a full-stack application using React, Node.js, Amazon DynamoDB, and AWS CDK. Learn to transform requirements into specifications, automate infrastructure and testing, and build specialized AI agents for development, code review, and security. Discover best practices for creating reliable, secure, production-ready cloud applications.",
    keyTopics: [
      "Spec-Driven Development with Amazon Kiro — Transform business requirements into structured specifications, architecture designs, and implementation tasks.",
      "Full-Stack Application Development — Build a React frontend and Node.js REST APIs with Amazon DynamoDB for CRUD operations.",
      "Infrastructure as Code with AWS CDK — Automate provisioning of serverless AWS resources, including API Gateway, Lambda, DynamoDB, and frontend hosting.",
      "Building Specialized AI Agents — Create reusable agents for specification analysis, code generation, infrastructure automation, automated testing, and security reviews.",
      "Production Readiness and Quality Engineering — Apply automated testing, least-privilege IAM, error handling, and deployment validation to build reliable cloud-native applications."
    ],
    credlyLink: "https://www.credly.com/users/jayesh-a-shinde/badges/credly",
    linkedinLink: "https://www.linkedin.com/in/jayeshshinde?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    statusBadge: "CONFIRMED // STAGE READY",
    iconName: "cloud"
  }
];

const renderTrackIcon = (iconName: string, className = "w-6 h-6") => {
  switch (iconName) {
    case 'award': return <Award className={className} />;
    case 'users': return <Users className={className} />;
    case 'cloud': return <Cloud className={className} />;
    case 'workflow': return <Workflow className={className} />;
    case 'binary': return <Binary className={className} />;
    case 'shield': return <ShieldCheck className={className} />;
    case 'cpu': return <Cpu className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export const SpeakersSection = () => {
  const [selectedSlot, setSelectedSlot] = useState<SpeakerSlot | null>(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedSlot) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSlot]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSlot(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="speakers" className="relative py-20 sm:py-28 px-4 sm:px-12 lg:px-24 bg-[#050505] overflow-hidden" aria-label="Speakers section">
      {/* Decorative track line and subtle background glow */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] sm:w-[650px] h-[300px] bg-aws-orange/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="mb-12 max-w-7xl mx-auto">
        <SectionHeader 
          title="Speakers" 
          subtitle="Meet our world-class lineup of AWS community leaders, golden jacket holders, and cloud architects taking the stage at AWS Student Community Day Kolhapur." 
          sysId="02.SPK" 
        />
      </div>

      {/* Live Paddock Status Banner */}
      <div className="max-w-7xl mx-auto mb-8 sm:mb-10 relative z-10">
        <div className="p-4 sm:px-6 sm:py-3.5 bg-[#090909] border border-white/5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-aws-orange animate-ping" />
            <span className="font-mono text-[9px] sm:text-[10px] text-aws-orange uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Radio size={12} className="text-aws-orange" />
              PADDOCK STATUS // 5 STAGE SESSIONS & WORKSHOPS
            </span>
          </div>
          <div className="font-mono text-[9px] sm:text-[10px] text-white/50 tracking-wider flex items-center gap-2">
            <span className="text-white/30 hidden md:inline">EVENT DATE:</span>
            <span className="text-white font-semibold">STAGE REVEAL // NOV 2026</span>
            <span className="text-white/20">|</span>
            <a 
              href="#tickets" 
              className="text-aws-orange hover:text-white underline underline-offset-2 transition-colors flex items-center gap-1 font-bold"
            >
              <span>Get Pass to Attend</span>
              <ChevronRight size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Speaker Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto relative z-10">
        {SPEAKER_SLOTS.map((slot, i) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group relative cursor-pointer h-full"
            onClick={() => setSelectedSlot(slot)}
          >
            {/* Card Body */}
            <div className={`relative bg-[#0d0d0d] border ${
              slot.revealed 
                ? 'border-aws-orange/40 shadow-[0_0_20px_rgba(255,153,0,0.08)]' 
                : 'border-white/5'
            } h-full overflow-hidden flex flex-col justify-start p-5 sm:p-6 transition-all duration-500 hover:border-aws-orange/60 hover:shadow-[0_0_35px_rgba(255,153,0,0.18)] rounded-xl`}>
              
              {/* Corner tech accents */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 group-hover:border-aws-orange/40 transition-colors pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/10 group-hover:border-aws-orange/40 transition-colors pointer-events-none" />

              {/* Background gradient that shifts on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF9900]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Top - Grid Position & Sector */}
              <div className="relative z-10 flex justify-between items-center font-mono text-[8px] sm:text-[9px] text-white/40 uppercase tracking-widest">
                <span>Staging Grid // 0{slot.id}</span>
                <span className="font-bold text-aws-orange/70 group-hover:text-aws-orange transition-colors">
                  {slot.sector}
                </span>
              </div>

              {/* Center - Avatar HUD */}
              <div className="relative z-10 flex-1 flex items-center justify-center my-5 sm:my-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/10 flex items-center justify-center relative bg-white/[0.01] shrink-0">
                  {/* Concentric rotating dashed borders */}
                  <div className={`absolute inset-[-4px] rounded-full border border-dashed ${
                    slot.revealed ? 'border-aws-orange/70 animate-[spin_10s_linear_infinite]' : 'border-aws-orange/40 group-hover:animate-[spin_6s_linear_infinite]'
                  }`} />
                  <div className="absolute inset-[-8px] rounded-full border border-dashed border-white/10 group-hover:border-f1-red/30 group-hover:animate-[spin_4s_linear_reverse_infinite]" />
                  
                  {slot.revealed && slot.image ? (
                    /* Revealed Speaker Photo */
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-aws-orange/60 relative bg-[#070707] shadow-[0_0_20px_rgba(255,153,0,0.25)]">
                      <img 
                        src={slot.image} 
                        alt={slot.name} 
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Scanning laser line animation */}
                      <div className="absolute inset-0 w-full h-[2px] bg-aws-orange shadow-[0_0_8px_#FF9900] opacity-0 group-hover:opacity-100 animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
                    </div>
                  ) : (
                    /* Holographic Classified Avatar HUD */
                    <div className="w-full h-full rounded-full overflow-hidden border border-white/10 relative bg-[#070707] flex flex-col items-center justify-center text-aws-orange group-hover:text-white transition-colors shadow-inner">
                      <div className="p-2.5 rounded-full bg-aws-orange/10 border border-aws-orange/20 mb-1 group-hover:scale-110 group-hover:bg-aws-orange group-hover:text-black transition-all duration-300">
                        {renderTrackIcon(slot.iconName, "w-6 h-6")}
                      </div>
                      <span className="font-mono text-[7px] text-white/40 uppercase tracking-widest">
                        CLASSIFIED
                      </span>

                      {/* Scanning laser line animation */}
                      <div className="absolute inset-0 w-full h-[2px] bg-aws-orange/80 shadow-[0_0_8px_#FF9900] opacity-0 group-hover:opacity-100 animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom - Info */}
              <div className="relative z-10 border-t border-white/5 pt-4 text-left mt-auto flex flex-col justify-start">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <span className={`text-[7.5px] sm:text-[8.5px] font-mono px-2 py-0.5 ${
                    slot.revealed 
                      ? 'bg-aws-orange text-black font-black' 
                      : 'bg-aws-orange/10 border border-aws-orange/25 text-aws-orange font-bold'
                  } rounded uppercase tracking-wider inline-block`}>
                    {slot.badge}
                  </span>
                  {slot.revealed && slot.specialBadge && (
                    <span className="text-[7px] sm:text-[8px] font-mono px-1.5 py-0.5 bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 rounded uppercase font-bold tracking-wider inline-block">
                      {slot.specialBadge}
                    </span>
                  )}
                </div>

                <h3 className="font-sans font-black italic text-base sm:text-lg uppercase tracking-tight text-white group-hover:text-aws-orange transition-colors">
                  {slot.revealed ? slot.name : "Speaker Revealing Soon"}
                </h3>

                {slot.revealed && slot.subTrackBadge && (
                  <div className="mt-1 mb-1.5 flex flex-wrap gap-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      <Terminal size={10} />
                      {slot.subTrackBadge}
                    </span>
                  </div>
                )}

                <p className="font-mono text-[9px] sm:text-[10px] text-white/80 tracking-wider mt-1 font-semibold line-clamp-1">
                  {slot.revealed ? slot.designation : slot.track}
                </p>

                <p className="font-sans text-[11px] text-white/40 mt-1.5 leading-relaxed line-clamp-2">
                  {slot.revealed ? slot.headline : slot.headline}
                </p>

                {/* Event Teaser Pill */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[8.5px]">
                  {slot.revealed ? (
                    <span className="flex items-center gap-1.5 text-aws-orange font-bold">
                      <Sparkles size={11} />
                      <span>VIEW BIO & WORKSHOP</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-white/40 font-bold">
                      <Eye size={11} className="text-aws-orange" />
                      <span>TO SEE: ATTEND EVENT</span>
                    </span>
                  )}
                  <span className="text-white/30 group-hover:text-white transition-colors flex items-center gap-0.5">
                    <span>DETAILS</span>
                    <ArrowRight size={10} />
                  </span>
                </div>
              </div>

              {/* Scanning laser line effect on card edge */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-aws-orange opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_#FF9900]" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dual Paddock Action Banner Below Grid */}
      <div className="max-w-7xl mx-auto mt-12 sm:mt-16 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Banner 1: Attend Event to See Lineup */}
        <div className="relative bg-[#090909] border border-white/10 rounded-2xl p-6 sm:p-8 overflow-hidden backdrop-blur-sm group hover:border-aws-orange/40 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-aws-orange/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-aws-orange/10 border border-aws-orange/20 text-aws-orange font-mono text-[9px] uppercase tracking-widest font-bold mb-3">
                <Ticket size={11} />
                <span>EXPERIENCE ALL 4 SESSIONS & LABS LIVE</span>
              </div>
              <h4 className="font-sans font-black italic text-xl sm:text-2xl uppercase tracking-tight text-white mb-2">
                Want to Experience The Live Masterclasses?
              </h4>
              <p className="font-sans text-xs sm:text-sm text-white/60 leading-relaxed mb-6">
                Technical deep-dives, hands-on labs with Amazon Kiro, and career mentorship are delivered live on stage at AWS Student Community Day Kolhapur. Secure your event pass now!
              </p>
            </div>
            <div>
              <a
                href="#tickets"
                className="inline-flex items-center gap-2 px-6 py-3 bg-aws-orange text-black font-sans font-black italic uppercase text-xs tracking-wider rounded skew-x-[-8deg] hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(255,153,0,0.25)] group/btn cursor-pointer"
              >
                <span className="skew-x-[8deg] flex items-center gap-2">
                  <Ticket size={14} />
                  <span>Get Your Event Pass</span>
                  <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Banner 2: Call for Speakers / Become Speaker */}
        <div className="relative bg-[#090909] border border-white/10 rounded-2xl p-6 sm:p-8 overflow-hidden backdrop-blur-sm group hover:border-white/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/[0.04] border border-white/15 text-white/80 font-mono text-[9px] uppercase tracking-widest font-bold mb-3">
                <Sparkles size={11} className="text-aws-orange" />
                <span>CALL FOR SPEAKERS (CFP)</span>
              </div>
              <h4 className="font-sans font-black italic text-xl sm:text-2xl uppercase tracking-tight text-white mb-2">
                Are You a Cloud Builder or Speaker?
              </h4>
              <p className="font-sans text-xs sm:text-sm text-white/60 leading-relaxed mb-6">
                Have practical expertise in AWS Cloud, Serverless, DevOps, Security, or AI? Submit your talk proposal or register your interest to take the stage at our upcoming events.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/cfp"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.04] border border-white/20 text-white font-sans font-bold italic uppercase text-xs tracking-wider rounded skew-x-[-8deg] hover:border-aws-orange/60 hover:text-aws-orange hover:bg-white/[0.08] transition-all group/btn"
              >
                <span className="skew-x-[8deg] flex items-center gap-2">
                  <Sparkles size={13} className="text-aws-orange" />
                  <span>Submit Speaker Proposal</span>
                  <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </Link>
              <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase flex items-center gap-1.5">
                <Layers size={11} className="text-aws-orange/60" />
                <span>COMMUNITY PROPOSALS</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Detail Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedSlot && (
            <div 
              className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-10"
              role="dialog"
              aria-label="Speaker Telemetry Modal"
              aria-modal="true"
            >
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSlot(null)}
                className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              />

              {/* Modal Box */}
              <motion.div
                data-lenis-prevent
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                className="relative w-full max-w-4xl bg-[#0b0b0b] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,153,0,0.05)] z-10 flex flex-col max-h-[90vh] md:max-h-[85vh]"
              >
                {/* Scanline overlay for cyber effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-40" />

                {/* Top Cyber HUD Bar */}
                <div className="relative border-b border-white/5 bg-[#0e0e0e] px-6 py-3 flex justify-between items-center text-[10px] font-mono tracking-widest text-white/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-aws-orange animate-ping" />
                    <span className="text-aws-orange font-bold">
                      {selectedSlot.revealed 
                        ? `SPEAKER TELEMETRY // 0${selectedSlot.id} CONFIRMED` 
                        : `PADDOCK TELEMETRY // TRACK 0${selectedSlot.id}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden sm:inline">SECTOR: {selectedSlot.sector}</span>
                    <button 
                      type="button" 
                      onClick={() => setSelectedSlot(null)}
                      className="p-1 hover:text-white text-white/50 transition-colors border border-white/5 hover:border-aws-orange/30 rounded bg-white/[0.02] cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column */}
                    <div className="md:col-span-4 flex flex-col items-center">
                      <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full p-2 bg-gradient-to-tr from-f1-red/20 via-transparent to-aws-orange/20 border border-white/5">
                        {/* Concentric rotating design lines */}
                        <div className="absolute inset-0 rounded-full border border-dashed border-aws-orange/30 animate-[spin_12s_linear_infinite]" />
                        <div className="absolute inset-1 rounded-full border border-dashed border-white/20 animate-[spin_8s_linear_reverse_infinite]" />
                        
                        {selectedSlot.revealed && selectedSlot.image ? (
                          <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-aws-orange/60 shadow-[0_0_25px_rgba(255,153,0,0.3)] bg-[#050505]">
                            <img 
                              src={selectedSlot.image} 
                              alt={selectedSlot.name} 
                              className="w-full h-full object-cover object-top"
                            />
                            {/* Laser line scanner animation */}
                            <div className="absolute inset-0 w-full h-[2px] bg-aws-orange shadow-[0_0_8px_#FF9900] animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-aws-orange/40 shadow-[0_0_20px_rgba(255,153,0,0.15)] bg-[#050505] flex flex-col items-center justify-center text-aws-orange">
                            <div className="p-4 rounded-full bg-aws-orange/10 border border-aws-orange/30 mb-2">
                              {renderTrackIcon(selectedSlot.iconName, "w-10 h-10")}
                            </div>
                            <span className="font-mono text-[9px] tracking-widest text-white/60 font-bold">
                              REVEALING AT EVENT
                            </span>
                            <div className="absolute inset-0 w-full h-[2px] bg-aws-orange shadow-[0_0_8px_#FF9900] animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
                          </div>
                        )}
                      </div>

                      {/* Credly / Portfolio badge link button for revealed speaker */}
                      {selectedSlot.credlyLink && (
                        <a
                          href={selectedSlot.credlyLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-500/10 to-aws-orange/10 hover:from-yellow-500/20 hover:to-aws-orange/20 border border-yellow-500/30 text-yellow-300 font-mono text-[10px] uppercase tracking-wider rounded transition-all text-center"
                        >
                          <Award size={13} className="text-yellow-400" />
                          <span>{selectedSlot.credlyLink.includes('bio.link') ? 'Bio & Portfolio' : 'View Credly Badges'}</span>
                          <ExternalLink size={11} />
                        </a>
                      )}

                      {/* LinkedIn link button for revealed speaker */}
                      {selectedSlot.linkedinLink && (
                        <a
                          href={selectedSlot.linkedinLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600/10 to-blue-400/10 hover:from-blue-600/20 hover:to-blue-400/20 border border-blue-500/30 text-blue-300 font-mono text-[10px] uppercase tracking-wider rounded transition-all text-center"
                        >
                          <Linkedin size={13} className="text-blue-400" />
                          <span>LinkedIn Profile</span>
                          <ExternalLink size={11} />
                        </a>
                      )}

                      {/* Quick Telemetry Stats */}
                      <div className="w-full mt-4 bg-white/[0.02] border border-white/5 rounded-lg p-3 font-mono text-[9px] text-white/40 flex flex-col gap-1.5">
                        <div className="flex justify-between">
                          <span>STAGE STATUS:</span>
                          <span className={selectedSlot.revealed ? "text-emerald-400 font-semibold" : "text-yellow-400 font-semibold"}>
                            {selectedSlot.revealed ? "CONFIRMED" : "PREPARING"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>EXPERIENCE:</span>
                          <span className="text-white/80 font-semibold">
                            {selectedSlot.revealed && selectedSlot.experience ? selectedSlot.experience : "CLASSIFIED"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>ACCREDITATION:</span>
                          <span className="text-aws-orange font-semibold">
                            {selectedSlot.revealed && selectedSlot.accreditation ? selectedSlot.accreditation : "STANDBY"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:col-span-8 flex flex-col text-left">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-mono tracking-widest ${
                          selectedSlot.revealed 
                            ? 'bg-aws-orange text-black font-black' 
                            : 'bg-aws-orange/10 border border-aws-orange/20 text-aws-orange font-bold'
                        } uppercase px-2.5 py-0.5 rounded`}>
                          {selectedSlot.badge}
                        </span>
                        {selectedSlot.revealed && selectedSlot.specialBadge && (
                          <span className="text-[9.5px] font-mono tracking-widest text-yellow-300 uppercase bg-yellow-500/15 border border-yellow-500/30 px-2 py-0.5 rounded font-bold">
                            {selectedSlot.specialBadge}
                          </span>
                        )}
                        <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                          {selectedSlot.sector}
                        </span>
                      </div>

                      <h2 className="font-sans font-black italic text-2xl sm:text-3xl md:text-4xl uppercase tracking-tighter text-white leading-none mb-2">
                        {selectedSlot.revealed ? selectedSlot.name : selectedSlot.track}
                      </h2>

                      <div className="font-mono text-xs text-aws-orange font-bold mb-4 flex items-center gap-1.5">
                        <Terminal size={12} />
                        {selectedSlot.revealed ? selectedSlot.designation : selectedSlot.headline}
                      </div>

                      {/* Bio Box */}
                      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl mb-6">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1.5 flex items-center gap-1.5">
                          <Users size={11} className="text-aws-orange" />
                          <span>Professional Background</span>
                        </p>
                        <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-sans">
                          {selectedSlot.description}
                        </p>
                      </div>

                      {/* Certifications & Professional Credentials */}
                      {selectedSlot.certifications && selectedSlot.certifications.length > 0 && (
                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl mb-6">
                          <p className="font-mono text-[9px] uppercase tracking-widest text-aws-orange mb-2.5 flex items-center gap-1.5 font-bold">
                            <Award size={12} className="text-aws-orange" />
                            <span>AWS Certifications & Professional Credentials</span>
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedSlot.certifications.map((cert, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141414] border border-white/10 text-white/90 font-mono text-[10px]"
                              >
                                <CheckCircle2 size={11} className="text-aws-orange shrink-0" />
                                <span>{cert}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Session Parameters Box */}
                      <div className="bg-[#121212] border border-white/5 rounded-xl p-4 sm:p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-aws-orange/5 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1.5">
                          <Sparkles size={10} className="text-aws-orange" /> 
                          {selectedSlot.revealed ? "Confirmed Masterclass & Workshop" : "Focus Areas & Takeaways"}
                        </div>
                        
                        <h4 className="font-sans font-black italic text-base sm:text-lg uppercase tracking-tight text-white mb-2">
                          {selectedSlot.sessionTitle || selectedSlot.headline}
                        </h4>

                        {selectedSlot.sessionDescription && (
                          <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-sans mb-4">
                            {selectedSlot.sessionDescription}
                          </p>
                        )}

                        {/* Key Topics List if available */}
                        {selectedSlot.keyTopics && selectedSlot.keyTopics.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-white/5">
                            <span className="font-mono text-[9px] text-aws-orange uppercase tracking-wider font-bold block mb-2">
                              Key Topics & Practical Takeaways:
                            </span>
                            <ul className="flex flex-col gap-2">
                              {selectedSlot.keyTopics.map((topic, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-white/75 font-sans leading-relaxed">
                                  <CheckCircle2 size={13} className="text-aws-orange shrink-0 mt-0.5" />
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {!selectedSlot.revealed && (
                          <>
                            <p className="font-mono text-xs text-white/80 font-bold mb-2">
                              {selectedSlot.focus}
                            </p>
                            <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-white/50 font-mono text-[10px]">
                              <Lock size={12} className="text-aws-orange" />
                              <span>Speaker details and slides will be unlocked during live presentation.</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Attend CTA inside modal */}
                      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <a
                          href="#tickets"
                          onClick={() => setSelectedSlot(null)}
                          className="px-6 py-2.5 bg-aws-orange text-black font-sans font-black italic uppercase text-xs tracking-wider rounded skew-x-[-8deg] hover:bg-white transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,153,0,0.2)]"
                        >
                          <span className="skew-x-[8deg] flex items-center gap-1.5">
                            <Ticket size={13} />
                            <span>Get Pass To Attend Live</span>
                          </span>
                        </a>

                        <Link
                          to="/cfp"
                          onClick={() => setSelectedSlot(null)}
                          className="px-5 py-2.5 border border-white/10 hover:border-aws-orange/40 text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider rounded transition-colors text-center flex items-center justify-center gap-1.5"
                        >
                          <Sparkles size={12} className="text-aws-orange" />
                          <span>Call For Speakers</span>
                        </Link>
                      </div>

                    </div>

                  </div>
                </div>

                {/* Bottom Cyber HUD Footer */}
                <div className="border-t border-white/5 bg-[#0e0e0e] px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="font-mono text-[8px] tracking-widest text-white/30">
                    STAGE PREPARATIONS ACTIVE // SEE YOU AT THE EVENT
                  </span>
                  <button 
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="w-full sm:w-auto px-5 py-2 bg-white/[0.04] hover:bg-white/10 text-white font-mono text-[10px] tracking-widest uppercase transition-colors rounded cursor-pointer text-center border border-white/5"
                  >
                    Close Telemetry
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
