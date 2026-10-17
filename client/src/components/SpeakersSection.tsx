import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeader } from './LayoutElements';
import { User, X, Terminal, Sparkles } from 'lucide-react';

interface Speaker {
  id: number;
  name: string;
  image: string;
  designation: string;
  role: string;
  sessionType: string;
  sessionTitle: string;
  topic: string;
  shortDescription: string;
  category: string;
  featured: boolean;
}

const DEFAULT_SPEAKERS: Speaker[] = [
  {
    "id": 1,
    "name": "Jessica Gilmore",
    "image": "jessica-gilmore.jpg",
    "designation": "Manager, Community Groups @ Amazon",
    "role": "AWS Global Community Leader | Keynote Speaker",
    "sessionType": "AWS Keynote",
    "sessionTitle": "Empowering Global Builders & Community Growth",
    "topic": "AWS Community, Builder Growth, Cloud Ecosystem",
    "shortDescription": "Discover how AWS empowers student builders, community-led initiatives, and cloud innovation worldwide, sharing career insights and leadership strategies for the next generation of builders.",
    "category": "AWS Keynote",
    "featured": true
  },
  {
    "id": 2,
    "name": "Bhaskar Pathak",
    "image": "1783840884280.png",
    "designation": "Senior Solutions Architect at AWS",
    "role": "AWS Solutions Architect",
    "sessionType": "Community Keynote",
    "sessionTitle": "Community Growth, Career Opportunities & AWS Certifications",
    "topic": "AWS Community, Career Growth, Certifications",
    "shortDescription": "Explore how active community participation, continuous learning, and AWS certifications can accelerate your cloud career while creating meaningful impact within the AWS ecosystem.",
    "category": "Community Keynote",
    "featured": true
  },
  {
    "id": 3,
    "name": "Pushkar Thakur",
    "image": "1667990794682.jpeg",
    "designation": "SDE II @ Procedure",
    "role": "Co-Organizer, AWS User Group Nashik | AWS Community Builder",
    "sessionType": "Technical Keynote",
    "sessionTitle": "Building Modern Applications on AWS",
    "topic": "AWS Cloud, Containers, Serverless, Databases, AI & Career Opportunities",
    "shortDescription": "Explore modern AWS application architectures using containers, serverless, managed databases, and AI services while gaining insights into cloud career opportunities.",
    "category": "Keynote Speaker",
    "featured": true
  },
  {
    "id": 4,
    "name": "Ameya Vaidya",
    "image": "1780647595003.png",
    "designation": "Trainer & Tech Speaker",
    "role": "AWS Community Builder | AWS User Group Pune Leader",
    "sessionType": "Technical Session",
    "sessionTitle": "AWS Storage & Databases Deep Dive",
    "topic": "Amazon S3, Amazon RDS, Amazon DynamoDB",
    "shortDescription": "Learn how AWS storage and database services power scalable, reliable, and cost-effective cloud applications.",
    "category": "Cloud Architect",
    "featured": false
  },
  {
    "id": 5,
    "name": "Nilesh Vaghela",
    "image": "1714482688164.jpeg",
    "designation": "CEO, ElectroMech & CloudKida",
    "role": "AWS Community Hero | AWS User Group Ahmedabad Leader | Former AAI & RHCI",
    "sessionType": "Technical Session",
    "sessionTitle": "DevOps on AWS",
    "topic": "CI/CD, Infrastructure as Code, Automation",
    "shortDescription": "Discover modern DevOps practices using AWS services, CI/CD pipelines, Infrastructure as Code, and automation.",
    "category": "DevOps Leader",
    "featured": false
  },
  {
    "id": 6,
    "name": "Dimple Vaghela",
    "image": "1746945573251.jpeg",
    "designation": "Director, ElectroMech Cloudtech Pvt. Ltd.",
    "role": "AWS Community Hero | AWS User Group Leader",
    "sessionType": "Technical Session & Women in Tech Panel",
    "sessionTitle": "DevOps on AWS & Tech Leadership",
    "topic": "CI/CD, Infrastructure as Code, Leadership",
    "shortDescription": "Explore modern DevOps practices on AWS, including CI/CD pipelines, Infrastructure as Code, and automation, followed by insights on leadership and community building during the Women in Tech Panel.",
    "category": "AWS Community Hero",
    "featured": false
  },
  {
    "id": 7,
    "name": "Abhijeet Chinchole",
    "image": "1726836394723.jpeg",
    "designation": "Platform & Product Engineering Leader",
    "role": "CTO, Cloudlytics by Blazeclan | AWS Community Builder",
    "sessionType": "Technical Session",
    "sessionTitle": "Generative AI with AWS",
    "topic": "Amazon Bedrock, Kiro",
    "shortDescription": "Learn how to build enterprise-ready AI applications using Amazon Bedrock and Kiro through practical use cases and modern development workflows.",
    "category": "AI Specialist",
    "featured": false
  },
  {
    "id": 8,
    "name": "Abhishek Maurya",
    "image": "1701733317510.jpeg",
    "designation": "Senior Cloud Engineer at Orange Business India",
    "role": "AWS Community Builder | CKA",
    "sessionType": "Technical Session",
    "sessionTitle": "Cloud Security on AWS",
    "topic": "IAM, AWS WAF, GuardDuty, Security Best Practices",
    "shortDescription": "Learn AWS security fundamentals and best practices for securing cloud workloads using AWS native security services.",
    "category": "Security Expert",
    "featured": false
  },
  {
    "id": 9,
    "name": "Vipul Chaudhary",
    "image": "1764430670931.jpeg",
    "designation": "Site Reliability Engineer @ Intangles",
    "role": "Site Reliability Engineer",
    "sessionType": "Technical Session",
    "sessionTitle": "AWS Compute Services",
    "topic": "EC2, Lambda, ECS, EKS",
    "shortDescription": "Gain practical insights into Amazon EC2, AWS Lambda, Amazon ECS, and Amazon EKS, and learn how these services work together to power modern cloud applications at scale.",
    "category": "Cloud Architect",
    "featured": false
  },
  {
    "id": 10,
    "name": "Afreen Bano",
    "image": "1724876847469.jpeg",
    "designation": "Cloud Engineer & Strategic Technologist",
    "role": "Lead, Women in Tech - India",
    "sessionType": "Women in Tech Panel",
    "sessionTitle": "Women in Tech & Cloud Leadership",
    "topic": "Cloud Careers, Diversity, Tech Leadership",
    "shortDescription": "Join an engaging discussion featuring accomplished women leaders sharing their experiences, career journeys, leadership insights, and perspectives on building an inclusive technology ecosystem.",
    "category": "Panelist",
    "featured": false
  },
  {
    "id": 11,
    "name": "Anjali Mishra",
    "image": "1764430660887.png",
    "designation": "DevOps Engineer at VirtueCloud",
    "role": "DevOps Engineer",
    "sessionType": "Women in Tech Panel",
    "sessionTitle": "Women in Tech & Cloud Engineering",
    "topic": "DevOps, Cloud Infrastructure, Career Growth",
    "shortDescription": "Join an engaging discussion featuring accomplished women leaders sharing their experiences, career journeys, leadership insights, and perspectives on building an inclusive technology ecosystem.",
    "category": "Panelist",
    "featured": false
  },
  {
    "id": 12,
    "name": "Sanika Kotgire",
    "image": "1744946870635.jpeg",
    "designation": "Cloud Data Engineer @ ZS",
    "role": "AWS Community Builder",
    "sessionType": "Women in Tech Panel",
    "sessionTitle": "Women in Tech & Cloud Data Engineering",
    "topic": "Cloud Data, Big Data, Community Mentorship",
    "shortDescription": "Join an inspiring panel discussion featuring women leaders in technology as they share their career journeys, leadership experiences, and insights on building a successful career in cloud and tech.",
    "category": "Panelist",
    "featured": false
  }
];

const SECTOR_TAGS = ["SECTOR-A1", "SECTOR-B2", "SECTOR-C3", "SECTOR-D4", "SECTOR-E5"];

export const SpeakersSection = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>(DEFAULT_SPEAKERS);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [loading, setLoading] = useState(false);

  /* eslint-disable-next-line react-doctor/no-fetch-in-effect */
  useEffect(() => {
    fetch('/Speakers/details.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch speaker details: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setSpeakers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching speakers details:', err);
        setLoading(false);
      });
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedSpeaker) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSpeaker]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSpeaker(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="speakers" className="relative py-20 sm:py-28 px-4 sm:px-12 lg:px-24 bg-[#050505] overflow-hidden" aria-label="Speakers lineup">
      {/* Decorative track line behind speakers */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-y-1/2 pointer-events-none"></div>

      {/* Header */}
      <div className="mb-12">
        <SectionHeader 
          title="Speakers" 
          subtitle="Meet our world-class lineup of AWS Heroes, cloud architects, community pioneers, and industry leaders taking the stage at AWS Community Day." 
          sysId="02.SPK" 
        />
      </div>

      {/* Speaker Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-10 max-w-7xl mx-auto relative z-10">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-[#0d0d0d] min-h-[300px] sm:min-h-[400px] rounded-xl border border-white/5" />
          ))
        ) : (
          speakers.map((speaker, i) => (
            <motion.div
              key={speaker.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative cursor-pointer h-full"
              onClick={() => setSelectedSpeaker(speaker)}
            >
              {/* Card Body */}
              <div className="relative bg-[#0d0d0d] border border-white/5 h-full overflow-hidden flex flex-col justify-start p-4 sm:p-6 transition-all duration-500 hover:border-aws-orange/40 hover:shadow-[0_0_30px_rgba(255,153,0,0.1)] rounded-xl">
                
                {/* Background gradient that shifts on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF9900]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Top - Grid Position */}
                <div className="relative z-10 flex justify-between items-center font-mono text-[7px] sm:text-[9px] text-white/30 uppercase tracking-widest">
                  <span>Staging Grid // 0{speaker.id}</span>
                  <span className="font-bold text-aws-orange/60 group-hover:text-aws-orange transition-colors">
                    {SECTOR_TAGS[(speaker.id - 1) % SECTOR_TAGS.length]}
                  </span>
                </div>

                {/* Center - Tech Scanner Avatar HUD */}
                <div className="relative z-10 flex-1 flex items-center justify-center my-4 sm:my-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-white/10 flex items-center justify-center relative bg-white/[0.01] shrink-0">
                    {/* Rotating dashed borders */}
                    <div className="absolute inset-[-4px] rounded-full border border-transparent border-t-aws-orange/40 group-hover:animate-[spin_6s_linear_infinite]" />
                    <div className="absolute inset-[-8px] rounded-full border border-transparent border-b-f1-red/30 group-hover:animate-[spin_4s_linear_reverse_infinite]" />
                    
                    {/* Speaker Image with fallback */}
                    <div className="w-full h-full rounded-full overflow-hidden border border-white/5 relative bg-[#050505]">
                      {speaker.image ? (
                        <img 
                          src={`/Speakers/${speaker.image}`} 
                          alt={speaker.name} 
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.fallback-icon');
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <User className="fallback-icon absolute inset-0 m-auto text-white/10 group-hover:text-aws-orange group-hover:scale-105 transition-all duration-500 w-5 h-5 sm:w-9 sm:h-9 hidden" />
                    </div>
                  </div>
                </div>

                {/* Bottom - Info */}
                <div className="relative z-10 border-t border-white/5 pt-3 sm:pt-4 text-left mt-auto flex flex-col justify-start">
                  <h3 className="font-sans font-black italic text-sm sm:text-xl uppercase tracking-tighter text-white/80 group-hover:text-white transition-colors break-words">
                    {speaker.name}
                  </h3>
                  <p className="font-mono text-[8px] sm:text-xs text-white/50 tracking-wider mt-1 flex items-start gap-1.5 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-aws-orange animate-pulse shrink-0 mt-[0.3rem]" />
                    <span className="break-words leading-tight">{speaker.designation}</span>
                  </p>

                  {/* AWS Community Roles / Titles */}
                  <div className="flex flex-wrap gap-1.5 mt-2 sm:mt-3">
                    {speaker.role.split('|').map((part, idx) => {
                      const text = part.trim();
                      const isAWS = text.toLowerCase().includes('aws') || 
                                    text.toLowerCase().includes('community') || 
                                    text.toLowerCase().includes('hero') || 
                                    text.toLowerCase().includes('builder') || 
                                    text.toLowerCase().includes('lead') || 
                                    text.toLowerCase().includes('organizer') || 
                                    text.toLowerCase().includes('cto');
                      if (!isAWS) return null;
                      return (
                        <span 
                          key={idx} 
                          className="text-[6.5px] sm:text-[9.5px] font-mono px-1.5 sm:px-2 py-0.5 sm:py-1 bg-aws-orange/10 border border-aws-orange/20 text-aws-orange rounded uppercase font-bold tracking-wider"
                        >
                          {text}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Scanning laser line effect */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-aws-orange opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_#FF9900]"></div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Telemetry Detail Modal */}
      {createPortal(
        <AnimatePresence>
          {selectedSpeaker && (
            <div 
              className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 md:p-10"
              role="dialog" aria-label="Modal" /* eslint-disable-next-line react-doctor/prefer-html-dialog, react-doctor/prefer-tag-over-role */
              aria-modal="true"
            >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSpeaker(null)}
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
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-40"></div>

              {/* Top Cyber HUD Bar */}
              <div className="relative border-b border-white/5 bg-[#0e0e0e] px-6 py-3 flex justify-between items-center text-[10px] font-mono tracking-widest text-white/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-aws-orange animate-ping" />
                  <span className="text-aws-orange font-bold">SPEAKER TELEMETRY // {selectedSpeaker.id}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline">SECTOR: {selectedSpeaker.category.toUpperCase()}</span>
                  <button type="button" 
                    onClick={() => setSelectedSpeaker(null)}
                    className="p-1 hover:text-white text-white/50 transition-colors border border-white/5 hover:border-aws-orange/30 rounded bg-white/[0.02] cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Image & Tech HUD */}
                  <div className="md:col-span-4 flex flex-col items-center">
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 bg-gradient-to-tr from-f1-red/20 via-transparent to-aws-orange/20 border border-white/5">
                      {/* Concentric rotating design lines */}
                      <div className="absolute inset-0 rounded-full border border-dashed border-aws-orange/30 animate-[spin_12s_linear_infinite]" />
                      <div className="absolute inset-1 rounded-full border border-dashed border-f1-red/25 animate-[spin_8s_linear_reverse_infinite]" />
                      
                      <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-aws-orange/40 shadow-[0_0_20px_rgba(255,153,0,0.15)] bg-[#050505]">
                        <img 
                          src={`/Speakers/${selectedSpeaker.image}`} 
                          alt={selectedSpeaker.name} 
                          className="w-full h-full object-cover"
                        />
                        {/* Laser line scanner animation */}
                        <div className="absolute inset-0 w-full h-[2px] bg-aws-orange shadow-[0_0_8px_#FF9900] animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
                      </div>
                    </div>

                    {/* Quick Telemetry Stats */}
                    <div className="w-full mt-6 bg-white/[0.02] border border-white/5 rounded-lg p-3 font-mono text-[9px] text-white/40 flex flex-col gap-1.5">
                      <div className="flex justify-between">
                        <span>CONNECTION:</span>
                        <span className="text-emerald-400 font-semibold">STABLE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>STREAM RATE:</span>
                        <span className="text-white/70">100% // LIVE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CATEGORY:</span>
                        <span className="text-aws-orange font-semibold">{selectedSpeaker.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Information */}
                  <div className="md:col-span-8 flex flex-col text-left">
                    <div className="mb-4">
                      <span className="text-[10px] font-mono tracking-widest text-aws-orange uppercase bg-aws-orange/10 border border-aws-orange/20 px-2 py-0.5 rounded">
                        {selectedSpeaker.category}
                      </span>
                    </div>

                    <h2 className="font-sans font-black italic text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white leading-none mb-2">
                      {selectedSpeaker.name}
                    </h2>

                    <div className="font-mono text-xs text-white/80 font-bold mb-4 flex items-center gap-1.5">
                      <Terminal size={12} className="text-aws-orange" />
                      {selectedSpeaker.designation}
                    </div>

                    <p className="text-white/60 text-sm leading-relaxed mb-6 font-sans">
                      {selectedSpeaker.role}
                    </p>

                    {/* Session Box */}
                    <div className="bg-[#121212] border border-white/5 rounded-xl p-4 sm:p-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-aws-orange/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-white/30 mb-2 flex items-center gap-1.5">
                        <Sparkles size={10} className="text-aws-orange" /> Session Parameters
                      </div>
                      
                      <span className="text-[9px] font-mono tracking-wider text-aws-orange border border-aws-orange/30 bg-aws-orange/5 px-2 py-0.5 rounded uppercase inline-block mb-2">
                        {selectedSpeaker.sessionType}
                      </span>

                      <h3 className="font-sans font-black italic text-lg sm:text-xl uppercase tracking-tight text-white mb-3">
                        {selectedSpeaker.sessionTitle}
                      </h3>

                      <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-sans">
                        {selectedSpeaker.shortDescription}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Cyber HUD Footer */}
              <div className="border-t border-white/5 bg-[#0e0e0e] px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="font-mono text-[8px] tracking-widest text-white/20">SYSTEMS ACTIVE // READY FOR FORMATION LAP</span>
                <button type="button"
                  onClick={() => setSelectedSpeaker(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-aws-orange text-black font-sans font-black italic uppercase text-[10px] tracking-widest skew-x-[-12deg] hover:bg-white hover:text-black transition-all shadow-[0_0_15px_rgba(255,153,0,0.2)] cursor-pointer text-center"
                >
                  <span className="skew-x-[12deg] block">Close Telemetry</span>
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
