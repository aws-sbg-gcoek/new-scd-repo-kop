import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { ActivityConfig, getActivity } from '../../utils/activityConfig';
import {
  performActivityScan,
  startBackgroundSync,
  getLocalActivityCount,
  getSavedScannerKey,
  saveScannerKey,
  clearScannerKey,
  verifyActivityScannerKey,
  resetActivityScan,
  ActivityScanResult,
  subscribeToActivityScans,
} from '../../utils/activityStore';
import {
  StudentRegistration,
  loadRegistrations,
  subscribeToRegistrations,
} from '../../utils/registrationStore';
import {
  Camera,
  CameraOff,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  QrCode,
  ScanLine,
  Search,
  UserCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldAlert,
  Clock,
  Check,
  Loader2,
  FlipHorizontal,
  Upload,
  RefreshCw,
  LogOut,
  Wifi,
  WifiOff,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

// ── Re-usable Audio Feedback ──────────────────────────────────
function playAudioCue(type: 'success' | 'duplicate' | 'error') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'duplicate') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.setValueAtTime(196, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch {
    // blocked by browser policy
  }
}

function triggerHaptic(pattern: number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // ignore
  }
}

// ── Login Gate ────────────────────────────────────────────────
function ScannerLoginGate({
  activity,
  onAuth,
}: {
  activity: ActivityConfig;
  onAuth: (key: string) => void;
}) {
  const [key, setKey] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    setError('');

    const valid = await verifyActivityScannerKey(key.trim());
    if (valid) {
      saveScannerKey(key.trim());
      onAuth(key.trim());
    } else if (!navigator.onLine) {
      saveScannerKey(key.trim());
      onAuth(key.trim());
    } else {
      setError('Invalid scanner key. Please check with the event administrator.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">{activity.emoji}</span>
          <h1 className="text-2xl font-black text-white">{activity.name}</h1>
          <p className="text-sm text-slate-400 mt-1 font-mono">Activity Scanner</p>
        </div>

        <div className="bg-[#161F30] border border-[#2A374D] rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase text-amber-400">
              Enter Scanner Access Key
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="Enter passcode..."
                autoFocus
                className="w-full bg-[#0B0F19] border border-[#2A374D] focus:border-amber-400 text-white font-mono text-sm px-4 py-3 pr-10 rounded-xl outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
              >
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-950/60 border border-red-700/60 rounded-xl text-red-300 text-xs font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !key.trim()}
              className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Unlock Scanner
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Main Activity Scanner Page ────────────────────────────────
export default function ActivityScannerPage() {
  const { activitySlug } = useParams<{ activitySlug: string }>();
  const navigate = useNavigate();

  const activity = getActivity(activitySlug || '');

  const [scannerKey, setScannerKey] = useState(() => getSavedScannerKey());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState<StudentRegistration[]>(() => loadRegistrations());

  const [isScanning, setIsScanning] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [manualInput, setManualInput] = useState('');
  const [lastResult, setLastResult] = useState<ActivityScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [localCount, setLocalCount] = useState(0);
  const [recentScans, setRecentScans] = useState<Array<{ result: ActivityScanResult; timestamp: string }>>([]);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isTransitioningRef = useRef(false);
  const lastScannedCodeRef = useRef('');
  const lastScanTimeRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scannerContainerId = 'activity-qr-reader';

  // Auto-auth if key exists
  useEffect(() => {
    const saved = getSavedScannerKey();
    if (saved) {
      setScannerKey(saved);
      setIsAuthenticated(true);
    }
  }, []);

  // Online / offline listeners
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // Background sync worker
  useEffect(() => {
    if (!isAuthenticated || !scannerKey) return;
    const stop = startBackgroundSync(scannerKey);
    return stop;
  }, [isAuthenticated, scannerKey]);

  // Real-time registration sync so mobile activity scanners get all approved tickets
  useEffect(() => {
    const unsub = subscribeToRegistrations(records => {
      if (records && records.length > 0) {
        setRegistrations(records);
      }
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Load registration data & local activity counts
  const refreshLocalData = useCallback(async () => {
    if (!activity) return;
    setRegistrations(loadRegistrations());
    const count = await getLocalActivityCount(activity.slug);
    setLocalCount(count);
  }, [activity]);

  // Real-time activity scans subscription from Firestore
  useEffect(() => {
    if (!activity) return;
    const unsub = subscribeToActivityScans(scans => {
      const thisActivityScans = scans.filter(s => s.activity === activity.slug);
      setLocalCount(thisActivityScans.length);
      const feed = thisActivityScans.slice(0, 20).map(s => ({
        result: {
          status: 'SUCCESS' as const,
          message: `Approved for ${activity.name}`,
          attendee_name: s.attendee_name,
          ticket_number: s.ticket_number,
          scanned_at: s.scanned_at,
        },
        timestamp: new Date(s.scanned_at).toLocaleTimeString('en-IN'),
      }));
      setRecentScans(feed);
    });
    return () => unsub();
  }, [activity]);

  useEffect(() => {
    refreshLocalData();
  }, [refreshLocalData, lastResult]);

  // Derived stats matching Gate Scanner
  const approvedList = registrations.filter(r => r.status === 'APPROVED');
  const remainingCount = Math.max(0, approvedList.length - localCount);
  const turnoutPercent = approvedList.length > 0 ? Math.round((localCount / approvedList.length) * 100) : 0;
  const thisSessionCount = recentScans.filter(s => s.result.status === 'SUCCESS').length;
  const duplicatesCount = recentScans.filter(s => s.result.status === 'ALREADY_SCANNED').length;

  const handleAuth = (key: string) => {
    setScannerKey(key);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearScannerKey();
    setScannerKey('');
    setIsAuthenticated(false);
    stopScanner();
  };

  // Safely destroy scanner instance
  const safelyDestroyScanner = async () => {
    if (!html5QrCodeRef.current) return;
    const scanner = html5QrCodeRef.current;
    html5QrCodeRef.current = null;
    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch (e) {
      console.warn('Silent stop error during cleanup:', e);
    }
    try {
      scanner.clear();
    } catch (e) {
      console.warn('Silent clear error during cleanup:', e);
    }
  };

  const stopScanner = async () => {
    await safelyDestroyScanner();
    setIsScanning(false);
    setIsStartingCamera(false);
  };

  // Start HTML5 Camera Scanner
  const startScanner = async (overrideFacingMode?: 'environment' | 'user') => {
    if (isTransitioningRef.current) return;

    const targetFacingMode = overrideFacingMode || facingMode;
    isTransitioningRef.current = true;
    setIsStartingCamera(true);
    setCameraError(null);

    try {
      await safelyDestroyScanner();
      const container = document.getElementById(scannerContainerId);
      if (container) container.innerHTML = '';

      await new Promise(resolve => setTimeout(resolve, 100));

      const scanner = new Html5Qrcode(scannerContainerId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      });
      html5QrCodeRef.current = scanner;

      const qrConfig = {
        fps: 30,
        qrbox: (w: number, h: number) => {
          const edge = Math.min(w, h);
          const boxSize = Math.max(220, Math.min(Math.floor(edge * 0.85), 360));
          return { width: boxSize, height: boxSize };
        },
        aspectRatio: 1.0,
      };

      const onScanSuccess = (decodedText: string) => {
        handleProcessCode(decodedText);
      };

      const onScanFailure = () => {};

      try {
        await scanner.start(
          { facingMode: targetFacingMode },
          qrConfig,
          onScanSuccess,
          onScanFailure
        );
      } catch (firstErr) {
        const cameras = await Html5Qrcode.getCameras().catch(() => []);
        if (cameras && cameras.length > 0) {
          const preferredCam =
            targetFacingMode === 'environment'
              ? cameras.find(c => /back|rear|environment/i.test(c.label)) || cameras[cameras.length - 1]
              : cameras.find(c => /front|user|forward|selfie/i.test(c.label)) || cameras[0];

          await scanner.start(preferredCam.id, qrConfig, onScanSuccess, onScanFailure);
        } else {
          throw firstErr;
        }
      }

      setIsScanning(true);
      setCameraError(null);
    } catch (err: unknown) {
      console.error('Failed to start camera scanner:', err);
      const rawMsg = err instanceof Error ? err.message : String(err);
      let friendlyMsg = rawMsg;
      if (/permission|notallowed/i.test(rawMsg)) {
        friendlyMsg = 'Camera permission was denied. Please allow camera permissions in browser settings.';
      } else if (/notfound|devicesnotfound/i.test(rawMsg)) {
        friendlyMsg = 'No camera device found on this phone or tablet.';
      } else if (/notreadable|trackstart/i.test(rawMsg)) {
        friendlyMsg = 'Camera is in use by another app or tab. Please close other camera apps and retry.';
      }
      setCameraError(friendlyMsg);
      await safelyDestroyScanner();
      setIsScanning(false);
    } finally {
      setIsStartingCamera(false);
      isTransitioningRef.current = false;
    }
  };

  const handleToggleFacingMode = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    if (isScanning) {
      await startScanner(nextMode);
    }
  };

  // Image upload scanner
  const handleImageFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    setCameraError(null);

    try {
      const fileScanner = new Html5Qrcode('activity-qr-file-processor', {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });

      const decoded = await fileScanner.scanFile(file, true);
      try {
        fileScanner.clear();
      } catch {}
      if (decoded) handleProcessCode(decoded);
    } catch {
      setCameraError('No valid ticket QR code detected in the selected image. Please make sure the QR is clear and well-lit, or enter the code manually.');
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Process QR or manual code
  const handleProcessCode = useCallback(async (rawCode: string) => {
    const trimmed = rawCode.trim();
    if (!trimmed || isProcessing || !activity) return;

    const now = Date.now();
    if (trimmed === lastScannedCodeRef.current && now - lastScanTimeRef.current < 1000) return;

    lastScannedCodeRef.current = trimmed;
    lastScanTimeRef.current = now;
    setIsProcessing(true);

    try {
      const result = await performActivityScan(trimmed, activity.slug, scannerKey);
      setLastResult(result);
      setRecentScans(prev => [{ result, timestamp: new Date().toLocaleTimeString('en-IN') }, ...prev.slice(0, 19)]);

      if (soundEnabled) {
        if (result.status === 'SUCCESS' || result.status === 'OFFLINE_QUEUED') {
          playAudioCue('success');
          triggerHaptic([100]);
        } else if (result.status === 'ALREADY_SCANNED') {
          playAudioCue('duplicate');
          triggerHaptic([200, 100, 200]);
        } else {
          playAudioCue('error');
          triggerHaptic([300]);
        }
      }

      await refreshLocalData();
    } finally {
      setIsProcessing(false);
    }
  }, [activity, isProcessing, scannerKey, soundEnabled, refreshLocalData]);

  // Revert / Reset Check-in handler
  const handleRevertScan = async (ticketNumber: string, attendeeName: string) => {
    if (!activity) return;
    const confirmed = window.confirm(`Revert scan for "${attendeeName}" (${ticketNumber})?\nThis will allow this ticket to be scanned for ${activity.name} again.`);
    if (!confirmed) return;

    await resetActivityScan(ticketNumber, activity.slug);
    if (lastResult?.ticket_number === ticketNumber) {
      setLastResult(null);
    }
    await refreshLocalData();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleProcessCode(manualInput);
    setManualInput('');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      safelyDestroyScanner();
    };
  }, []);

  // 404 for unknown activity
  if (!activity) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white text-center p-8">
        <div>
          <p className="text-6xl mb-4">❓</p>
          <h1 className="text-2xl font-bold mb-2">Unknown Activity</h1>
          <p className="text-slate-400 mb-6">"{activitySlug}" is not a valid activity.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-amber-500 text-slate-950 font-bold px-6 py-2 rounded-xl cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Login Gate
  if (!isAuthenticated) {
    return <ScannerLoginGate activity={activity} onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#E2E8F0] font-sans pb-16">
      {/* ── Top Header Navigation ── */}
      <header className="sticky top-0 z-40 bg-[#111827] border-b border-[#1E293B] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activity.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">{activity.name} Scanner</h1>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isOnline
                    ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-400'
                    : 'bg-amber-950/80 border-amber-700/60 text-amber-400 animate-pulse'
                }`}>
                  {isOnline ? 'Online' : 'Offline Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                AWS Student Community Day 2026 · 1-Time Scan Activity Controller
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={soundEnabled ? 'Beep Sound Enabled' : 'Sound Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-[#1E293B] hover:bg-[#334155] text-slate-300 hover:text-white text-xs font-mono px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors border border-[#334155] cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-7xl mx-auto p-3 sm:p-5 lg:p-6 space-y-6">
        {/* ── Top Stats Bar (Matching Gate Scanner in Image 1 + Image 3 session stats) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-[#101726] border border-[#1E293B] rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase text-slate-400 block truncate">Checked In</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">{localCount}</span>
            </div>
          </div>

          <div className="bg-[#101726] border border-[#1E293B] rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase text-slate-400 block truncate">Total Approved</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">{approvedList.length}</span>
            </div>
          </div>

          <div className="bg-[#101726] border border-[#1E293B] rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase text-slate-400 block truncate">Expected Remaining</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">{remainingCount}</span>
            </div>
          </div>

          <div className="bg-[#101726] border border-[#1E293B] rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase text-slate-400 block truncate">Activity Turnout</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-purple-300">{turnoutPercent}%</span>
            </div>
          </div>

          {/* Image 3: Session Stats */}
          <div className="bg-[#101726] border border-[#1E293B] rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase text-slate-400 block truncate">This Session</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-300">{thisSessionCount}</span>
            </div>
          </div>

          <div className="bg-[#101726] border border-red-900/30 rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <AlertOctagon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase text-red-400/80 block truncate">Duplicates</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-red-400">{duplicatesCount}</span>
            </div>
          </div>
        </div>

        {/* ── Main Scanner Grid: Left Viewfinder + Right Result Card (Exact Gate Scanner Structure) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── Left Column: Camera Viewfinder & Manual Input ── */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#101726] border border-[#1E293B] rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ScanLine className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base">{activity.name} QR Scanner</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-2 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                      soundEnabled
                        ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                    title={soundEnabled ? 'Beep Sound Enabled' : 'Sound Muted'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Viewfinder Container */}
              <div className="relative bg-[#070B13] border-2 border-[#1E293B] rounded-xl overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
                <div id="activity-qr-file-processor" style={{ display: 'none' }} />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageFileScan}
                  className="hidden"
                />

                <div
                  id={scannerContainerId}
                  className={`w-full ${isScanning ? 'block' : isStartingCamera ? 'block opacity-40' : 'hidden'}`}
                  style={{ maxHeight: '380px' }}
                />

                {isStartingCamera && (
                  <div className="absolute inset-0 bg-[#070B13]/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30 space-y-3">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                    <div>
                      <h5 className="text-white text-sm font-bold">Activating Camera...</h5>
                      <p className="text-slate-400 text-xs mt-1 max-w-xs">
                        Requesting camera access. If prompted, tap <strong className="text-amber-400">"Allow"</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Idle State */}
                {!isScanning && !isStartingCamera && (
                  <div className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Camera Scanner Ready</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        Point phone camera at attendee ticket QR code for instantaneous 1-tap {activity.name} check-in.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => startScanner()}
                        disabled={isStartingCamera}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Activate Live Camera</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessingImage}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#162033] hover:bg-[#1E2D4A] border border-[#2B3B59] text-slate-200 text-xs font-mono font-medium px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                        title="Upload or snap a photo of ticket QR"
                      >
                        {isProcessingImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-amber-400" />
                            <span>Snap / Upload Photo</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Running Controls */}
                {isScanning && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleFacingMode}
                      className="flex items-center gap-1.5 bg-[#070B13]/80 hover:bg-[#162033] border border-slate-700 text-slate-200 text-xs font-mono px-2.5 py-1.5 rounded-lg shadow-lg cursor-pointer transition-colors backdrop-blur-xs"
                      title="Flip camera"
                    >
                      <FlipHorizontal className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">{facingMode === 'environment' ? 'Front Cam' : 'Back Cam'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={stopScanner}
                      className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg shadow-lg cursor-pointer transition-colors"
                    >
                      <CameraOff className="w-3.5 h-3.5" />
                      <span>Turn Off</span>
                    </button>
                  </div>
                )}

                {/* Camera Error Display */}
                {cameraError && (
                  <div className="p-4 bg-red-950/80 border border-red-500/60 rounded-xl text-xs text-red-200 m-4 flex items-start gap-3 w-[calc(100%-2rem)]">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <div>
                        <strong className="text-red-300">Camera Notice:</strong> {cameraError}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => startScanner()}
                          className="inline-flex items-center gap-1.5 bg-red-900/60 hover:bg-red-900 border border-red-500/50 text-red-100 text-[11px] font-mono px-3 py-1 rounded-lg cursor-pointer transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 text-red-300" />
                          <span>Retry Camera</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 bg-[#162033] hover:bg-[#1E2D4A] border border-[#2B3B59] text-slate-200 text-[11px] font-mono px-3 py-1 rounded-lg cursor-pointer transition-colors"
                        >
                          <Upload className="w-3 h-3 text-amber-400" />
                          <span>Upload Ticket QR Image</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Entry or Gun Input */}
              <form onSubmit={handleManualSubmit} className="pt-2">
                <label className="text-[11px] font-mono text-slate-400 block mb-1.5 uppercase font-semibold">
                  Barcode Gun / Manual Ticket Code Entry
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={manualInput}
                      onChange={e => setManualInput(e.target.value)}
                      placeholder="Scan with gun or paste TKT-2026-XXXXXX..."
                      className="w-full bg-[#070B13] border border-[#243044] focus:border-amber-500 text-white font-mono text-xs pl-10 pr-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!manualInput.trim() || isProcessing}
                    className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                  </button>
                </div>
              </form>

              {/* Quick Simulation / Test Scans Pills */}
              <div className="bg-[#070B13] border border-[#1E293B] rounded-xl p-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-semibold">
                  Quick Simulation / Test Scans:
                </span>
                <div className="flex flex-wrap gap-2">
                  {approvedList.slice(0, 3).map(att => (
                    <button
                      key={att.id}
                      type="button"
                      onClick={() => att.ticketCode && handleProcessCode(att.ticketCode)}
                      className="text-[11px] font-mono bg-[#162033] hover:bg-[#1E2D4A] border border-[#2B3B59] text-slate-200 px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{att.fullName.split(' ')[0]}</span>
                      <span className="text-amber-400 text-[10px]">({att.ticketCode})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Scan Verification Result Card (Images 1 & 2 Structure) ── */}
          <div className="lg:col-span-6 space-y-4">
            {lastResult ? (
              <div className="space-y-4 animate-scale-in">
                {/* SUCCESS: Access Granted (Image 1 Structure) */}
                {lastResult.status === 'SUCCESS' && (
                  <div className="bg-emerald-950/40 border-2 border-emerald-500 rounded-2xl p-6 shadow-2xl space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                            Activity Verified • Access Granted
                          </span>
                          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                            <span>APPROVED FOR {activity.name.toUpperCase()}</span>
                          </h2>
                        </div>
                      </div>
                      <span className="bg-emerald-500 text-slate-950 font-mono font-black text-xs px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-md">
                        <span>{activity.emoji}</span>
                        <span>{activity.name}</span>
                      </span>
                    </div>

                    {/* Activity Confirmation Highlight Banner */}
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{activity.emoji}</span>
                        <div>
                          <span className="text-[10px] uppercase font-mono text-emerald-400/80 block font-bold">
                            Official Activity Entry Pass
                          </span>
                          <strong className="text-sm font-bold text-white">
                            Approved for {activity.name}: <span className="text-emerald-300">You can enter now!</span>
                          </strong>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-bold">
                        1-Time Entry Valid
                      </span>
                    </div>

                    {/* Attendee Details Card */}
                    <div className="bg-[#070B13] border border-emerald-500/30 rounded-xl p-4 space-y-3 font-mono">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">Attendee Name</span>
                          <strong className="text-lg text-white font-sans font-bold">
                            {lastResult.attendee_name || lastResult.registration?.fullName || 'Attendee'}
                          </strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 uppercase block">Ticket Code</span>
                          <span className="text-amber-400 font-bold text-sm">
                            {lastResult.ticket_number || lastResult.registration?.ticketCode || 'TKT-VALID'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">College / Institute</span>
                          <span className="text-slate-300 font-sans text-xs">
                            {lastResult.registration?.collegeName || 'AWS Community Attendee'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">PRN / Roll Number</span>
                          <span className="text-slate-200">
                            {lastResult.registration?.prnRollNo || 'PRN-VERIFIED'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">Ticket Tier</span>
                          <span className="text-emerald-400 font-bold">
                            {lastResult.registration?.ticketTier || 'Student Pass'} (₹{lastResult.registration?.amount || 249})
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">Booking Reference</span>
                          <span className="text-slate-300">
                            {lastResult.registration?.bookingId || lastResult.ticket_number}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-300">
                        <span>✓ {activity.name} pass recorded at:</span>
                        <strong>
                          {lastResult.scanned_at
                            ? new Date(lastResult.scanned_at).toLocaleTimeString('en-IN')
                            : new Date().toLocaleTimeString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                      <div className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
                        <span className="text-emerald-400 font-bold">✓ Approved for {activity.name}:</span>
                        <span className="text-white font-semibold">You can enter now!</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLastResult(null)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-lg shadow-emerald-950/40"
                      >
                        Ready Next Ticket
                      </button>
                    </div>
                  </div>
                )}

                {/* DUPLICATE: Duplicate Entry Blocked (Image 2 Structure) */}
                {lastResult.status === 'ALREADY_SCANNED' && (
                  <div className="bg-red-950/60 border-2 border-red-500 rounded-2xl p-6 shadow-2xl space-y-5 animate-pulse">
                    <div className="flex items-center justify-between pb-3 border-b border-red-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400">
                          <AlertOctagon className="w-7 h-7" />
                        </div>
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold block">
                            Security Alert · Duplicate for {activity.name}
                          </span>
                          <h2 className="text-xl sm:text-2xl font-black text-white">DUPLICATE ENTRY BLOCKED</h2>
                        </div>
                      </div>
                      <span className="bg-red-600 text-white font-mono font-black text-xs px-3 py-1.5 rounded-full uppercase flex items-center gap-1">
                        <span>{activity.emoji}</span>
                        <span>Already Scanned</span>
                      </span>
                    </div>

                    <div className="bg-[#070B13] border border-red-500/40 rounded-xl p-4 space-y-3 font-mono">
                      <p className="text-xs text-red-300 font-sans leading-relaxed">
                        {lastResult.message}
                      </p>

                      <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">Registered Attendee</span>
                          <strong className="text-white font-sans">
                            {lastResult.attendee_name || lastResult.registration?.fullName || 'Registered Student'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">First Scanned For {activity.name}</span>
                          <strong className="text-amber-400">
                            {lastResult.scanned_at
                              ? new Date(lastResult.scanned_at).toLocaleTimeString('en-IN')
                              : 'Earlier today'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => handleRevertScan(lastResult.ticket_number || '', lastResult.attendee_name || 'Attendee')}
                        className="text-xs text-slate-400 hover:text-slate-200 underline font-mono flex items-center gap-1 cursor-pointer"
                        title="Revert and allow scanning again"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Override & Reset Check-in</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLastResult(null)}
                        className="bg-red-700 hover:bg-red-600 text-white font-mono text-xs px-4 py-2 rounded-lg cursor-pointer ml-auto"
                      >
                        Clear Alert
                      </button>
                    </div>
                  </div>
                )}

                {/* UNAPPROVED / ERROR */}
                {lastResult.status !== 'SUCCESS' && lastResult.status !== 'ALREADY_SCANNED' && (
                  <div className="bg-amber-950/40 border-2 border-amber-500/60 rounded-2xl p-6 shadow-2xl space-y-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-amber-500/30">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                        <ShieldAlert className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                          Verification Notice
                        </span>
                        <h2 className="text-xl font-bold text-white">
                          {lastResult.status === 'NOT_CHECKED_IN' ? 'CHECK-IN FIRST' : 'SCAN NOTIFICATION'}
                        </h2>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans bg-[#070B13] p-4 rounded-xl border border-slate-800">
                      {lastResult.message}
                    </p>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setLastResult(null)}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono px-4 py-2 rounded-lg cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#101726] border border-[#1E293B] rounded-2xl p-8 text-center space-y-3 min-h-[350px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-[#162033] border border-[#233147] flex items-center justify-center text-slate-400">
                  <QrCode className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white">Awaiting Scan</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Aim the camera scanner at attendee pass QR code, or scan with handheld laser gun. {activity.name} check-in verification response appears here instantly with full student credentials.
                </p>
              </div>
            )}

            {/* ── Recent Scans Activity Feed (Exact Gate Scanner Structure) ── */}
            {recentScans.length > 0 && (
              <div className="bg-[#101726] border border-[#1E293B] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                    Recent {activity.name} Scans ({recentScans.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setRecentScans([])}
                    className="text-[10px] text-slate-500 hover:text-slate-300 font-mono cursor-pointer"
                  >
                    Clear Feed
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {recentScans.map((item, idx) => {
                    const isSuccess = item.result.status === 'SUCCESS' || item.result.status === 'OFFLINE_QUEUED';
                    const isDuplicate = item.result.status === 'ALREADY_SCANNED';
                    const studentName = item.result.attendee_name || item.result.registration?.fullName || 'Unknown Student';
                    const ticketCode = item.result.ticket_number || item.result.registration?.ticketCode || '';

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                          isSuccess
                            ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                            : isDuplicate
                            ? 'bg-red-950/30 border-red-800/40 text-red-200'
                            : 'bg-amber-950/30 border-amber-800/40 text-amber-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isSuccess ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : isDuplicate ? (
                            <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                          <span className="font-semibold truncate">
                            {studentName}
                          </span>
                          {ticketCode && (
                            <span className="text-[10px] font-mono opacity-80 shrink-0">
                              ({ticketCode})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono opacity-60">{item.timestamp}</span>
                          {isDuplicate && ticketCode && (
                            <button
                              type="button"
                              onClick={() => handleRevertScan(ticketCode, studentName)}
                              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono cursor-pointer"
                              title="Revert check-in for this student"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
