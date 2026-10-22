import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebase';

export interface UpiAccount {
  id: string;
  payeeName: string;
  upiId: string;
  role: string;
  bankHint?: string;
  dailyLimit?: string;
  phone?: string;
}

export interface UpiSystemConfig {
  activeAccountId: string;
  accounts: UpiAccount[];
  lastUpdated: string;
  updatedBy?: string;
}

export const UPI_CONFIG_STORAGE_KEY = 'aws_scd_upi_config_v1';

export const PRESET_UPI_ACCOUNTS: UpiAccount[] = [
  {
    id: 'bhushan',
    payeeName: 'Bhushan Jadhav',
    upiId: 'aj6244249-1@okaxis',
    role: 'Treasurer',
    bankHint: 'Axis Bank / Google Pay',
    dailyLimit: 'Standard Daily Limit (₹1,00,000 / 20 txns)',
    phone: '+91 70209 26643',
  },
  {
    id: 'shardul',
    payeeName: 'Shardul Kolekar',
    upiId: 'kolekarshardul23@okicici',
    role: 'President / Captain',
    bankHint: 'ICICI Bank / Google Pay',
    dailyLimit: 'Standard Daily Limit (₹1,00,000 / 20 txns)',
    phone: '+91 84462 76654',
  },
  {
    id: 'anas',
    payeeName: 'Anas Pathan',
    upiId: 'pathananas2007@oksbi',
    role: 'Technical Lead',
    bankHint: 'State Bank of India / Google Pay',
    dailyLimit: 'Standard Daily Limit (₹1,00,000 / 20 txns)',
    phone: '+91 70283 88155',
  },
  {
    id: 'apeksha',
    payeeName: 'Apeksha Khodave',
    upiId: 'apekshakhodave1106@oksbi',
    role: 'Organizer',
    bankHint: 'State Bank of India',
    dailyLimit: 'Standard Daily Limit (₹1,00,000 / 20 txns)',
  },
];

export const DEFAULT_UPI_CONFIG: UpiSystemConfig = {
  activeAccountId: 'bhushan',
  accounts: PRESET_UPI_ACCOUNTS,
  lastUpdated: new Date().toISOString(),
};

/**
 * Loads UPI configuration from localStorage or defaults
 */
export function loadUpiConfig(): UpiSystemConfig {
  if (typeof window === 'undefined') return DEFAULT_UPI_CONFIG;
  try {
    const raw = localStorage.getItem(UPI_CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_UPI_CONFIG;
    const parsed = JSON.parse(raw) as UpiSystemConfig;
    if (parsed && parsed.accounts && parsed.accounts.length > 0) {
      // Ensure all 4 presets are present even if previous storage had an older structure
      const accountMap = new Map<string, UpiAccount>();
      PRESET_UPI_ACCOUNTS.forEach(acc => accountMap.set(acc.id, acc));
      parsed.accounts.forEach(acc => accountMap.set(acc.id, { ...accountMap.get(acc.id), ...acc }));

      return {
        ...DEFAULT_UPI_CONFIG,
        ...parsed,
        accounts: Array.from(accountMap.values()),
        activeAccountId: parsed.activeAccountId || 'bhushan',
      };
    }
  } catch (err) {
    console.error('Failed to parse UPI config from localStorage:', err);
  }
  return DEFAULT_UPI_CONFIG;
}

/**
 * Helper to get the currently active UPI account
 */
export function getActiveUpiAccount(config?: UpiSystemConfig): UpiAccount {
  const currentConfig = config || loadUpiConfig();
  const found = currentConfig.accounts.find(a => a.id === currentConfig.activeAccountId);
  return found || currentConfig.accounts[0] || PRESET_UPI_ACCOUNTS[0];
}

/**
 * Saves UPI configuration to localStorage and Firebase Firestore
 */
export async function saveUpiConfig(config: UpiSystemConfig): Promise<void> {
  const updated: UpiSystemConfig = {
    ...config,
    lastUpdated: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(UPI_CONFIG_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('upiConfigUpdated', { detail: updated }));
  }

  // Sync to Cloud Firestore if configured
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'system_config', 'upi_settings');
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.warn('Error saving UPI config to Firestore:', err);
    }
  }
}

/**
 * Sets the active receiving UPI account by ID
 */
export async function switchActiveUpiAccount(accountId: string, updatedBy?: string): Promise<UpiAccount> {
  const current = loadUpiConfig();
  const target = current.accounts.find(a => a.id === accountId);
  if (!target) {
    throw new Error(`Account with ID "${accountId}" not found in UPI presets.`);
  }

  const updated: UpiSystemConfig = {
    ...current,
    activeAccountId: accountId,
    updatedBy,
    lastUpdated: new Date().toISOString(),
  };

  await saveUpiConfig(updated);
  return target;
}

/**
 * Real-time listener for UPI configuration changes
 */
export function subscribeToUpiConfig(callback: (config: UpiSystemConfig) => void): () => void {
  // 1. Immediately emit current local configuration
  callback(loadUpiConfig());

  // 2. Real-time Firestore sync
  let firestoreUnsub: (() => void) | null = null;
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'system_config', 'upi_settings');
      firestoreUnsub = onSnapshot(
        docRef,
        snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.data() as UpiSystemConfig;
            if (data && data.accounts) {
              // Ensure all 4 presets are present even if Firestore has an older structure
              const accountMap = new Map<string, UpiAccount>();
              PRESET_UPI_ACCOUNTS.forEach(acc => accountMap.set(acc.id, acc));
              data.accounts.forEach(acc => accountMap.set(acc.id, { ...accountMap.get(acc.id), ...acc }));

              const merged: UpiSystemConfig = {
                ...DEFAULT_UPI_CONFIG,
                ...data,
                accounts: Array.from(accountMap.values()),
                activeAccountId: data.activeAccountId || 'bhushan',
              };

              if (typeof window !== 'undefined') {
                localStorage.setItem(UPI_CONFIG_STORAGE_KEY, JSON.stringify(merged));
              }
              callback(merged);
            }
          }
        },
        err => {
          console.warn('Firestore UPI config listener notice:', err);
        }
      );
    } catch (err) {
      console.warn('Could not initialize Firestore UPI config listener:', err);
    }
  }

  // 3. Local cross-tab / window listeners
  const handleLocalUpdate = (e: Event) => {
    const customEvt = e as CustomEvent<UpiSystemConfig>;
    if (customEvt.detail) {
      callback(customEvt.detail);
    } else {
      callback(loadUpiConfig());
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === UPI_CONFIG_STORAGE_KEY) {
      callback(loadUpiConfig());
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('upiConfigUpdated', handleLocalUpdate);
    window.addEventListener('storage', handleStorage);
  }

  return () => {
    if (firestoreUnsub) firestoreUnsub();
    if (typeof window !== 'undefined') {
      window.removeEventListener('upiConfigUpdated', handleLocalUpdate);
      window.removeEventListener('storage', handleStorage);
    }
  };
}
