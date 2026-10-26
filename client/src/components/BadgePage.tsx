import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Download,
  CheckCircle2,
  Image as ImageIcon,
  ChevronDown,
  Linkedin,
  Copy,
  Check,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Predefined 5 roles as requested
const ROLE_OPTIONS = [
  { value: "Attendee", label: "Attendee", ribbon: "I'M ATTENDING" },
  { value: "VIP", label: "VIP", ribbon: "VIP GUEST" },
  { value: "Speaker", label: "Speaker", ribbon: "I'M SPEAKING" },
  { value: "Organizer", label: "Organizer", ribbon: "I'M ORGANIZING" },
  { value: "Volunteer", label: "Volunteer", ribbon: "I'M VOLUNTEERING" },
] as const;

type RoleType = typeof ROLE_OPTIONS[number]["value"];

export const BadgePage = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<RoleType>("Attendee");
  const [image, setImage] = useState<string | null>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentCaption, setCurrentCaption] = useState("");
  const [hasCopiedCaption, setHasCopiedCaption] = useState(false);

  const getRoleRibbon = (selectedRole: RoleType) => {
    const found = ROLE_OPTIONS.find((r) => r.value === selectedRole);
    return found ? found.ribbon : "I'M ATTENDING";
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to generate high-resolution badge image
  const generateBadgeImage = async (): Promise<{ dataUrl: string; filename: string } | null> => {
    if (!badgeRef.current) return null;
    const { toPng } = await import("html-to-image");

    // Short delay to ensure DOM painting has completely settled
    await new Promise((resolve) => setTimeout(resolve, 150));

    let dataUrl: string;
    try {
      dataUrl = await toPng(badgeRef.current, {
        pixelRatio: 2,
        backgroundColor: "#050505",
        cacheBust: true,
      });
    } catch (err) {
      console.warn("Primary toPng failed, retrying with skipFonts fallback:", err);
      dataUrl = await toPng(badgeRef.current, {
        pixelRatio: 2,
        backgroundColor: "#050505",
        skipFonts: true,
      });
    }

    const safeName = (name.trim() || "Attendee").replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `SCD_Kolhapur_2026_Badge_${safeName}.png`;
    return { dataUrl, filename };
  };

  // Standard Download Badge
  const handleDownload = async () => {
    if (!name.trim()) {
      alert("Please enter your name before downloading your badge.");
      return;
    }
    if (!image) {
      alert("Please upload your photo before downloading your badge.");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateBadgeImage();
      if (!result) return;

      const link = document.createElement("a");
      link.download = result.filename;
      link.href = result.dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error("Error generating badge:", error);
      alert("Failed to download badge. Please ensure your photo is loaded and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Dynamic, natural, and professional LinkedIn caption generator
  const generateLinkedInCaption = (userName: string, userRole: RoleType) => {
    const eventName = "AWS Student Community Day Kolhapur 2026";
    const clubName = "AWS Cloud Club - GCOE Kolhapur";
    const eventHashtag = "#SCDKolhapur2026";
    const eventUrl = typeof window !== "undefined" ? window.location.origin : "https://awsscd2026.com";

    switch (userRole) {
      case "Speaker":
        return `🎤 Thrilled to announce that I'll be speaking at ${eventName}! 🚀

I'm honored to share my insights and experience with such an energetic community of students, developers, and cloud enthusiasts. Looking forward to engaging discussions, hands-on learning, and inspiring connections.

A huge shoutout to ${clubName} for organizing this premier cloud conference!

📅 Date: November 1st, 2026
📍 Location: Kolhapur
🌐 Join us: ${eventUrl}

#AWS #AWSSCDKolhapur #AWSCloudClubs #Speaker #CloudComputing #StudentCommunityDay #TechCommunity #Kolhapur ${eventHashtag}`;

      case "VIP":
        return `🌟 Honored to be part of ${eventName} as a VIP Guest! 🚀

Looking forward to witnessing the innovation, technical brilliance, and leadership of the next generation of cloud pioneers in Kolhapur.

Kudos to ${clubName} and the entire organizing team for curating such a high-impact gathering.

📅 Date: November 1st, 2026
📍 Location: Kolhapur
🌐 Event details: ${eventUrl}

#AWS #AWSSCDKolhapur #AWSCloudClubs #VIP #Leadership #Innovation #CloudComputing #StudentCommunityDay ${eventHashtag}`;

      case "Organizer":
        return `⚡ The countdown is on! As an Organizer for ${eventName}, I'm super proud of what our team has built! ☁️🔥

From deep-dive cloud architectures and interactive tech challenges to renowned keynote speakers, we're bringing together builders across Maharashtra for an unforgettable experience.

Proud to drive this vision alongside ${clubName}!

📅 Mark your calendars: November 1st, 2026
📍 Location: Kolhapur
🎟️ Grab your passes: ${eventUrl}

#AWS #AWSSCDKolhapur #AWSCloudClubs #Organizer #CommunityBuilders #CloudComputing #Technology ${eventHashtag}`;

      case "Volunteer":
        return `🙌 Proud to be part of the volunteer crew driving ${eventName}! ⚡

Working behind the scenes with ${clubName} to empower students and create a world-class technology conference is an incredible experience.

Can't wait to welcome all of you on November 1st in Kolhapur!

🌐 Learn more & register: ${eventUrl}

#AWS #AWSSCDKolhapur #AWSCloudClubs #Volunteers #StudentCommunityDay #CloudComputing #CommunityFirst ${eventHashtag}`;

      case "Attendee":
      default:
        return `🚀 Excited to announce that I'll be attending ${eventName}! ☁️

Looking forward to diving deep into cloud technologies, learning from industry experts, and networking with fellow passionate builders and students.

Proud to be part of this incredible community with ${clubName}!

Here is my official event badge. See you in Kolhapur on November 1st, 2026! 👇

🌐 Register & join me: ${eventUrl}

#AWS #AWSSCDKolhapur #AWSCloudClubs #Community #Technology #Networking #CloudComputing #StudentCommunityDay ${eventHashtag}`;
    }
  };

  // Seamless LinkedIn Sharing flow
  const handleLinkedInShare = async () => {
    if (!name.trim()) {
      alert("Please enter your name before sharing your badge.");
      return;
    }
    if (!image) {
      alert("Please upload your photo before sharing your badge.");
      return;
    }

    setIsSharing(true);
    try {
      const result = await generateBadgeImage();
      if (!result) throw new Error("Could not render badge");

      const caption = generateLinkedInCaption(name, role);
      setCurrentCaption(caption);

      // Copy caption to clipboard
      try {
        await navigator.clipboard.writeText(caption);
        setHasCopiedCaption(true);
      } catch {
        // clipboard permission fallback
      }

      // Check if mobile Web Share API can share the image file directly
      let sharedViaNative = false;
      try {
        const res = await fetch(result.dataUrl);
        const blob = await res.blob();
        const file = new File([blob], result.filename, { type: "image/png" });

        if (
          typeof navigator !== "undefined" &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          await navigator.share({
            title: `AWS Student Community Day Kolhapur 2026 - ${role} Badge`,
            text: caption,
            files: [file],
          });
          sharedViaNative = true;
        }
      } catch (shareErr: any) {
        if (shareErr.name === "AbortError") {
          // User closed share sheet intentionally
          return;
        }
        console.warn("Native file share unsupported or failed, falling back to download+URL:", shareErr);
      }

      // Desktop & Web fallback: automatically download badge + open LinkedIn composer
      if (!sharedViaNative) {
        // Download badge PNG automatically
        const link = document.createElement("a");
        link.download = result.filename;
        link.href = result.dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Open LinkedIn post composer in new tab with pre-filled text
        const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(caption)}`;
        window.open(linkedInUrl, "_blank", "noopener,noreferrer");

        // Display guidance modal
        setShowShareModal(true);
      }
    } catch (error: any) {
      console.error("Error preparing LinkedIn share:", error);
      alert("Failed to prepare badge for sharing. Please try downloading the badge directly.");
    } finally {
      setIsSharing(false);
    }
  };

  const copyCaptionToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCaption);
      setHasCopiedCaption(true);
      setTimeout(() => setHasCopiedCaption(false), 2500);
    } catch {
      alert("Failed to copy to clipboard. Please copy the caption manually.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-sans relative overflow-x-hidden">
      {/* Background aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-f1-red/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-aws-orange/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto mt-0 pt-0 px-4 sm:px-6 lg:px-8 py-4 md:py-8 flex-grow flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-2 md:mb-4 relative z-50">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-aws-orange transition-colors group cursor-pointer relative z-50"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-sm tracking-wider uppercase">
              Back to Home
            </span>
          </Link>
          <div className="hidden md:block">
            <span className="font-mono text-xs text-f1-red uppercase tracking-[0.2em] font-bold px-3 py-1 bg-f1-red/10 border border-f1-red/20 rounded-full">
              Participation Badge
            </span>
          </div>
        </header>

        <div className="mb-4 md:mb-6 flex flex-col lg:flex-row lg:justify-between">
          <div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white mb-2">
              Show you're{" "}
              <span className="text-aws-orange font-sans normal-case italic">
                in.
              </span>
            </h1>
            <p className="text-white/60 max-w-xl font-medium">
              Generate your personalized AWS Student Community Day Kolhapur 2026
              digital badge. Download and share it on your socials to let
              everyone know!
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          {/* Left Column: Badge Preview */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent">
              {/* Actual Badge Container for html-to-image */}
              <div
                ref={badgeRef}
                className="w-full max-w-[360px] h-[450px] aspect-[4/5] bg-[#0a0a0a] rounded-[24px] overflow-hidden relative shadow-2xl flex flex-col border-4 border-f1-red/80"
              >
                {/* Badge inner aesthetic layers */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute top-[70px] left-0 w-full h-[250px] z-0 mix-blend-overlay bg-gradient-to-b from-f1-red/30 to-transparent"></div>

                {/* Top Black Header for Logos */}
                <div className="absolute top-0 left-0 w-full h-[70px] bg-[#050505] z-30 flex justify-between items-center px-5 border-b border-white/10 shadow-md">
                  {/* Left Logo */}
                  <img
                    src="/scd-kolhapur-logo.png"
                    alt="SCD Kolhapur"
                    className="h-10 sm:h-11 w-auto max-w-[200px] object-contain"
                  />
                  {/* Right Logos - Single Line */}
                  <div className="flex items-center gap-2">
                    <img
                      src="/AWS_Builder.webp"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/AWS_Builder.png";
                      }}
                      alt="AWS Builder Kolhapur"
                      className="h-7 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* Photo Area - Full photo visible across all corners */}
                <div className="absolute top-[70px] left-0 right-0 bottom-0 z-10 flex items-center justify-center overflow-hidden p-1">
                  {image ? (
                    <img
                      src={image}
                      alt="User"
                      className="w-full h-full object-contain object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <ImageIcon
                        className="w-16 h-16 mb-16 text-white/20"
                        strokeWidth={1}
                      />
                    </div>
                  )}
                  {/* Subtle bottom gradient so photo remains bright and clear */}
                  <div className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none bg-gradient-to-t from-[#0a0a0a]/90 via-[#0a0a0a]/40 to-transparent" />
                </div>

                {/* Content Area - Bottom part */}
                <div className="relative z-20 mt-auto flex flex-col w-full h-[180px] justify-end pb-[20px]">
                  {/* Status/Badge Ribbon Label - Dynamic per selected role */}
                  <div className="px-6 mb-3">
                    <div className="inline-block bg-gradient-to-r from-aws-orange to-f1-red text-black font-mono text-[9px] font-black tracking-widest px-2.5 py-1 uppercase transform -skew-x-12 shadow-[0_0_15px_rgba(255,153,0,0.4)]">
                      {getRoleRibbon(role)}
                    </div>
                  </div>

                  <div className="px-6 mb-4 pb-4 flex-grow flex flex-col justify-end">
                    <h2 className="text-[32px] leading-[0.9] font-black text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] break-words w-full">
                      {name.trim() ? (
                        name.trim().split(" ").map((part, i) => (
                          <span key={i} className="block">
                            {part}
                          </span>
                        ))
                      ) : (
                        <>
                          <span className="block text-white/50">YOUR</span>
                          <span className="block text-white/50">NAME</span>
                        </>
                      )}
                    </h2>
                  </div>

                  {/* Stats / Event Info Row */}
                  <div className="w-[90%] mx-auto backdrop-blur-md bg-f1-red/90 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 flex justify-between items-center border border-white/20 shadow-[0_10px_20px_rgba(225,6,0,0.3)]">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-mono tracking-widest uppercase text-white/80">
                        Date
                      </span>
                      <span className="text-base sm:text-lg font-black text-white leading-none mt-1">
                        01 NOV
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-mono tracking-widest uppercase text-white/80">
                        Year
                      </span>
                      <span className="text-xl font-black text-white leading-none mt-1">
                        2026
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-mono tracking-widest uppercase text-white/80">
                        City
                      </span>
                      <span className="text-xs sm:text-sm font-black text-white leading-none mt-1 tracking-tight">
                        KOLHAPUR
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-mono tracking-widest uppercase text-white/80">
                        Role
                      </span>
                      <span className="text-xs sm:text-sm font-black text-white leading-none uppercase mt-1">
                        {role.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-1.5 border-t border-white/10 pt-2">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>Everything happens in your browser.</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>Your photo is never uploaded to any server.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-4 lg:space-y-5">
            {/* Step 1: Photo */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-aws-orange/20 border border-aws-orange flex items-center justify-center text-aws-orange font-bold font-mono text-sm shadow-[0_0_15px_rgba(255,153,0,0.3)]">
                1
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-0.5">
                  Select your photo
                </h3>
                <p className="text-sm text-white/50 mb-3">
                  A clear, face-forward photo works best.
                </p>
                <div className="relative">
                  <input
                    aria-label="input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Choose photo"
                  />
                  <button
                    type="button"
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 rounded-lg text-white font-medium transition-all focus:outline-none focus:ring-2 focus:ring-aws-orange w-max cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    {image ? "Change photo" : "Choose photo"}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Name */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-f1-red/20 border border-f1-red flex items-center justify-center text-f1-red font-bold font-mono text-sm shadow-[0_0_15px_rgba(225,6,0,0.3)]">
                2
              </div>
              <div className="flex flex-col flex-grow w-full max-w-md">
                <h3 className="text-lg font-bold text-white mb-0.5">
                  Add your name
                </h3>
                <p className="text-sm text-white/50 mb-3">
                  It'll appear prominently on your badge.
                </p>
                <input
                  aria-label="input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  maxLength={30}
                  className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-aws-orange focus:ring-1 focus:ring-aws-orange transition-all"
                />
              </div>
            </div>

            {/* Step 3: Role Dropdown (Predefined 5 roles) */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold font-mono text-sm">
                3
              </div>
              <div className="flex flex-col flex-grow w-full max-w-md">
                <h3 className="text-lg font-bold text-white mb-0.5">
                  Select your role
                </h3>
                <p className="text-sm text-white/50 mb-3">
                  Choose your role from the predefined options.
                </p>
                <div className="relative">
                  <select
                    aria-label="Select your role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as RoleType)}
                    className="w-full bg-[#111] border border-white/10 hover:border-white/30 rounded-lg px-4 py-3 pr-10 text-white font-medium focus:outline-none focus:border-aws-orange focus:ring-1 focus:ring-aws-orange transition-all cursor-pointer appearance-none text-sm sm:text-base"
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-[#111] text-white py-2"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-white/50 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Step 4: Download & LinkedIn Share */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold font-mono text-sm">
                4
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-0.5">
                  Download & share
                </h3>
                <p className="text-sm text-white/50 mb-3">
                  Share your badge on LinkedIn and tag{" "}
                  <strong className="text-white">#SCDKolhapur2026</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                  {/* Download Badge Button */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!image || !name.trim() || isGenerating || isSharing}
                    className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg font-bold uppercase tracking-wider text-xs sm:text-sm transition-all cursor-pointer ${
                      !image || !name.trim()
                        ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                        : "bg-aws-orange text-black hover:bg-aws-orange-dark hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,153,0,0.4)]"
                    }`}
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{isGenerating ? "Generating..." : "Download"}</span>
                  </button>

                  {/* Share on LinkedIn Button */}
                  <button
                    type="button"
                    onClick={handleLinkedInShare}
                    disabled={!image || !name.trim() || isGenerating || isSharing}
                    className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg font-bold uppercase tracking-wider text-xs sm:text-sm transition-all cursor-pointer ${
                      !image || !name.trim()
                        ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                        : "bg-[#0A66C2] hover:bg-[#004182] text-white hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(10,102,194,0.4)]"
                    }`}
                  >
                    {isSharing ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Linkedin className="w-4 h-4 fill-current" />
                    )}
                    <span>{isSharing ? "Preparing..." : "Share on LinkedIn"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn Sharing Guidance Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0f1117] border border-white/15 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative text-left"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141824]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white shadow-sm">
                    <Linkedin className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Ready to Share on LinkedIn!
                    </h3>
                    <p className="text-xs text-white/50">
                      Follow these quick steps to finish your post
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-white/40 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Status checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Badge downloaded</span>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Caption copied to clipboard</span>
                  </div>
                </div>

                {/* Clear instructions */}
                <div className="bg-[#181f2f] border border-[#23314f] rounded-xl p-3.5 text-xs text-slate-300 space-y-2">
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    On your opened LinkedIn tab:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>
                      Click the <strong className="text-white">Media (photo)</strong> icon in LinkedIn.
                    </li>
                    <li>
                      Select your downloaded badge from your Downloads folder.
                    </li>
                    <li>
                      Paste the caption (already copied to your clipboard, press <kbd className="bg-black/50 px-1 py-0.5 rounded border border-white/20 font-mono text-[10px]">Ctrl+V</kbd> or <kbd className="bg-black/50 px-1 py-0.5 rounded border border-white/20 font-mono text-[10px]">⌘+V</kbd>).
                    </li>
                    <li>Hit <strong className="text-white">Post</strong>!</li>
                  </ol>
                </div>

                {/* Caption Preview Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono text-white/50 uppercase tracking-wider">
                      Your Personalized Caption
                    </span>
                    <button
                      onClick={copyCaptionToClipboard}
                      className="text-xs text-aws-orange hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
                    >
                      {hasCopiedCaption ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy again</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-[#08090d] border border-white/10 rounded-xl p-3 max-h-36 overflow-y-auto font-mono text-xs text-white/80 whitespace-pre-wrap select-all">
                    {currentCaption}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#141824] border-t border-white/10 flex flex-col sm:flex-row gap-2 justify-end">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 font-medium text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Done
                </button>
                <a
                  href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(currentCaption)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open LinkedIn Again
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
