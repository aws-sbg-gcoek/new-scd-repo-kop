import { useState, useEffect } from 'react';
import { subscribeToTicketConfig, TicketSystemConfig, getTierEffectiveStatus, TicketCode } from '../../../utils/ticketConfig';

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

  const tierDefs: Array<{
    code: TicketCode;
    defaultName: string;
    slug: string;
    defaultTagline: string;
    defaultPrice: number;
    capacity: number;
    badgeColor: string;
    defaultBadge: string;
    perks: string[];
  }> = [
    // early_bird hidden from frontend display (ticket data preserved in backend)
    {
      code: 'regular',
      defaultName: 'Regular Ticket',
      slug: 'SCD-STANDARD',
      defaultTagline: 'General Admission',
      defaultPrice: 349,
      capacity: 300,
      badgeColor: '#10b981',
      defaultBadge: 'STANDARD ENTRY',
      perks: [
        'Full Day All-Track Conference Access',
        'Official Event Swag Kit & Badge',
        'Networking High Tea & Catered Lunch',
        'Verified Certificate of Participation',
        'Access to Keynotes & Hands-on Tech Demos'
      ]
    }
  ];

  for (let i = 0; i < tierDefs.length; i++) {
    const def = tierDefs[i];
    const t = tiers[def.code];
    if (!t) continue;

    const eff = getTierEffectiveStatus(t);
    const isOpen = eff.status === 'open';
    const isSoldOut = eff.status === 'sold_out';
    const isComingSoon = eff.status === 'coming_soon';

    // If admin set tier to open, guarantee available > 0
    let available = 0;
    if (isOpen) {
      available = t.remaining !== undefined && t.remaining > 0 ? t.remaining : def.capacity;
    } else if (isSoldOut) {
      available = 0;
    } else {
      available = t.remaining !== undefined ? t.remaining : def.capacity;
    }
    const sold = Math.max(0, def.capacity - available);

    result.push({
      id: def.code,
      name: t.label || def.defaultName,
      slug: def.slug,
      description: t.tagline || def.defaultTagline,
      price: t.price !== undefined ? t.price : def.defaultPrice,
      capacity: def.capacity,
      sold,
      available,
      perks: def.perks,
      is_active: true,
      is_locked: isComingSoon,
      sort_order: i + 1,
      badge_color: def.badgeColor,
      label: isSoldOut ? 'SOLD OUT' : isComingSoon ? 'COMING SOON' : (t.highlightBadge || def.defaultBadge)
    });
  }

  return result;
}

// Dummy frontend-only ticket (no backend / Firestore entry)
const DUMMY_STANDARD_PLUS: PassType = {
  id: 'standard_plus',
  name: 'Standard Plus Ticket',
  slug: 'SCD-STANDARD-PLUS',
  description: 'Premium Experience Pass',
  price: 749,
  capacity: 200,
  sold: 0,
  available: 0,
  perks: [
    'Full Day All-Track Conference Access',
    'Official Event Swag Kit & Badge',
    'Networking High Tea & Catered Lunch',
    'Verified Certificate of Participation',
    'Access to Keynotes & Hands-on Tech Demos'
  ],
  is_active: true,
  is_locked: true,
  sort_order: 99,
  badge_color: '#8b5cf6',
  label: 'COMING SOON',
};

export function usePassTypes() {
  const [passes, setPasses] = useState<PassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToTicketConfig((config) => {
      try {
        const mapped = mapConfigToPasses(config);
        // Append dummy frontend-only ticket after real ones
        setPasses([...mapped, DUMMY_STANDARD_PLUS]);
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
