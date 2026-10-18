import React, { useState, useEffect } from 'react';
import { Linkedin, Mail, Users, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export interface TeamMember {
  department: string;
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: string;
  email: string;
  linkedin: string;
  image: string;
}

export const ALL_TEAM_MEMBERS: TeamMember[] = [
  // Leadership Dept
  {
    department: "Leadership Dept",
    id: "shardul-kolekar",
    name: "Shardul Kolekar",
    role: "Captain (President)",
    bio: "Leading the AWS Student Builder Group with a vision to build a strong cloud computing community at GCOEK. Passionate about serverless architectures and cloud-native development.",
    skills: "AWS, Leadership, Cloud Architecture, Serverless, React, Node.js",
    email: "kolekarshardul23@gmail.com",
    linkedin: "https://www.linkedin.com/in/shardulkolekar",
    image: "https://i.ibb.co/YBzRTFVx/Chat-GPT-Image-Sep-4-2026-12-34-54-PM.png"
  },
  {
    department: "Leadership Dept",
    id: "apeksha",
    name: "Apeksha Khodave",
    role: "Vice President",
    bio: "Supporting the President in club leadership, coordinating activities, and helping drive the club's growth and initiatives.",
    skills: "Leadership, Event Coordination, Team Management",
    email: "apekshakhodave1106@gmail.com",
    linkedin: "https://www.linkedin.com/in/apeksha-khodave-9644b32b9?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    image: "https://i.ibb.co/tw7N7xCJ/Apeksha-Khodave.jpg"
  },
  {
    department: "Leadership Dept",
    id: "vidula",
    name: "Vidula Powar",
    role: "General Secretary",
    bio: "Managing club operations and ensuring smooth execution of all community activities and conferences.",
    skills: "Operations, Communication, Event Management",
    email: "powarvidula11@gmail.com",
    linkedin: "https://www.linkedin.com/in/vidula-p-372734294",
    image: "/team/vidula-powar.png"
  },
  {
    department: "Leadership Dept",
    id: "gopal",
    name: "Gopal Lakwal",
    role: "Joint Secretary",
    bio: "Supporting the General Secretary in daily club operations and logistics coordination.",
    skills: "Management, Coordination",
    email: "gopallakwal526@gmail.com",
    linkedin: "https://www.linkedin.com/in/gopal-lakwal-461467383",
    image: "https://i.ibb.co/4wBwTHtx/file-000000002ef871fab1e8c53a2708be68-Gopal-lakwal.png"
  },
  {
    department: "Leadership Dept",
    id: "shubham",
    name: "Shubham Sonwane",
    role: "Joint Secretary",
    bio: "Supporting the General Secretary in daily club operations and event planning.",
    skills: "Management, Coordination",
    email: "sonwaneshubham38@gmail.com",
    linkedin: "https://www.linkedin.com/in/shubham-sonwane-b9b056312",
    image: "https://i.ibb.co/LDDfM6hn/Gemini-Generated-Image-nbpxu8nbpxu8nbpx-Shubham-Sonwane.png"
  },

  // Technical Dept
  {
    department: "Technical Dept",
    id: "atharv-patil",
    name: "Atharv Patil",
    role: "Technical Lead",
    bio: "Assisting in the strategic direction and operations of the club, leading technical masterclasses.",
    skills: "Cloud Computing, Management, AWS",
    email: "atharvpatil1808@gmail.com",
    linkedin: "https://www.linkedin.com/in/atharvpatilw",
    image: "https://i.ibb.co/wZYNhv1R/Whats-App-Image-2026-04-18-at-1-54-07-PM.jpg"
  },
  {
    department: "Technical Dept",
    id: "Yash",
    name: "Yash Nawal",
    role: "Technical Associate",
    bio: "Passionate about cloud computing and eager to contribute to the club's technical initiatives and hands-on labs.",
    skills: "AWS, Python, Cloud Native",
    email: "yashsanjaynawal810@gmail.com",
    linkedin: "https://www.linkedin.com/in/yash-nawal-51b5a228b/",
    image: "https://i.ibb.co/gFrBmXJv/Whats-App-Image-2026-04-18-at-8-14-43-AM-2.jpg"
  },
  {
    department: "Technical Dept",
    id: "anas",
    name: "Anas Pathan",
    role: "Project Lead",
    bio: "Leading project development, coordinating the student builder team, and building scalable applications with modern cloud technologies.",
    skills: "AWS, Project Leadership, Cloud Development, Node.js, Docker",
    email: "pathananas2007@gmail.com",
    linkedin: "https://www.linkedin.com/in/anas-pathan-91a6b3368",
    image: "https://i.ibb.co/YBDxDXfV/Chat-GPT-Image-Sep-4-2026-12-44-21-AM.png"
  },
  {
    department: "Technical Dept",
    id: "diksha",
    name: "Diksha Remulkar",
    role: "Technical Associate",
    bio: "Passionate about cloud technologies and mentoring peers to learn cloud engineering.",
    skills: "AWS, Python, Cloud Native",
    email: "diksharemulkar@gmail.com",
    linkedin: "https://www.linkedin.com/in/diksha-remulkar-4b76a8338",
    image: "https://i.ibb.co/DfZngMw0/1773671193720-Diksha-Remulkar.png"
  },
  {
    department: "Technical Dept",
    id: "srushti",
    name: "Srushti Shinde",
    role: "Technical Associate",
    bio: "Exploring the depths of AWS services, serverless workflows, and building robust cloud solutions.",
    skills: "AWS, JavaScript, Serverless",
    email: "srushti4326@gmail.com",
    linkedin: "https://www.linkedin.com/in/srushti-shinde-692326338",
    image: "https://i.ibb.co/whnVPdBh/IMG-20260316-142303-Srushti-Shinde.png"
  },
  {
    department: "Technical Dept",
    id: "aditi",
    name: "Aditi",
    role: "Project Associate",
    bio: "Leading technical projects and guiding members in hands-on cloud development and architecture.",
    skills: "Project Management, AWS, React",
    email: "jadhavaditi8176@gmail.com",
    linkedin: "https://www.linkedin.com/in/aditi-jadhav-622843388",
    image: "https://i.ibb.co/DBRgNyb/aditi.jpg"
  },

  // Events & Operations Dept
  {
    department: "Events & Operations Dept",
    id: "punam",
    name: "Punam Age",
    role: "Event Coordinator",
    bio: "Organizing engaging and educational events, summits, and workshops for the regional community.",
    skills: "Event Planning, Public Speaking, Coordination",
    email: "punamage123@gmail.com",
    linkedin: "https://www.linkedin.com/in/punam-age-5219a52b6",
    image: "https://i.ibb.co/spsQqkZ3/Professional-passport-style-headshot-with-smile-1-Punam-age.png"
  },
  {
    department: "Events & Operations Dept",
    id: "chaitanya",
    name: "Chaitanya",
    role: "Logistics Lead",
    bio: "Ensuring all conference sessions and logistics run smoothly with meticulous execution.",
    skills: "Logistics, Management, Problem Solving",
    email: "chhaitanyaaz@gmail.com",
    linkedin: "https://www.linkedin.com/in/chhaitanyaa-zanjurne-84976a24",
    image: "https://i.ibb.co/KjLPBGnt/chaitanya.png"
  },
  {
    department: "Events & Operations Dept",
    id: "suhani",
    name: "Suhani Varma",
    role: "Event Coordination",
    bio: "Helping plan and execute high-energy club events, guest seminars, and speaker sessions.",
    skills: "Coordination, Teamwork",
    email: "suhanivarma33@gmail.com",
    linkedin: "https://www.linkedin.com/in/suhani-varma-09810a214",
    image: "https://i.ibb.co/7t7JXFhg/IMG-20260316-WA0011-Suhani-Varma.jpg"
  },
  {
    department: "Events & Operations Dept",
    id: "arya",
    name: "Arya Patil",
    role: "Event Coordination Associate",
    bio: "Assisting in stage and venue management, guest reception, and volunteer operations.",
    skills: "Coordination, Teamwork",
    email: "aryap010406@gmail.com",
    linkedin: "https://www.linkedin.com/in/arya-patil-4b85b73a5",
    image: "https://i.ibb.co/vCRQfL3T/IMG-20260316-WA0026-Arya-Patil-1.jpg"
  },
  {
    department: "Events & Operations Dept",
    id: "palak",
    name: "Kaya Vedi",
    role: "Event Coordination Associate",
    bio: "Helping to plan and execute club events with enthusiasm and operational precision.",
    skills: "Coordination, Teamwork",
    email: "kayavedi7@gmail.com",
    linkedin: "https://www.linkedin.com/in/palak-vedi-284821388",
    image: "https://i.ibb.co/DPczYCS5/Professional-headshot-with-warm-smile-Kaya-Vedi.png"
  },

  // Media & Content Dept
  {
    department: "Media & Content Dept",
    id: "shekhar",
    name: "Shekhar",
    role: "Social Media & Content Lead",
    bio: "Creating compelling digital narratives, promos, and managing our social media footprint.",
    skills: "Content Creation, Social Media, Writing",
    email: "varekarshekhar@gmail.com",
    linkedin: "https://www.linkedin.com/in/shekhar-varekar-530b97384",
    image: "https://i.ibb.co/HpV9qJwH/shekhar.jpg"
  },
  {
    department: "Media & Content Dept",
    id: "amruta",
    name: "Amruta Kole",
    role: "Social Media Associate",
    bio: "Assisting in content creation, design assets, and social media coverage during events.",
    skills: "Content Creation, Social Media, Graphic Design",
    email: "koleamruta836@gmail.com",
    linkedin: "https://www.linkedin.com/in/amruta-kole-907958388",
    image: "https://i.ibb.co/C5g4Mm7x/Whats-App-Image-2026-04-18-at-8-14-43-AM.jpg"
  },
  {
    department: "Media & Content Dept",
    id: "dhrupata",
    name: "Dhrupata Wankhede",
    role: "Design & Branding Lead",
    bio: "Designing visual graphics, conference branding, merchandise, and maintaining design identity.",
    skills: "Graphic Design, Figma, Branding",
    email: "dhrupatawankhede@gmail.com",
    linkedin: "https://www.linkedin.com/in/dhrupata-wankhede-b68b323a3",
    image: "https://i.ibb.co/9mS6qrPr/IMG-20260316-WA0033-Dhrupata-Wankhede.jpg"
  },
  {
    department: "Media & Content Dept",
    id: "vedika",
    name: "Vedika Desai",
    role: "Social Media Associate",
    bio: "Assisting in social media management, communications, and live coverage.",
    skills: "Social Media, Communication",
    email: "vedikad21@gmail.com",
    linkedin: "https://www.linkedin.com/in/vedika-desai-8095b732a",
    image: "https://i.ibb.co/qY73yh3F/Scanned-20260316-2043-Vedika-Desai.jpg"
  },
  {
    department: "Media & Content Dept",
    id: "aniket-mohite",
    name: "Aniket Mohite",
    role: "Design & Graphics Lead",
    bio: "Contributing to visual branding, stage graphics, digital posters, and marketing assets.",
    skills: "Design, Creativity, Branding",
    email: "mohiteaniket248@gmail.com",
    linkedin: "https://www.linkedin.com/in/aniket-mohite-7082b3289",
    image: "https://i.ibb.co/TBNp3tJm/Whats-App-Image-2026-04-12-at-6-27-55-PM.jpg"
  },

  // PR, Outreach & Corporate Dept
  {
    department: "PR, Outreach & Corporate Dept",
    id: "siddhi",
    name: "Siddhi",
    role: "PR Lead",
    bio: "Managing public relations, media reach, and inter-college community partnerships.",
    skills: "Public Relations, Networking, Communication",
    email: "siddhiagedkar22@gmail.com",
    linkedin: "https://www.linkedin.com/in/siddhi-agedkar-35b042385",
    image: "https://i.ibb.co/4RnZt8mK/IMG-20260316-WA0049-Shruti-Paul-41.jpg"
  },
  {
    department: "PR, Outreach & Corporate Dept",
    id: "renuka",
    name: "Renuka",
    role: "PR Lead",
    bio: "Connecting with corporate sponsors, student communities, and community partners across Maharashtra.",
    skills: "Public Relations, Networking, Communication",
    email: "renukabansode592@gmail.com",
    linkedin: "https://www.linkedin.com/in/renuka-bansode-674a4232a",
    image: "https://i.ibb.co/MkRr4m0Q/renuka.jpg"
  },

  // Finance & Marketing Dept
  {
    department: "Finance & Marketing Dept",
    id: "tushant",
    name: "Tushant Tagade",
    role: "Marketing Lead",
    bio: "Leading promotional campaigns, digital ads, and driving registrations across universities.",
    skills: "Marketing, Strategy, Analytics",
    email: "awssbggcoek@gmail.com",
    linkedin: "https://www.linkedin.com/in/tushant-tagade-06a210254",
    image: "https://i.ibb.co/zWbTwkBX/tushant-Tagade.jpg"
  },
  {
    department: "Finance & Marketing Dept",
    id: "Ankita",
    name: "Ankita Pujari",
    role: "Marketing Associate",
    bio: "Assisting in promotional marketing campaigns, campus activations, and community outreach.",
    skills: "Marketing, Analytics, Content Creation",
    email: "ankitapujari711@gmail.com",
    linkedin: "https://www.linkedin.com/in/ankita-pujari-821230398",
    image: "https://i.ibb.co/VcnZRZKS/Whats-App-Image-2026-04-18-at-9-02-28-PM.jpg"
  },
  {
    department: "Finance & Marketing Dept",
    id: "vaishnavi2",
    name: "Vaishnavi Kodag",
    role: "Marketing Associate",
    bio: "Driving the club's outreach, promoting events, and building a strong presence across the student community.",
    skills: "Marketing, Social Media, Communication",
    email: "kodagvaishnavi26@gmail.com",
    linkedin: "https://www.linkedin.com/in/vaishnavi-kodag-766010389?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    image: "https://i.ibb.co/rRW7fXjn/Whats-App-Image-2026-09-03-at-8-38-17-AM.jpg"
  },
  {
    department: "Finance & Marketing Dept",
    id: "bhushan-jadhav",
    name: "Bhushan Jadhav",
    role: "Treasurer",
    bio: "Managing club finances, ticket processing, budgeting, and financial integrity for community events.",
    skills: "Finance, Budgeting, Accounting",
    email: "aj6244249@gmail.com",
    linkedin: "https://www.linkedin.com/in/bhushan-jadhav-93b94630b?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    image: "https://i.ibb.co/4Ztn2gvb/Bhushan-png.png"
  },
  {
    department: "Finance & Marketing Dept",
    id: "vaishnavi",
    name: "Vaishnavi",
    role: "Treasurer Associate",
    bio: "Assisting in accounting, budget allocations, and transaction validations for community operations.",
    skills: "Finance, Budgeting, Accounting",
    email: "awssbggcoek@gmail.com",
    linkedin: "https://www.linkedin.com/in/vaishnavi-sawant-70845833b?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    image: "https://i.ibb.co/JRBSNVZL/Whats-App-Image-2026-04-12-at-11-02-42-PM.jpg"
  }
];

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(ALL_TEAM_MEMBERS);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

  useEffect(() => {
    // Optionally fetch dynamic CSV update if available
    fetch('/team-members.csv')
      .then(res => {
        if (!res.ok) throw new Error('CSV not found');
        return res.text();
      })
      .then(csvText => {
        const lines = csvText.trim().split('\n');
        if (lines.length > 1) {
          const members: TeamMember[] = lines.slice(1).map(line => {
            const values: string[] = [];
            let currentValue = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                values.push(currentValue.trim());
                currentValue = '';
              } else {
                currentValue += char;
              }
            }
            values.push(currentValue.trim());
            return {
              department: values[0] || '',
              id: values[1] || '',
              name: values[2] || '',
              role: values[3] || '',
              bio: values[4] || '',
              skills: values[5] || '',
              email: values[6] || '',
              linkedin: values[7] || '',
              image: values[8] || ''
            };
          });
          if (members.length > 0) setTeamMembers(members);
        }
      })
      .catch(() => {
        // Fallback to static ALL_TEAM_MEMBERS
      });
  }, []);

  const departments = [
    'All',
    'Leadership Dept',
    'Technical Dept',
    'Events & Operations Dept',
    'Media & Content Dept',
    'PR, Outreach & Corporate Dept',
    'Finance & Marketing Dept'
  ];

  const filteredMembers = selectedDepartment === 'All'
    ? teamMembers
    : teamMembers.filter(m => m.department === selectedDepartment);

  // Group by department when 'All' is selected
  const groupedDepartments = departments.slice(1).map(dept => ({
    name: dept,
    members: teamMembers.filter(m => m.department === dept)
  })).filter(g => g.members.length > 0);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-12 lg:px-24 bg-[#050505] text-white relative overflow-hidden" aria-label="Club Team Directory">
      {/* Background glow and subtle cyber grid */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-aws-orange/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header HUD */}
        <div className="mb-12 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/[0.03] border border-white/10 text-aws-orange font-mono text-[10px] tracking-widest uppercase mb-4">
            <Users size={12} />
            <span>AWS STUDENT BUILDER GROUP // DIRECTORY ({teamMembers.length} BUILDERS)</span>
          </div>

          <h2 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-black italic tracking-tight uppercase text-white leading-tight">
            Meet the Builders <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aws-orange via-amber-400 to-orange-500">
              Behind Kolhapur 2026
            </span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
            The passionate team of student organizers, cloud enthusiasts, guiding the largest 
            AWS student community summit in Kolhapur at V.T. Patil Convention Hall.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mb-12 flex flex-wrap gap-2 items-center">
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 uppercase tracking-widest mr-2">
            <Filter size={11} className="text-aws-orange" /> Filter:
          </span>
          {departments.map(dept => {
            const count = dept === 'All' ? teamMembers.length : teamMembers.filter(m => m.department === dept).length;
            const isSelected = selectedDepartment === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-mono uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? 'bg-aws-orange text-black border-aws-orange font-bold shadow-[0_0_20px_rgba(255,153,0,0.3)]'
                    : 'bg-[#0e0e0e] text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                <span>{dept}</span>
                <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[9px] ${isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-white/50'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Members Grid */}
        {selectedDepartment === 'All' ? (
          <div className="space-y-16">
            {groupedDepartments.map(group => (
              <div key={group.name} className="relative">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/5">
                  <div className="w-2 h-2 bg-aws-orange rounded-full" />
                  <h3 className="font-sans font-bold text-lg sm:text-xl uppercase tracking-wider text-white">
                    {group.name}
                  </h3>
                  <span className="font-mono text-xs text-white/40">
                    ({group.members.length} {group.members.length === 1 ? 'member' : 'members'})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {group.members.map(member => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  const [imgError, setImgError] = useState(false);
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-aws-orange/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,153,0,0.12)] flex flex-col"
    >
      {/* Photo with Overlay */}
      <div className="relative aspect-[4/4.2] bg-[#111] overflow-hidden">
        {!imgError && member.image ? (
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-black via-[#141414] to-aws-orange/10 text-white font-mono text-3xl font-black">
            {initials}
          </div>
        )}

        {/* Ambient Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />

        {/* Department tag top */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[9px] uppercase tracking-wider text-white/70">
            {member.department.replace(' Dept', '')}
          </span>
        </div>

        {/* Skills on hover overlay */}
        {member.skills && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
            <span className="font-mono text-[8px] text-aws-orange uppercase tracking-wider font-bold block mb-1">
              Skills:
            </span>
            <div className="flex flex-wrap gap-1">
              {member.skills.split(',').map((skill, sIdx) => (
                <span key={sIdx} className="px-1.5 py-0.5 bg-white/10 text-white text-[8px] font-mono rounded">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-left">
        <div>
          <span className="font-mono text-[10px] text-aws-orange font-bold uppercase tracking-widest block mb-0.5">
            {member.role}
          </span>
          <h4 className="font-sans text-lg font-bold text-white uppercase tracking-tight leading-tight mb-2">
            {member.name}
          </h4>
          <p className="text-white/50 text-xs leading-relaxed line-clamp-3 mb-4 font-sans">
            {member.bio}
          </p>
        </div>

        {/* Social Bar */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {member.linkedin && member.linkedin !== 'N/A' && member.linkedin !== '#' && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/50 hover:text-[#0a66c2] hover:border-[#0a66c2]/40 transition-colors"
                aria-label={`${member.name} LinkedIn`}
              >
                <Linkedin size={13} />
              </a>
            )}
            {member.email && member.email !== 'N/A' && (
              <a
                href={`mailto:${member.email}`}
                className="w-7 h-7 rounded bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/50 hover:text-aws-orange hover:border-aws-orange/40 transition-colors"
                aria-label={`Email ${member.name}`}
              >
                <Mail size={13} />
              </a>
            )}
          </div>

          <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">
            GCOEK // 2026
          </span>
        </div>
      </div>
    </motion.div>
  );
}
