import React, { useState, useEffect, useCallback } from 'react';
import { ACTIVITIES, ActivitySlug, ActivityConfig } from '../utils/activityConfig';
import {
  fetchActivityStats,
  fetchAllActivityScans,
  fetchStudentSummary,
  getSavedScannerKey,
  ActivityScan,
  subscribeToActivityScans,
  resetActivityScan,
  resetAllStudentActivityScans,
} from '../utils/activityStore';
import {
  Activity,
  RefreshCw,
  Download,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Users,
  Zap,
  BarChart3,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
  Loader2,
  ExternalLink,
  GraduationCap,
  Mail,
  Phone,
  Ticket,
  User,
  Building2,
  Calendar,
  ShieldCheck,
  MapPin,
  Trash2,
} from 'lucide-react';
import {
  StudentRegistration,
  loadRegistrations,
  subscribeToRegistrations,
} from '../utils/registrationStore';

interface StudentSummaryRow {
  ticket_number: string;
  attendee_name: string;
  activities: string[];
  scan_count: number;
}

interface ActivityAdminPanelProps {
  scannerKey?: string; // Optional: will fallback to getSavedScannerKey()
}

// ── Colour helper (same as activityConfig but works without Tailwind dynamic classes) ──
const ACTIVITY_COLORS: Record<ActivitySlug, { light: string; dark: string; dot: string }> = {
  'human-tetris': { light: 'text-indigo-400', dark: 'bg-indigo-500/10 border-indigo-500/30', dot: 'bg-indigo-400' },
  'blindfold':    { light: 'text-purple-400',  dark: 'bg-purple-500/10 border-purple-500/30',  dot: 'bg-purple-400' },
  'move-the-byte':{ light: 'text-amber-400',   dark: 'bg-amber-500/10 border-amber-500/30',   dot: 'bg-amber-400' },
  'live-trivia':  { light: 'text-emerald-400', dark: 'bg-emerald-500/10 border-emerald-500/30',dot: 'bg-emerald-400' },
  'food':         { light: 'text-rose-400',    dark: 'bg-rose-500/10 border-rose-500/30',    dot: 'bg-rose-400' },
};

function ActivityPill({ slug }: { slug: string }) {
  const act = ACTIVITIES.find(a => a.slug === slug);
  const col = ACTIVITY_COLORS[slug as ActivitySlug];
  if (!act || !col) return <span className="text-xs text-slate-400 font-mono">{slug}</span>;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${col.dark} ${col.light}`}>
      {act.emoji} {act.name}
    </span>
  );
}

// ── Export helpers ─────────────────────────────────────────────
function exportScansToCSV(scans: ActivityScan[]) {
  const headers = ['Ticket Number', 'Attendee Name', 'Activity', 'Scanned At', 'Scanned By'];
  const rows = scans.map(s => [
    s.ticket_number,
    `"${(s.attendee_name || '').replace(/"/g, '""')}"`,
    s.activity,
    s.scanned_at,
    s.scanned_by || '',
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `activity_scans_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function exportStudentSummaryToCSV(students: StudentSummaryRow[], registrations: StudentRegistration[] = []) {
  const slugs = ACTIVITIES.map(a => a.slug);
  const headers = [
    'Ticket Number',
    'Attendee Name',
    'College',
    'PRN / Roll No',
    'Branch',
    'Degree',
    'Academic Year',
    'Ticket Tier',
    'Email',
    'Phone',
    'Booking ID',
    'Gate Check-in',
    'Total Activities',
    ...slugs,
  ];
  const rows = students.map(s => {
    const qTicket = s.ticket_number.toLowerCase().trim();
    const qName = (s.attendee_name || '').toLowerCase().trim();
    const reg = registrations.find(r => {
      const rTicket = (r.ticketCode || '').toLowerCase().trim();
      const rBooking = (r.bookingId || '').toLowerCase().trim();
      const rTx = (r.transactionId || '').toLowerCase().trim();
      const rName = (r.fullName || '').toLowerCase().trim();
      return (
        (rTicket && (rTicket === qTicket || qTicket.includes(rTicket))) ||
        (rBooking && (rBooking === qTicket || qTicket.includes(rBooking))) ||
        (rTx && (rTx === qTicket || qTicket.includes(rTx))) ||
        (qName && rName && (rName === qName || rName.includes(qName) || qName.includes(rName)))
      );
    });

    return [
      s.ticket_number,
      `"${(s.attendee_name || reg?.fullName || '').replace(/"/g, '""')}"`,
      `"${(reg?.collegeName || '').replace(/"/g, '""')}"`,
      `"${(reg?.prnRollNo || '').replace(/"/g, '""')}"`,
      `"${(reg?.branch || '').replace(/"/g, '""')}"`,
      `"${(reg?.degree || '').replace(/"/g, '""')}"`,
      `"${(reg?.academicYear || '').replace(/"/g, '""')}"`,
      `"${(reg?.ticketTier || '').replace(/"/g, '""')}"`,
      `"${(reg?.email || '').replace(/"/g, '""')}"`,
      `"${(reg?.phone || '').replace(/"/g, '""')}"`,
      `"${(reg?.bookingId || '').replace(/"/g, '""')}"`,
      reg?.checkedIn ? 'Yes' : 'No',
      s.scan_count,
      ...slugs.map(slug => (s.activities.includes(slug) ? '✓' : '')),
    ];
  });
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `activity_student_summary_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ── Main component ─────────────────────────────────────────────
export default function ActivityAdminPanel({ scannerKey }: ActivityAdminPanelProps) {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [allScans, setAllScans] = useState<ActivityScan[]>([]);
  const [studentSummary, setStudentSummary] = useState<StudentSummaryRow[]>([]);
  const [registrations, setRegistrations] = useState<StudentRegistration[]>(() => loadRegistrations());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'students' | 'feed'>('overview');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  const isOnline = navigator.onLine;

  // Real-time synchronization with registration database
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

  // Helper to find full student profile by ticket number or attendee name
  const getStudentRegistration = useCallback(
    (ticketNumber: string, attendeeName?: string): StudentRegistration | undefined => {
      const qTicket = ticketNumber.toLowerCase().trim();
      const qName = (attendeeName || '').toLowerCase().trim();

      return registrations.find(r => {
        const rTicket = (r.ticketCode || '').toLowerCase().trim();
        const rBooking = (r.bookingId || '').toLowerCase().trim();
        const rTx = (r.transactionId || '').toLowerCase().trim();
        const rName = (r.fullName || '').toLowerCase().trim();

        if (rTicket && (rTicket === qTicket || qTicket.includes(rTicket) || rTicket.includes(qTicket))) return true;
        if (rBooking && (rBooking === qTicket || qTicket.includes(rBooking) || rBooking.includes(qTicket))) return true;
        if (rTx && (rTx === qTicket || qTicket.includes(rTx) || rTx.includes(qTicket))) return true;
        if (qName && rName && (rName === qName || rName.includes(qName) || qName.includes(rName))) return true;
        return false;
      });
    },
    [registrations]
  );

  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);

    const key = scannerKey || getSavedScannerKey() || localStorage.getItem('activity_scanner_key') || '';

    try {
      const scansData = await fetchAllActivityScans(key);
      if (scansData && scansData.length > 0) {
        setAllScans(scansData);

        const newStats: Record<string, number> = {};
        for (const act of ACTIVITIES) {
          newStats[act.slug] = 0;
        }
        for (const s of scansData) {
          newStats[s.activity] = (newStats[s.activity] || 0) + 1;
        }
        setStats(newStats);

        const summaryMap: Record<string, { attendee_name: string; activities: Set<string> }> = {};
        for (const s of scansData) {
          if (!summaryMap[s.ticket_number]) {
            summaryMap[s.ticket_number] = {
              attendee_name: s.attendee_name || 'Attendee',
              activities: new Set(),
            };
          }
          summaryMap[s.ticket_number].activities.add(s.activity);
        }
        const newSummary = Object.entries(summaryMap).map(([ticket_number, data]) => ({
          ticket_number,
          attendee_name: data.attendee_name,
          activities: Array.from(data.activities),
          scan_count: data.activities.size,
        })).sort((a, b) => b.scan_count - a.scan_count);
        setStudentSummary(newSummary);
      }
      setLastRefreshed(new Date());
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [scannerKey]);

  useEffect(() => {
    loadData(false);
    // Real-time listener: updates Activity stats, per-student progress, and live feed INSTANTLY when any volunteer scans!
    const unsub = subscribeToActivityScans(remoteScans => {
      setAllScans(remoteScans);

      // Update live per-activity counts
      const newStats: Record<string, number> = {};
      for (const act of ACTIVITIES) {
        newStats[act.slug] = 0;
      }
      for (const s of remoteScans) {
        newStats[s.activity] = (newStats[s.activity] || 0) + 1;
      }
      setStats(newStats);

      // Update live per-student participation summary
      const summaryMap: Record<string, { attendee_name: string; activities: Set<string> }> = {};
      for (const s of remoteScans) {
        if (!summaryMap[s.ticket_number]) {
          summaryMap[s.ticket_number] = {
            attendee_name: s.attendee_name || 'Attendee',
            activities: new Set(),
          };
        }
        summaryMap[s.ticket_number].activities.add(s.activity);
      }
      const newSummary = Object.entries(summaryMap).map(([ticket_number, data]) => ({
        ticket_number,
        attendee_name: data.attendee_name,
        activities: Array.from(data.activities),
        scan_count: data.activities.size,
      })).sort((a, b) => b.scan_count - a.scan_count);
      setStudentSummary(newSummary);
      setLastRefreshed(new Date());
      setIsLoading(false);
    });

    const interval = setInterval(() => loadData(true), 10_000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [loadData]);

  const totalScans = Object.values(stats).reduce((a, b) => a + b, 0);
  const uniqueStudents = studentSummary.length;

  // ── Filtered students (searches ticket, name, college, PRN, email, phone) ──
  const filteredStudents = studentSummary
    .filter(s => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const reg = getStudentRegistration(s.ticket_number, s.attendee_name);
      return (
        s.ticket_number.toLowerCase().includes(q) ||
        (s.attendee_name || '').toLowerCase().includes(q) ||
        (reg?.collegeName || '').toLowerCase().includes(q) ||
        (reg?.prnRollNo || '').toLowerCase().includes(q) ||
        (reg?.branch || '').toLowerCase().includes(q) ||
        (reg?.email || '').toLowerCase().includes(q) ||
        (reg?.phone || '').toLowerCase().includes(q) ||
        (reg?.bookingId || '').toLowerCase().includes(q) ||
        (reg?.ticketTier || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) =>
      sortDir === 'desc' ? b.scan_count - a.scan_count : a.scan_count - b.scan_count
    );

  // ── Filtered recent scans ──────────────────────────────────
  const filteredScans = allScans.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const reg = getStudentRegistration(s.ticket_number, s.attendee_name);
    return (
      s.ticket_number.toLowerCase().includes(q) ||
      (s.attendee_name || '').toLowerCase().includes(q) ||
      s.activity.toLowerCase().includes(q) ||
      (reg?.collegeName || '').toLowerCase().includes(q)
    );
  });

  // ── Delete scan handlers (Admin override) ─────────────────
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  const handleDeleteScan = async (ticketNumber: string, activitySlug: ActivitySlug, activityName: string) => {
    if (!window.confirm(`Are you sure you want to remove the "${activityName}" scan for ticket ${ticketNumber}?`)) {
      return;
    }
    const key = `${ticketNumber}_${activitySlug}`;
    setDeletingKey(key);
    try {
      await resetActivityScan(ticketNumber, activitySlug);
      // Immediately update local state
      setAllScans(prev => prev.filter(s => !(s.ticket_number === ticketNumber && s.activity === activitySlug)));
      setStudentSummary(prev => {
        return prev
          .map(s => {
            if (s.ticket_number === ticketNumber) {
              const updatedActivities = s.activities.filter(a => a !== activitySlug);
              return {
                ...s,
                activities: updatedActivities,
                scan_count: updatedActivities.length,
              };
            }
            return s;
          })
          .filter(s => s.scan_count > 0);
      });
      setStats(prev => ({
        ...prev,
        [activitySlug]: Math.max(0, (prev[activitySlug] || 1) - 1),
      }));
    } catch (err) {
      console.error('Failed to delete scan:', err);
      alert('Failed to delete scan. Please try again.');
    } finally {
      setDeletingKey(null);
    }
  };

  const handleDeleteAllStudentScans = async (ticketNumber: string, studentName?: string) => {
    if (!window.confirm(`Are you sure you want to delete ALL activity scans for ${studentName || ticketNumber}?`)) {
      return;
    }
    setDeletingKey(ticketNumber);
    try {
      await resetAllStudentActivityScans(ticketNumber);
      setAllScans(prev => prev.filter(s => s.ticket_number !== ticketNumber));
      setStudentSummary(prev => prev.filter(s => s.ticket_number !== ticketNumber));
      loadData(false);
    } catch (err) {
      console.error('Failed to reset all student scans:', err);
      alert('Failed to reset student scans. Please try again.');
    } finally {
      setDeletingKey(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-slate-400 text-sm font-mono">Loading activity data...</p>
      </div>
    );
  }

  return (
    <section className="space-y-5 animate-fade-in">
      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">Activity Participation Dashboard</h2>
          <span className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
            isOnline
              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-400'
              : 'bg-amber-950/60 border-amber-700/60 text-amber-400'
          }`}>
            {isOnline ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
            {isOnline ? 'Live' : 'Cached'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500">
            Updated {lastRefreshed.toLocaleTimeString('en-IN')}
          </span>
          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-slate-200 text-xs font-mono px-3 py-1.5 rounded-lg cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
            Refresh
          </button>
          <button
            onClick={() => exportScansToCSV(allScans)}
            className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-slate-200 text-xs font-mono px-3 py-1.5 rounded-lg cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export All
          </button>
        </div>
      </div>

      {/* ── Activity scanner quick links ── */}
      <div className="flex flex-wrap gap-2">
        {ACTIVITIES.map(act => (
          <a
            key={act.slug}
            href={`/activity/${act.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg border cursor-pointer transition-all hover:opacity-80 ${act.color.bg} ${act.color.border} ${act.color.text}`}
          >
            {act.emoji} {act.name}
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        ))}
      </div>

      {/* ── Summary stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total scans */}
        <div className="col-span-1 bg-[#101726] border border-[#1E293B] rounded-xl p-3 flex flex-col">
          <span className="text-[10px] font-mono uppercase text-slate-400">Total Scans</span>
          <span className="text-2xl font-black font-mono text-amber-400">{totalScans}</span>
        </div>
        {/* Unique students */}
        <div className="col-span-1 bg-[#101726] border border-[#1E293B] rounded-xl p-3 flex flex-col">
          <span className="text-[10px] font-mono uppercase text-slate-400">Students</span>
          <span className="text-2xl font-black font-mono text-white">{uniqueStudents}</span>
        </div>
        {/* Per-activity cards */}
        {ACTIVITIES.map(act => {
          const col = ACTIVITY_COLORS[act.slug];
          const count = stats[act.slug] ?? 0;
          return (
            <div
              key={act.slug}
              className={`bg-[#101726] border rounded-xl p-3 flex flex-col ${col.dark}`}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="text-base">{act.emoji}</span>
                <span className={`text-[10px] font-mono uppercase font-bold ${col.light} truncate`}>
                  {act.name.split(' ')[0]}
                </span>
              </div>
              <span className={`text-2xl font-black font-mono ${col.light}`}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* ── Sub-tabs ── */}
      <div className="flex items-center gap-1 border-b border-[#1E293B] pb-0">
        {(['overview', 'students', 'feed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t-lg cursor-pointer transition-all ${
              activeSubTab === tab
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'students' && `👥 Per Student (${uniqueStudents})`}
            {tab === 'feed' && `⚡ Live Feed (${allScans.length})`}
          </button>
        ))}
      </div>

      {/* ── Search bar ── */}
      {(activeSubTab === 'students' || activeSubTab === 'feed') && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={activeSubTab === 'students' ? 'Search by name or ticket...' : 'Filter by name, ticket, or activity...'}
            className="w-full bg-[#101726] border border-[#1E293B] focus:border-amber-500 text-white font-mono text-xs pl-10 pr-4 py-2.5 rounded-xl outline-none"
          />
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          SUB-TAB 1: OVERVIEW — Activity bar chart
      ───────────────────────────────────────────────────────── */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-[#101726] border border-[#1E293B] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Activity Participation Breakdown</h3>
            </div>

            <div className="space-y-3">
              {ACTIVITIES.map(act => {
                const col = ACTIVITY_COLORS[act.slug];
                const count = stats[act.slug] ?? 0;
                const maxCount = Math.max(...Object.values(stats), 1);
                const pct = Math.round((count / maxCount) * 100);

                return (
                  <div key={act.slug} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-1.5">
                        <span>{act.emoji}</span>
                        <span className="text-slate-200">{act.name}</span>
                        <a
                          href={`/activity/${act.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-[10px] ${col.light} underline opacity-60 hover:opacity-100`}
                        >
                          Open Scanner ↗
                        </a>
                      </span>
                      <span className={`font-black ${col.light}`}>{count}</span>
                    </div>
                    <div className="h-2.5 bg-[#0B0F19] rounded-full overflow-hidden border border-[#1E293B]">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${col.dot}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {totalScans === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm font-mono">
                No activity scans yet. Open individual scanner URLs to start scanning.
              </div>
            )}
          </div>

          {/* Multi-activity participation breakdown */}
          {studentSummary.length > 0 && (
            <div className="bg-[#101726] border border-[#1E293B] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Participation Depth</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[5, 4, 3, 2, 1].map(count => {
                  const students = studentSummary.filter(s => s.scan_count === count).length;
                  return (
                    <div key={count} className="bg-[#0B0F19] border border-[#1E293B] rounded-xl p-3 text-center">
                      <span className="text-lg font-black text-white block">{students}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {count} {count === 1 ? 'activity' : 'activities'}
                      </span>
                    </div>
                  );
                })}
                <div className="bg-[#0B0F19] border border-[#1E293B] rounded-xl p-3 text-center">
                  <span className="text-lg font-black text-amber-400 block">
                    {Math.round(totalScans / Math.max(uniqueStudents, 1) * 10) / 10}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">avg / student</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          SUB-TAB 2: PER-STUDENT breakdown
      ───────────────────────────────────────────────────────── */}
      {activeSubTab === 'students' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-mono">
              {filteredStudents.length} of {uniqueStudents} students
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {sortDir === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                Sort by activities
              </button>
              <button
                onClick={() => exportStudentSummaryToCSV(studentSummary, registrations)}
                className="flex items-center gap-1.5 bg-[#1E293B] border border-[#334155] text-slate-300 text-xs font-mono px-2.5 py-1 rounded-lg cursor-pointer hover:bg-[#334155] transition-colors"
              >
                <Download className="w-3 h-3 text-emerald-400" />
                CSV
              </button>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm font-mono">
              {searchQuery ? 'No students match your search.' : 'No activity scans recorded yet.'}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map(student => {
                const isExpanded = expandedStudent === student.ticket_number;
                const progress = Math.round((student.scan_count / ACTIVITIES.length) * 100);
                const reg = getStudentRegistration(student.ticket_number, student.attendee_name);

                return (
                  <div
                    key={student.ticket_number}
                    className="bg-[#101726] border border-[#1E293B] rounded-xl overflow-hidden transition-all duration-200"
                  >
                    {/* Row header */}
                    <button
                      onClick={() => setExpandedStudent(isExpanded ? null : student.ticket_number)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer hover:bg-[#162133] transition-colors"
                    >
                      {/* Progress ring indicator */}
                      <div className="relative w-10 h-10 shrink-0">
                        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="#1E293B" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="15"
                            fill="none"
                            stroke={progress === 100 ? '#10b981' : '#f59e0b'}
                            strokeWidth="3"
                            strokeDasharray={`${progress * 0.942} 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white font-mono">
                          {student.scan_count}/{ACTIVITIES.length}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-white truncate">
                            {student.attendee_name || reg?.fullName || 'Unknown Student'}
                          </p>
                          {reg?.ticketTier && (
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              {reg.ticketTier.split('(')[0].trim()}
                            </span>
                          )}
                          {reg?.checkedIn && (
                            <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Gate Check-In
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-mono text-slate-400 mt-1">
                          <span className="text-amber-400 font-bold">{student.ticket_number}</span>
                          {reg?.collegeName && (
                            <span className="text-slate-300 truncate max-w-[280px] sm:max-w-[420px]" title={reg.collegeName}>
                              • 🎓 {reg.collegeName}
                            </span>
                          )}
                          {reg?.branch && (
                            <span className="text-slate-400 hidden sm:inline truncate max-w-[200px]">
                              • {reg.branch}
                            </span>
                          )}
                          {reg?.prnRollNo && (
                            <span className="text-slate-500 hidden md:inline font-mono">
                              • PRN: {reg.prnRollNo}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 justify-end max-w-[180px] shrink-0">
                        {ACTIVITIES.map(act => {
                          const done = student.activities.includes(act.slug);
                          return (
                            <span
                              key={act.slug}
                              title={`${act.name}: ${done ? 'Completed' : 'Pending'}`}
                              className={`text-base transition-transform ${done ? 'opacity-100 scale-105' : 'opacity-20 grayscale'}`}
                            >
                              {act.emoji}
                            </span>
                          );
                        })}
                      </div>

                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      }
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-t border-[#1E293B] px-4 py-4 bg-[#0D1627] space-y-4 animate-fade-in">
                        {/* 5 Activity Status Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {ACTIVITIES.map(act => {
                            const done = student.activities.includes(act.slug);
                            const col = ACTIVITY_COLORS[act.slug];
                            return (
                              <div
                                key={act.slug}
                                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                                  done ? `${col.dark} shadow-md shadow-black/40` : 'bg-slate-900/50 border-slate-800'
                                }`}
                              >
                                <span className={`text-2xl ${done ? '' : 'grayscale opacity-30'}`}>{act.emoji}</span>
                                <span className={`text-[11px] font-mono font-bold ${done ? col.light : 'text-slate-500'}`}>
                                  {act.name}
                                </span>
                                {done ? (
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold ${col.light}`}>
                                      <CheckCircle2 className="w-3 h-3" /> Done
                                    </span>
                                    <button
                                      type="button"
                                      disabled={deletingKey === `${student.ticket_number}_${act.slug}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteScan(student.ticket_number, act.slug, act.name);
                                      }}
                                      className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-950/70 border border-[#233147] hover:border-red-900 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                      title={`Delete / Reset ${act.name} scan for this student`}
                                    >
                                      {deletingKey === `${student.ticket_number}_${act.slug}` ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-600">
                                    <XCircle className="w-3 h-3 text-slate-700" /> Pending
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="h-2 bg-[#0B0F19] rounded-full overflow-hidden border border-[#1E293B]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-amber-500'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-1.5 flex items-center justify-between">
                            <span>{student.scan_count} of {ACTIVITIES.length} activities completed ({progress}%)</span>
                            {progress === 100 && (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <span>🎉</span> All 5 Activities Completed!
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Student Information & Profile Section */}
                        <div className="pt-3 border-t border-[#1E293B]">
                          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                <User className="w-3.5 h-3.5" />
                              </div>
                              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                                Student Registration & Profile Details
                              </h4>
                            </div>
                            <div className="flex items-center gap-2">
                              {reg?.status && (
                                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                                  reg.status === 'APPROVED'
                                    ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-400'
                                    : 'bg-amber-950/60 border-amber-700/60 text-amber-400'
                                }`}>
                                  {reg.status}
                                </span>
                              )}
                              <button
                                type="button"
                                disabled={deletingKey === student.ticket_number}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAllStudentScans(student.ticket_number, student.attendee_name || reg?.fullName);
                                }}
                                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-red-400 hover:bg-red-950/70 border border-[#233147] hover:border-red-900 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                                title="Reset / Delete all activity scans for this student"
                              >
                                {deletingKey === student.ticket_number ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                                <span>Reset All</span>
                              </button>
                            </div>
                          </div>

                          {reg ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                              {/* College & PRN */}
                              <div className="p-3 rounded-xl bg-[#080D17] border border-[#1E293B]/80 hover:border-[#2D3F5E] transition-colors">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase font-bold mb-1">
                                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                                  <span>College / Institution</span>
                                </div>
                                <p className="text-slate-200 font-sans font-semibold text-xs leading-snug line-clamp-2" title={reg.collegeName}>
                                  {reg.collegeName || 'AWS Community Member'}
                                </p>
                                {reg.prnRollNo && (
                                  <p className="text-[10px] text-amber-400/90 font-mono mt-1.5">
                                    PRN / Roll: <span className="font-bold text-white">{reg.prnRollNo}</span>
                                  </p>
                                )}
                              </div>

                              {/* Degree & Branch */}
                              <div className="p-3 rounded-xl bg-[#080D17] border border-[#1E293B]/80 hover:border-[#2D3F5E] transition-colors">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase font-bold mb-1">
                                  <Building2 className="w-3.5 h-3.5 text-sky-400" />
                                  <span>Academic Branch & Year</span>
                                </div>
                                <p className="text-slate-200 font-sans font-medium text-xs leading-snug">
                                  {reg.degree || 'B.Tech / B.E.'} • {reg.branch || 'General'}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono mt-1.5">
                                  Academic Year: <span className="text-sky-300 font-bold">{reg.academicYear || 'N/A'}</span>
                                  {reg.district && <span className="text-slate-500"> • {reg.district}</span>}
                                </p>
                              </div>

                              {/* Pass Tier & Booking ID */}
                              <div className="p-3 rounded-xl bg-[#080D17] border border-[#1E293B]/80 hover:border-[#2D3F5E] transition-colors">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase font-bold mb-1">
                                  <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Pass Tier & Booking</span>
                                </div>
                                <p className="text-emerald-400 font-sans font-bold text-xs">
                                  {reg.ticketTier || 'Standard Pass'} {reg.amount ? `(₹${reg.amount})` : ''}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono mt-1.5 truncate">
                                  Booking ID: <span className="text-slate-200 font-bold">{reg.bookingId || reg.ticketCode || student.ticket_number}</span>
                                </p>
                              </div>

                              {/* Email */}
                              <div className="p-3 rounded-xl bg-[#080D17] border border-[#1E293B]/80 hover:border-[#2D3F5E] transition-colors">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase font-bold mb-1">
                                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                                  <span>Email Address</span>
                                </div>
                                <p className="text-slate-200 font-mono text-xs truncate" title={reg.email}>
                                  {reg.email || 'N/A'}
                                </p>
                              </div>

                              {/* Phone */}
                              <div className="p-3 rounded-xl bg-[#080D17] border border-[#1E293B]/80 hover:border-[#2D3F5E] transition-colors">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase font-bold mb-1">
                                  <Phone className="w-3.5 h-3.5 text-green-400" />
                                  <span>Contact Number</span>
                                </div>
                                <p className="text-slate-200 font-mono text-xs">
                                  {reg.phone || 'N/A'}
                                </p>
                              </div>

                              {/* Gate Check-In Status */}
                              <div className="p-3 rounded-xl bg-[#080D17] border border-[#1E293B]/80 hover:border-[#2D3F5E] transition-colors">
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono uppercase font-bold mb-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Gate Entry Status</span>
                                </div>
                                {reg.checkedIn ? (
                                  <div className="text-emerald-400 font-sans font-bold text-xs flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Checked In at Gate</span>
                                    {reg.checkedInAt && (
                                      <span className="text-[10px] text-slate-400 font-mono font-normal">
                                        ({new Date(reg.checkedInAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })})
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-slate-400 font-mono text-xs flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-amber-400/70" />
                                    <span>Gate check-in pending</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 rounded-xl bg-[#080D17] border border-[#1E293B] text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
                              <div>
                                Attendee: <strong className="text-white">{student.attendee_name || 'Attendee'}</strong> • Ticket: <strong className="text-amber-400">{student.ticket_number}</strong>
                              </div>
                              <span className="text-slate-500 text-[10px] bg-slate-800/80 px-2 py-0.5 rounded">
                                Scanned via QR code
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          SUB-TAB 3: LIVE FEED — chronological scan list
      ───────────────────────────────────────────────────────── */}
      {activeSubTab === 'feed' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 font-mono">
            {filteredScans.length} scan records — newest first
          </p>

          {filteredScans.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm font-mono">
              {searchQuery ? 'No scans match your search.' : 'No activity scans recorded yet.'}
            </div>
          ) : (
            <div className="bg-[#101726] border border-[#1E293B] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1E293B] bg-[#0D1627]">
                      <th className="text-left px-4 py-2.5 text-slate-400 uppercase tracking-wider font-semibold">Attendee</th>
                      <th className="text-left px-4 py-2.5 text-slate-400 uppercase tracking-wider font-semibold">Ticket</th>
                      <th className="text-left px-4 py-2.5 text-slate-400 uppercase tracking-wider font-semibold">Activity</th>
                      <th className="text-left px-4 py-2.5 text-slate-400 uppercase tracking-wider font-semibold">Time</th>
                      <th className="text-right px-4 py-2.5 text-slate-400 uppercase tracking-wider font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]">
                    {filteredScans.slice(0, 200).map((scan, i) => {
                      const act = ACTIVITIES.find(a => a.slug === scan.activity);
                      const col = ACTIVITY_COLORS[scan.activity as ActivitySlug];
                      const reg = getStudentRegistration(scan.ticket_number, scan.attendee_name);
                      const isDeletingThis = deletingKey === `${scan.ticket_number}_${scan.activity}`;
                      return (
                        <tr key={i} className="hover:bg-[#162133] transition-colors">
                          <td className="px-4 py-2.5 text-slate-200 font-sans">
                            <div className="font-semibold">{scan.attendee_name || reg?.fullName || '—'}</div>
                            {reg?.collegeName && (
                              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[220px]" title={reg.collegeName}>
                                🎓 {reg.collegeName}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-amber-400">{scan.ticket_number}</td>
                          <td className="px-4 py-2.5">
                            {act && col ? (
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${col.dark} ${col.light}`}>
                                {act.emoji} {act.name}
                              </span>
                            ) : (
                              <span className="text-slate-400">{scan.activity}</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-slate-400">
                            {scan.scanned_at
                              ? new Date(scan.scanned_at).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })
                              : '—'}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <button
                              type="button"
                              disabled={isDeletingThis}
                              onClick={() => handleDeleteScan(scan.ticket_number, scan.activity as ActivitySlug, act?.name || scan.activity)}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/70 border border-[#233147] hover:border-red-900 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                              title={`Delete scan for ${act?.name || scan.activity}`}
                            >
                              {isDeletingThis ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredScans.length > 200 && (
                <div className="px-4 py-2 bg-[#0D1627] border-t border-[#1E293B] text-[11px] font-mono text-slate-500">
                  Showing 200 of {filteredScans.length} scans. Export CSV for full data.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
