import { Mail, Linkedin, Instagram, MapPin, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Agenda', href: '#schedule' },
  { label: 'Activities', href: '#activities' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Tickets', href: '#tickets' },
  { label: 'Team', href: '/team' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Refer & Win', href: '/refertowin' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Badge', href: '/badge' },
  { label: 'Code of Conduct', href: '/codeofconduct' },
];

export const FooterSection = () => {
  return (
    <footer className="relative bg-[#050505] overflow-hidden flex flex-col p-4 sm:px-12 lg:px-24 gap-8 sm:gap-12 z-10 border-t border-white/5 py-10 sm:py-16">
      {/* Quick nav links */}
      <div className="flex flex-wrap gap-4 sm:gap-6 border-b border-white/5 pb-6 sm:pb-8">
        {quickLinks.map((link) => (
          link.href.startsWith('/') ? (
            <Link 
              key={link.label} 
              to={link.href} 
              className="font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-colors text-white/40 hover:text-aws-orange"
            >
              {link.label}
            </Link>
          ) : (
            <a 
              key={link.label} 
              href={link.href} 
              className="font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-colors text-white/40 hover:text-aws-orange"
            >
              {link.label}
            </a>
          )
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-8 sm:gap-12 justify-between">
         
         <div className="flex flex-col max-w-sm">
           <div className="text-white font-sans font-black italic text-2xl sm:text-4xl mb-2 uppercase tracking-tighter">AWS SCD<br/>KOLHAPUR 2026.</div>
           <div className="text-white/60 text-xs sm:text-sm font-sans mb-6 sm:mb-8">Powering the next generation of cloud innovators. Organized by AWS Student Builder Group Kolhapur.</div>
           <div className="flex items-start gap-2 text-white/50 font-mono text-[10px] sm:text-xs mb-4">
             <MapPin size={14} className="text-aws-orange shrink-0 mt-0.5" />
             <span>V.T. Patil Convention Hall, Tararani High School Compound, Poorvarang, Mahalaxminagar, Rajarampuri, Kolhapur, Maharashtra 416008</span>
           </div>
           <a href="mailto:awssbggcoek@gmail.com" className="inline-flex max-w-max items-center font-mono text-[10px] sm:text-xs text-aws-orange hover:text-white transition-colors mb-2 uppercase tracking-widest gap-2 break-all">
             <Mail size={14} className="shrink-0" /> awssbggcoek@gmail.com
           </a>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {/* Support Helpline */}
            <div className="flex flex-col">
               <span className="font-sans font-black italic text-base sm:text-lg uppercase text-white mb-3 sm:mb-4 flex items-center gap-2">
                 <PhoneCall size={16} className="text-aws-orange shrink-0" /> Support Helpline
               </span>
               <div className="flex flex-col gap-3 font-mono text-[10px] sm:text-xs">
                  <div>
                    <span className="text-aws-orange font-bold uppercase tracking-wider block mb-1">Tech Team Support</span>
                    <a href="tel:+918160578261" className="text-white/80 hover:text-white transition-colors block">
                      Yash Nawal: <span className="text-white font-semibold">+91 81605 78261</span>
                    </a>
                    <a href="tel:+917028388155" className="text-white/80 hover:text-white transition-colors block mt-1">
                      Anas Pathan: <span className="text-white font-semibold">+91 70283 88155</span>
                    </a>
                  </div>
                  <div className="pt-1">
                    <span className="text-f1-red font-bold uppercase tracking-wider block mb-1">Payment Issues</span>
                    <a href="tel:+917020926643" className="text-white/80 hover:text-white transition-colors block">
                      Bhushan Jadhav: <span className="text-white font-semibold">+91 70209 26643</span>
                    </a>
                  </div>
               </div>
            </div>

            {/* Leadership Contact */}
            <div className="flex flex-col">
               <span className="font-sans font-black italic text-base sm:text-lg uppercase text-white mb-3 sm:mb-4">Leadership Contact</span>
               <ul className="flex flex-col gap-3 font-mono text-[10px] sm:text-xs opacity-70 uppercase tracking-wider sm:tracking-widest">
                  <li>Shardul Kolekar<br/><span className="text-[#FF9900]">President // Captain</span></li>
                  <li>Apeksha Khodave<br/><span className="text-[#FF9900]">Vice President</span></li>
                  <li>Bhushan Jadhav<br/><span className="text-[#FF9900]">Treasurer</span></li>
               </ul>
            </div>
            
            {/* Community Socials */}
            <div className="flex flex-col">
               <span className="font-sans font-black italic text-base sm:text-lg uppercase text-white mb-3 sm:mb-4">Community Socials</span>
               <ul className="flex flex-col gap-3 font-mono text-[10px] sm:text-xs opacity-70 uppercase tracking-wider sm:tracking-widest">
                  <li><a href="https://www.linkedin.com/company/aws-cloud-club-gcoe-kolhapur/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#0a66c2] transition-colors"><Linkedin size={14} /> LinkedIn</a></li>
                  <li><a href="https://www.instagram.com/aws.sbg.gcoe.kolhapur/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#e1306c] transition-colors"><Instagram size={14} /> Instagram</a></li>
                  <li><a href="https://www.meetup.com/aws-sbg-at-government-college-of-engineering-kolhapur" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#e0393e] transition-colors"><span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-xs">M</span> Meetup</a></li>
               </ul>
            </div>
         </div>
      </div>

      <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
         <span className="font-mono text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest text-center md:text-left">© 2026 AWS Student Community Day Kolhapur. All rights reserved.</span>
         <div className="flex text-[9px] sm:text-[10px] tracking-widest font-mono text-gray-500 uppercase space-x-4">
            <span className="text-[#00ff00]">STATUS: ACTIVE // LIVE</span>
         </div>
      </div>
    </footer>
  );
};
