// ─────────────────────────────────────────────────────────────
// activityConfig.ts
// Central configuration for all 5 activity scanners.
// Add a new activity here and it automatically appears everywhere.
// ─────────────────────────────────────────────────────────────

export type ActivitySlug =
  | 'human-tetris'
  | 'blindfold'
  | 'move-the-byte'
  | 'live-trivia'
  | 'food'
  | 'tea';

export interface ActivityConfig {
  slug: ActivitySlug;
  name: string;
  emoji: string;
  description: string;
  /** Tailwind-compatible color class prefixes — used to build themed UI */
  color: {
    primary: string;       // e.g. 'indigo'
    bg: string;            // e.g. 'bg-indigo-500/10'
    border: string;        // e.g. 'border-indigo-500/30'
    text: string;          // e.g. 'text-indigo-400'
    badge: string;         // e.g. 'bg-indigo-500 text-white'
    glow: string;          // e.g. 'shadow-indigo-500/20'
    activeBg: string;      // e.g. 'bg-indigo-500'
  };
}

export const ACTIVITIES: ActivityConfig[] = [
  {
    slug: 'human-tetris',
    name: 'Human Tetris',
    emoji: '🧩',
    description: 'Fit through the foam walls!',
    color: {
      primary: 'indigo',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      text: 'text-indigo-400',
      badge: 'bg-indigo-500 text-white',
      glow: 'shadow-indigo-500/20',
      activeBg: 'bg-indigo-500',
    },
  },
  {
    slug: 'blindfold',
    name: 'Blindfold',
    emoji: '🙈',
    description: 'Navigate without sight!',
    color: {
      primary: 'purple',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      badge: 'bg-purple-500 text-white',
      glow: 'shadow-purple-500/20',
      activeBg: 'bg-purple-500',
    },
  },
  {
    slug: 'move-the-byte',
    name: 'AWS: Balance the Bytes',
    emoji: '⚖️',
    description: 'Balance the load & deliver the data!',
    color: {
      primary: 'amber',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      badge: 'bg-amber-500 text-slate-950',
      glow: 'shadow-amber-500/20',
      activeBg: 'bg-amber-500',
    },
  },
  {
    slug: 'live-trivia',
    name: 'Live Trivia',
    emoji: '🧠',
    description: 'Test your cloud knowledge!',
    color: {
      primary: 'emerald',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500 text-slate-950',
      glow: 'shadow-emerald-500/20',
      activeBg: 'bg-emerald-500',
    },
  },
  {
    slug: 'food',
    name: 'Food',
    emoji: '🍱',
    description: 'Collect your meal token!',
    color: {
      primary: 'rose',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      badge: 'bg-rose-500 text-white',
      glow: 'shadow-rose-500/20',
      activeBg: 'bg-rose-500',
    },
  },
  {
    slug: 'tea',
    name: 'TEA',
    emoji: '☕',
    description: 'Collect your tea & refreshments token!',
    color: {
      primary: 'orange',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      badge: 'bg-orange-500 text-white',
      glow: 'shadow-orange-500/20',
      activeBg: 'bg-orange-500',
    },
  },
];

export const ACTIVITY_MAP: Record<ActivitySlug, ActivityConfig> = Object.fromEntries(
  ACTIVITIES.map(a => [a.slug, a])
) as Record<ActivitySlug, ActivityConfig>;

export function getActivity(slug: string): ActivityConfig | undefined {
  return ACTIVITY_MAP[slug as ActivitySlug];
}
