export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  desc: string;
  type: string;
  status: 'past' | 'upcoming';
  image: string;
  link?: string;
  highlights: string[];
  schedule?: { time: string; title: string; desc: string }[];
}

export const CLUB_EVENTS: ClubEvent[] = [
  {
    id: "chai-coffee-aws-2026",
    title: "Chai, Coffee & AWS — Annual Community Meet",
    date: "05 Sep 2026",
    time: "11:00 AM – 1:00 PM",
    location: "GCOE Kolhapur",
    desc: "Recognize the contributions of our core team and active members, welcome new members, and discuss our vision for the upcoming year. Connect with fellow builders, learn about upcoming opportunities, and contribute ideas for future initiatives.",
    type: "Meetup",
    status: "past",
    image: "https://secure.meetupstatic.com/photos/event/1/1/f/1/600_535984593.jpeg",
    link: "https://www.meetup.com/aws-sbg-at-government-college-of-engineering-kolhapur/events/316417643/",
    highlights: [
      "Year in Review — highlights, milestones & community growth",
      "Core Team Swag Distribution & Recognition",
      "Signup Challenge Winner Recognition",
      "New Member Introductions & community connection",
      "Future Roadmap — Hackathon 2026, AWS Community Day, Technical Workshops",
      "AWS Student Opportunities — Skill Builder, Educate & Certifications",
      "Fun Team-based AWS Quiz with goodies for winners",
      "Open Discussion, Q&A, Tea/Coffee & Networking"
    ],
    schedule: [
      { time: "11:00 AM", title: "Welcome & Opening Remarks", desc: "Kick-off by the organising team with a warm welcome to all attendees." },
      { time: "11:10 AM", title: "Year in Review", desc: "Highlights from the past year — achievements and milestones of AWS SBG at GCOEK." },
      { time: "11:25 AM", title: "Core Team Recognition", desc: "Swag distribution and special recognition for core team members." },
      { time: "11:40 AM", title: "New Member Introductions & Winners", desc: "Welcoming new builders and announcing winners of the Signup Challenge." },
      { time: "11:55 AM", title: "Future Roadmap & AWS Student Benefits", desc: "Discussion of upcoming events — Hackathon 2026, AWS Community Day, Skill Builder pathways." },
      { time: "12:15 PM", title: "Quiz & Interactive Activity", desc: "Team-based AWS quiz with exclusive goodies for winners." }
    ]
  },
  {
    id: "portfolio-website-workshop",
    title: "AI-Powered Portfolio Website Development Workshop",
    date: "09 Apr 2026",
    time: "10:00 AM – 2:00 PM",
    location: "E Computer Lab (GCOEK New Campus)",
    desc: "Hands-on session teaching students how to build a complete portfolio website from scratch using modern web technologies and AI developer tools, with GitHub setup and live deployment.",
    type: "Workshop",
    status: "past",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop",
    link: "https://forms.gle/VNaYij16gsK8fbjy7",
    highlights: [
      "Hands-on session — bring your laptop",
      "Build a complete portfolio website from scratch",
      "Learn HTML, CSS & JavaScript fundamentals",
      "AI tools for faster development",
      "GitHub setup & live deployment included",
      "No prior coding experience required",
      "Refreshments and participation certificates provided"
    ]
  },
  {
    id: "seminar-genai-deep-learning",
    title: "Seminar on Generative AI & Deep Learning",
    date: "13 Apr 2026",
    time: "2:00 PM – 4:00 PM",
    location: "Seminar Hall (Old Building), GCOE Kolhapur",
    desc: "Deep dive into Generative AI and deep learning architectures, covering GANs, VAEs, Transformers, and hands-on computer vision and NLP models.",
    type: "Seminar",
    status: "past",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=2070&auto=format&fit=crop",
    link: "https://www.meetup.com/aws-sbg-at-government-college-of-engineering-kolhapur/events/314246662/",
    highlights: [
      "Free entry — open to all engineering students",
      "Certificates provided to all participants",
      "Generative Deep Learning: Neural Style Transfer, VAE, GAN",
      "Deep Learning Models: MLP, LSTM, GRU, Transformer Networks",
      "Supervised Tasks: Image Denoising, Semantic Segmentation, Object Detection"
    ]
  },
  {
    id: "expert-lecture-cloud-aws",
    title: "Expert Lecture on Cloud Computing & AWS",
    date: "27 Mar 2026",
    time: "11:00 AM",
    location: "Seminar Hall, GCOE Kolhapur",
    desc: "The Amazon Web Services Cloud Club at GCOEK presented an expert session on Cloud Computing and AWS with Senior Developer Aditya Bhosale (10+ years industry experience).",
    type: "Expert Lecture",
    status: "past",
    image: "https://i.ibb.co/tM6WTD8D/Green-White-Minimalis-Webinar-Digital-Marketing-Expert-Instagram-Post-3.png",
    link: "https://www.meetup.com/aws-sbg-at-government-college-of-engineering-kolhapur/events/313939623/",
    highlights: [
      "Introduction to Cloud Computing fundamentals",
      "Overview of Amazon Web Services (AWS)",
      "Insights into real-world cloud applications",
      "Career opportunities in Cloud & DevOps",
      "Guidance from an experienced industry professional"
    ],
    schedule: [
      { time: "11:00 AM", title: "Speaker: Aditya Bhosale", desc: "Senior Software Developer – AWS & DevOps. With over 10 years of industry experience, sharing real-world use cases and career guidance in cloud computing." }
    ]
  },
  {
    id: "intro-meetup",
    title: "AWS Student Builder Group GCOEK: Intro Meetup",
    date: "19 Jan 2026",
    time: "3:00 PM",
    location: "Seminar Hall (Old Building)",
    desc: "Our inaugural in-person introductory meetup launching the AWS Student Builder Group at GCOEK focused on AWS Cloud, DevOps, and hands-on learning for all engineering branches.",
    type: "Meetup",
    status: "past",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    highlights: [
      "Introduction to the club’s vision, roadmap and goals",
      "Core team selection through interactive group activities",
      "Opportunity to learn, lead, and build leadership experience"
    ]
  }
];

export const CLUB_GALLERY_IMAGES = [
  "https://i.ibb.co/wh3WN4c8/highres-532347430.avif",
  "https://i.ibb.co/mC48zSdN/highres-532347431.avif",
  "https://i.ibb.co/sd6ZXFt4/highres-532347403-1.avif",
  "https://i.ibb.co/h1RwtVP4/highres-532347403.avif",
  "https://i.ibb.co/n8kj4dLH/highres-532347401.avif",
  "https://i.ibb.co/Mx9LRq1m/highres-532347400.avif",
  "https://i.ibb.co/7JqJhG3N/highres-532347399.avif",
  "https://i.ibb.co/r2PWsbBj/IMG-20260313-133159131-HDR-AE-2-jpg.jpg",
  "https://i.ibb.co/ZztxTXTj/Whats-App-Image-2026-09-04-at-7-49-19-PM.jpg",
  "https://i.ibb.co/1Gt9j8Nd/Whats-App-Image-2026-09-04-at-7-49-40-PM-1.jpg",
  "https://i.ibb.co/NdxvXsC8/Whats-App-Image-2026-09-04-at-7-49-40-PM.jpg",
  "https://i.ibb.co/84t7RpCz/Whats-App-Image-2026-09-04-at-7-49-41-PM.jpg"
];
