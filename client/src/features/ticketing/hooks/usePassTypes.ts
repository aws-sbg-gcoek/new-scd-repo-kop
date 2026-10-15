import { useState, useEffect } from 'react';
import { subscribeToTicketConfig, TicketSystemConfig, getTierEffectiveStatus } from '../../../utils/ticketConfig';

export interface PassType {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  capacity: number;
  sold: number;
  available: number;
  perks: string[];
  is_active: boolean;
  is_locked: boolean;
  sort_order: number;
  badge_color: string;
  label: string | null;
}

function mapConfigToPasses(config: TicketSystemConfig): PassType[] {
  const tiers = config.tiers;
  const result: PassType[] = [];

  if (tiers.super_early_bird) {
    const t = tiers.super_early_bird;
    const eff = getTierEffectiveStatus(t);
    result.push({
      id: 'super_early_bird',
      name: t.label || 'Super Early Bird',
      slug: 'SCD-SUPER-EARLY',
      description: t.tagline || 'Be Super, Be Early!',
      price: t.price || 149,
      capacity: 100,
      sold: eff.status === 'sold_out' ? 100 : Math.max(0, 100 - (t.remaining ?? 0)),
      available: eff.status === 'sold_out' ? 0 : (t.remaining ?? 0),
      perks: [
        'Full Day All-Track Conference Access',
        'Official Event Swag Kit & Badge',
        'Networking High Tea & Catered Lunch',
        'Verified Certificate of Participation',
        'Access to Keynotes & Hands-on Tech Demos'
      ],
      is_active: true,
      is_locked: eff.status === 'coming_soon',
      sort_order: 1,
      badge_color: '#3b82f6',
      label: eff.status === 'sold_out' ? 'SOLD OUT' : (t.highlightBadge || 'SUPER SAVER')
    });
  }

  if (tiers.early_bird) {
    const t = tiers.early_bird;
    const eff = getTierEffectiveStatus(t);
    result.push({
      id: 'early_bird',
      name: t.label || 'Early Bird Ticket',
      slug: 'SCD-EARLY-BIRD',
      description: t.tagline || 'Early Bird, Be Quick!',
      price: t.price || 249,
      capacity: 250,
      sold: eff.status === 'sold_out' ? 250 : Math.max(0, 250 - (t.remaining ?? 150)),
      available: eff.status === 'sold_out' ? 0 : (t.remaining ?? 150),
      perks: [
        'Priority Seating & Fast-Track Check-In',
        'Full Day Keynotes, Tech Sessions & AI Demos',
        'Exclusive Event Swag Bag & Lanyard Badge',
        'Networking Lunch & Afternoon High Tea',
        'Direct Access to Sponsor & Career Booths',
        'Verified Certificate of Participation'
      ],
      is_active: true,
      is_locked: eff.status === 'coming_soon',
      sort_order: 2,
      badge_color: '#FF9900',
      label: eff.status === 'sold_out' ? 'SOLD OUT' : (t.highlightBadge || 'POPULAR CHOICE')
    });
  }

  if (tiers.regular) {
    const t = tiers.regular;
    const eff = getTierEffectiveStatus(t);
    result.push({
      id: 'regular',
      name: t.label || 'Regular Ticket',
      slug: 'SCD-STANDARD',
      description: t.tagline || 'General Admission',
      price: t.price || 349,
      capacity: 300,
      sold: eff.status === 'sold_out' ? 300 : Math.max(0, 300 - (t.remaining ?? 300)),
      available: eff.status === 'sold_out' ? 0 : (t.remaining ?? 300),
      perks: [
        'Full Day All-Track Conference Access',
        'Official Attendee Badge & Swags',
        'Lunch & Networking Refreshments',
        'Verified Certificate of Participation',
        'Access to Sponsor Exhibits & Q&A Sessions'
      ],
      is_active: true,
      is_locked: eff.status === 'coming_soon',
      sort_order: 3,
      badge_color: '#10b981',
      label: eff.status === 'sold_out' ? 'SOLD OUT' : (t.highlightBadge || 'STANDARD ENTRY')
    });
  }

  return result;
}

export function usePassTypes() {
  const [passes, setPasses] = useState<PassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToTicketConfig((config) => {
      try {
        const mapped = mapConfigToPasses(config);
        setPasses(mapped);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Error processing ticket passes');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { passes, loading, error, refetch: () => {} };
}
