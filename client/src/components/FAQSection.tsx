import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionHeader } from './LayoutElements';
import { Plus, Minus, Mail, HelpCircle, PhoneCall } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const faqCategories = [
  {
    category: "BEFORE YOU REGISTER",
    items: [
      {
        question: "What exactly is AWS Student Community Day Kolhapur?",
        answer: "It's a tech event where students come together to explore AWS, cloud computing, and AI. Expect technical talks, hands-on workshops, career insights, live trivia, prizes, and opportunities to connect with speakers and fellow tech enthusiasts."
      },
      {
        question: "Who can attend the event?",
        answer: "Students from any college can register! Whether you're studying Computer Science, AI & Data Science, Electronics, or another branch, you're welcome to join and explore the world of cloud technology."
      },
      {
        question: "Do I need to know AWS before attending?",
        answer: "Not necessarily! If you're curious about cloud computing, AWS, or AI, this event is a great opportunity to start learning. Check the individual workshop details for any specific prerequisites."
      },
      {
        question: "Is the event free?",
        answer: "No, this is a paid event. Check the official registration page for the ticket price and payment instructions."
      },
      {
        question: "Are tickets refundable?",
        answer: "No. All ticket purchases are non-refundable."
      },
      {
        question: "Are seats limited?",
        answer: "Yes, seats are limited. Complete your registration early to avoid missing out. Your seat is subject to the event's registration and payment confirmation process."
      },
      {
        question: "Can I attend without registering?",
        answer: "No. Registration is mandatory to attend the event. Please register in advance and keep your confirmation details handy."
      }
    ]
  },
  {
    category: "WHAT YOU'LL EXPERIENCE",
    items: [
      {
        question: "What will I learn at SCD Kolhapur?",
        answer: "You'll explore AWS and cloud computing, discover how AI fits into modern technology, learn from technical speakers, and gain practical exposure through workshops."
      },
      {
        question: "Will there be hands-on workshops?",
        answer: "Yes! The planned agenda includes hands-on workshops where you can follow along with practical activities and explore concepts beyond the presentations."
      },
      {
        question: "Should I bring my laptop?",
        answer: "We recommend bringing your laptop so you can participate more comfortably in the hands-on workshops. Watch for any software or setup instructions shared before the event."
      },
      {
        question: "Will I get to interact with the speakers?",
        answer: "Yes! The event includes networking opportunities where you can connect with speakers, ask questions, exchange ideas, and learn from their experiences."
      },
      {
        question: "Will there be quizzes, prizes, and giveaways?",
        answer: "Absolutely! Live trivia, interactive challenges, prizes, and exclusive swag are part of the planned experience. Specific prize details and giveaway eligibility will be announced by the organizers."
      }
    ]
  },
  {
    category: "CERTIFICATES, FOOD & SWAG",
    items: [
      {
        question: "Will I receive a certificate?",
        answer: "Yes, certificates are planned for attendees. Follow the organizers' instructions regarding attendance and certificate distribution."
      },
      {
        question: "Will lunch be provided?",
        answer: "Yes! Lunch is included in the planned event experience, along with tea and high tea. Unlimited lunch is part of the event offering."
      },
      {
        question: "Will everyone receive exclusive AWS swag?",
        answer: "Exclusive swag is part of the event experience. However, the exact items and distribution rules may vary, so watch for official announcements before assuming every item is guaranteed to every attendee."
      },
      {
        question: "What is included in my paid registration?",
        answer: "The event experience includes access subject to your confirmed registration, planned sessions and workshops, lunch and refreshments, and event activities. Check the ticket details for the exact inclusions and any conditions."
      }
    ]
  },
  {
    category: "EVENT DAY ESSENTIALS",
    items: [
      {
        question: "When and where is the event?",
        answer: "The event is scheduled for 1 November 2026 at V.T. Patil Convention Hall, Tararani High School Compound, Poorvarang, Mahalaxminagar, Rajarampuri, Kolhapur, Maharashtra 416008. Check official announcements for any changes."
      },
      {
        question: "What time should I arrive?",
        answer: "Check-in is scheduled from 9:00 AM to 10:00 AM. Arrive early to complete registration and settle in before the opening ceremony."
      },
      {
        question: "What should I bring?",
        answer: "Bring your registration confirmation, your laptop if possible, and any ID required by the organizers. Keep an eye out for pre-event instructions."
      },
      {
        question: "What if I have a question about registration or payment?",
        answer: "For payment issues and UPI/UTR verification, contact Bhushan Jadhav directly at +91 70209 26643. For technical and website support, reach out to Yash Nawal at +91 81605 78261 or Anas Pathan at +91 70283 88155. You can also email the organizing team at awssbggcoek@gmail.com."
      },
      {
        question: "How can I reach the technical support team?",
        answer: "Our technical team is available to assist you. Contact Yash Nawal (+91 81605 78261) or Anas Pathan (+91 70283 88155) for any portal, form submission, or ticket pass queries."
      }
    ]
  }
];

export const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [openItem, setOpenItem] = useState<string | null>("What exactly is AWS Student Community Day Kolhapur?");

  // Flattened or filtered list based on active category
  const filteredCategories = activeCategory === "ALL" 
    ? faqCategories 
    : faqCategories.filter(c => c.category === activeCategory);

  return (
    <section id="faq" className="relative py-16 sm:py-24 px-4 sm:px-12 lg:px-24 bg-[#050505] border-t border-white/5">
      {/* Background Ambience */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-aws-orange/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeader 
          title="Frequently Asked Questions (FAQs)" 
          subtitle="AWS Student Community Day Kolhapur" 
          sysId="10.FAQ" 
        />

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 my-8 pt-2">
          <button
            type="button"
            onClick={() => setActiveCategory("ALL")}
            className={`px-3.5 py-1.5 rounded font-mono text-xs uppercase font-bold tracking-wider transition-all border ${
              activeCategory === "ALL"
                ? "bg-aws-orange text-black border-aws-orange shadow-[0_0_15px_rgba(255,153,0,0.3)]"
                : "bg-white/[0.02] text-white/60 border-white/10 hover:text-white hover:border-white/20"
            }`}
          >
            All Questions ({faqCategories.reduce((acc, cat) => acc + cat.items.length, 0)})
          </button>
          {faqCategories.map((cat) => (
            <button
              key={cat.category}
              type="button"
              onClick={() => setActiveCategory(cat.category)}
              className={`px-3.5 py-1.5 rounded font-mono text-xs uppercase font-bold tracking-wider transition-all border ${
                activeCategory === cat.category
                  ? "bg-aws-orange text-black border-aws-orange shadow-[0_0_15px_rgba(255,153,0,0.3)]"
                  : "bg-white/[0.02] text-white/60 border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion Groups */}
        <div className="flex flex-col gap-8">
          {filteredCategories.map((catGroup) => (
            <div key={catGroup.category} className="flex flex-col gap-3">
              {activeCategory === "ALL" && (
                <div className="flex items-center gap-3 pt-4 pb-2 border-b border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-aws-orange" />
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-aws-orange">
                    {catGroup.category}
                  </span>
                </div>
              )}

              {catGroup.items.map((faq, i) => {
                const isOpen = openItem === faq.question;

                return (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className="group"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenItem(isOpen ? null : faq.question)}
                      className={`w-full flex items-center justify-between p-4 sm:p-5 rounded-lg border text-left transition-all duration-300 ${
                        isOpen 
                          ? 'bg-[#111] border-aws-orange/50 shadow-[0_0_20px_rgba(255,153,0,0.08)]' 
                          : 'bg-[#0a0a0a] border-white/5 hover:border-white/20 hover:bg-[#111]'
                      }`}
                    >
                      <span className={`font-sans font-bold text-sm sm:text-base pr-4 transition-colors ${
                        isOpen ? 'text-white' : 'text-white/80 group-hover:text-white'
                      }`}>
                        {faq.question}
                      </span>
                      <span className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                        isOpen ? 'bg-aws-orange text-black' : 'bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white'
                      }`}>
                        {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 sm:p-5 mt-1 bg-[#111]/80 rounded-lg border border-white/5 text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Contact Us Box at bottom */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-white/[0.02] via-[#111] to-white/[0.02] border border-white/10 text-center relative overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-aws-orange/10 border border-aws-orange/30 flex items-center justify-center mx-auto mb-3 text-aws-orange">
            <HelpCircle size={18} />
          </div>
          <h4 className="font-sans font-black italic uppercase text-lg sm:text-xl text-white mb-1">
            Still Have Questions or Need Support?
          </h4>
          <p className="font-sans text-xs sm:text-sm text-white/60 max-w-md mx-auto mb-6">
            We're here to help! Reach out directly to our dedicated technical team or payment coordinator.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6 text-left">
            {/* Tech Team Support */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-col gap-2.5">
              <span className="font-mono text-[10px] text-aws-orange uppercase tracking-widest font-bold flex items-center gap-2">
                <PhoneCall size={12} /> Technical Team Support
              </span>
              <div className="flex flex-col gap-2 font-sans text-xs">
                <a href="tel:+918160578261" className="text-white/80 hover:text-white transition-colors flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="font-medium">Yash Nawal</span>
                  <span className="font-mono text-aws-orange font-bold">+91 81605 78261</span>
                </a>
                <a href="tel:+917028388155" className="text-white/80 hover:text-white transition-colors flex items-center justify-between">
                  <span className="font-medium">Anas Pathan</span>
                  <span className="font-mono text-aws-orange font-bold">+91 70283 88155</span>
                </a>
              </div>
            </div>

            {/* Payment Issues Support */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-col gap-2.5">
              <span className="font-mono text-[10px] text-f1-red uppercase tracking-widest font-bold flex items-center gap-2">
                <PhoneCall size={12} /> Payment Issues Support
              </span>
              <div className="flex flex-col gap-1.5 font-sans text-xs">
                <a href="tel:+917020926643" className="text-white/80 hover:text-white transition-colors flex items-center justify-between">
                  <span className="font-medium">Bhushan Jadhav</span>
                  <span className="font-mono text-f1-red font-bold">+91 70209 26643</span>
                </a>
                <span className="text-[10px] text-white/40 font-mono mt-2">UPI / UTR verification & payment query assistance</span>
              </div>
            </div>
          </div>

          <a
            href="mailto:awssbggcoek@gmail.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-white/5 border border-white/10 text-white font-sans font-bold text-xs uppercase tracking-wider hover:bg-aws-orange hover:text-black transition-all"
          >
            <Mail size={14} />
            <span>Email: awssbggcoek@gmail.com</span>
          </a>
        </div>

      </div>
    </section>
  );
};
