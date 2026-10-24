import { Router } from 'express';
import { supabase } from '../../shared/lib/supabase.js';
import { verifyQRToken } from '../../shared/lib/qrToken.js';
import { scannerKeyGuard } from '../../shared/middleware/scannerKeyGuard.js';

const router = Router();

// Valid activity slugs — enforce on server side to prevent arbitrary slug injection
const VALID_ACTIVITIES = [
  'human-tetris',
  'blindfold',
  'move-the-byte',
  'live-trivia',
  'food',
] as const;

type ActivitySlug = typeof VALID_ACTIVITIES[number];

// ─────────────────────────────────────────────────────────────
// GET /api/activity/verify-auth
// Health check for scanner key authentication
// ─────────────────────────────────────────────────────────────
router.get('/verify-auth', scannerKeyGuard, (_req, res) => {
  res.json({ success: true });
});

// All routes below require scanner key
router.use(scannerKeyGuard);

// ─────────────────────────────────────────────────────────────
// GET /api/activity/stats/:activity
// Returns how many students have been scanned for a given activity
// ─────────────────────────────────────────────────────────────
router.get('/stats/:activity', async (req, res, next) => {
  try {
    const activity = req.params.activity as ActivitySlug;
    if (!VALID_ACTIVITIES.includes(activity)) {
      res.status(400).json({ error: 'Invalid activity slug' });
      return;
    }

    const { count, error } = await supabase
      .from('activity_scans')
      .select('*', { count: 'exact', head: true })
      .eq('activity', activity);

    if (error) throw error;

    res.json({ activity, scanned_count: count || 0 });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/activity/all-stats
// Returns scan counts for ALL 5 activities at once (for admin dashboard)
// ─────────────────────────────────────────────────────────────
router.get('/all-stats', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('activity_scans')
      .select('activity');

    if (error) throw error;

    const counts: Record<string, number> = {};
    for (const slug of VALID_ACTIVITIES) {
      counts[slug] = 0;
    }
    for (const row of data || []) {
      if (row.activity in counts) {
        counts[row.activity]++;
      }
    }

    res.json({ stats: counts });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/activity/all
// Returns all activity scans (admin overview), joined with student name
// ─────────────────────────────────────────────────────────────
router.get('/all', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('activity_scans')
      .select('*')
      .order('scanned_at', { ascending: false })
      .limit(500);

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/activity/student-summary
// Returns per-student activity participation breakdown for admin dashboard
// ─────────────────────────────────────────────────────────────
router.get('/student-summary', async (_req, res, next) => {
  try {
    const { data: scans, error } = await supabase
      .from('activity_scans')
      .select('ticket_number, attendee_name, activity, scanned_at');

    if (error) throw error;

    // Build a map: ticket_number → { attendee_name, activities: Set<string>, scans: [] }
    const studentMap: Record<string, {
      ticket_number: string;
      attendee_name: string;
      activities: string[];
      scan_count: number;
    }> = {};

    for (const scan of scans || []) {
      if (!studentMap[scan.ticket_number]) {
        studentMap[scan.ticket_number] = {
          ticket_number: scan.ticket_number,
          attendee_name: scan.attendee_name,
          activities: [],
          scan_count: 0,
        };
      }
      studentMap[scan.ticket_number].activities.push(scan.activity);
      studentMap[scan.ticket_number].scan_count++;
    }

    const summary = Object.values(studentMap).sort(
      (a, b) => b.scan_count - a.scan_count
    );

    res.json(summary);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/activity/verify
// Verify a QR code for a given activity — does NOT mark as scanned.
// Returns: VALID | ALREADY_SCANNED | INVALID | NOT_CHECKED_IN
// ─────────────────────────────────────────────────────────────
router.post('/verify', async (req, res, next) => {
  try {
    const { qr_token, activity } = req.body;

    if (!qr_token || !activity) {
      res.status(400).json({ status: 'INVALID', message: 'qr_token and activity are required' });
      return;
    }

    if (!VALID_ACTIVITIES.includes(activity)) {
      res.status(400).json({ status: 'INVALID', message: 'Invalid activity slug' });
      return;
    }

    // Decode and verify the QR token (same mechanism as gate scanner)
    const { valid, ticket_number } = verifyQRToken(qr_token);
    if (!valid || !ticket_number) {
      res.json({ status: 'INVALID', message: 'QR code is not valid or tampered' });
      return;
    }

    // Fetch the registration from the main registrations table
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select('id, full_name, ticket_number, checked_in, payment_status, pass_slug, pass_types(name, slug)')
      .eq('ticket_number', ticket_number)
      .single();

    if (regError || !registration) {
      res.json({ status: 'INVALID', message: 'Ticket not found in registration database' });
      return;
    }

    if (registration.payment_status !== 'PAID') {
      res.json({ status: 'INVALID', message: 'Ticket payment is not confirmed' });
      return;
    }

    if (!registration.checked_in) {
      res.json({
        status: 'NOT_CHECKED_IN',
        message: 'Student has not checked in at the gate yet. Please ask them to check in first.',
        attendee_name: registration.full_name,
        ticket_number: registration.ticket_number,
      });
      return;
    }

    // Check if already scanned for this specific activity
    const { data: existing, error: scanError } = await supabase
      .from('activity_scans')
      .select('id, scanned_at')
      .eq('ticket_number', ticket_number)
      .eq('activity', activity)
      .maybeSingle();

    if (scanError) throw scanError;

    if (existing) {
      res.json({
        status: 'ALREADY_SCANNED',
        message: `Already scanned for ${activity} at ${new Date(existing.scanned_at).toLocaleTimeString('en-IN')}`,
        attendee_name: registration.full_name,
        ticket_number: registration.ticket_number,
        scanned_at: existing.scanned_at,
      });
      return;
    }

    // All good — student is valid, checked in, and hasn't done this activity yet
    res.json({
      status: 'VALID',
      attendee_name: registration.full_name,
      ticket_number: registration.ticket_number,
      registration_id: registration.id,
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/activity/scan
// Mark a student as having participated in an activity.
// Enforces one-scan-per-activity at the database level.
// ─────────────────────────────────────────────────────────────
router.post('/scan', async (req, res, next) => {
  try {
    const { qr_token, activity, scanned_by } = req.body;

    if (!qr_token || !activity) {
      res.status(400).json({ status: 'ERROR', message: 'qr_token and activity are required' });
      return;
    }

    if (!VALID_ACTIVITIES.includes(activity)) {
      res.status(400).json({ status: 'ERROR', message: 'Invalid activity slug' });
      return;
    }

    // Decode and verify QR token
    const { valid, ticket_number } = verifyQRToken(qr_token);
    if (!valid || !ticket_number) {
      res.json({ status: 'INVALID', message: 'Invalid or tampered QR code' });
      return;
    }

    // Fetch registration
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select('id, full_name, ticket_number, checked_in, payment_status')
      .eq('ticket_number', ticket_number)
      .single();

    if (regError || !registration) {
      res.json({ status: 'INVALID', message: 'Ticket not found' });
      return;
    }

    if (registration.payment_status !== 'PAID') {
      res.json({ status: 'INVALID', message: 'Ticket payment not confirmed' });
      return;
    }

    if (!registration.checked_in) {
      res.json({
        status: 'NOT_CHECKED_IN',
        message: 'Student must check in at the gate before participating in activities.',
        attendee_name: registration.full_name,
        ticket_number: registration.ticket_number,
      });
      return;
    }

    // Race-safe duplicate check + insert:
    // Try to insert — if a unique constraint on (ticket_number, activity) exists in DB,
    // a duplicate insert will fail gracefully. We also do a pre-check for a friendlier error.
    const { data: existing } = await supabase
      .from('activity_scans')
      .select('id, scanned_at')
      .eq('ticket_number', ticket_number)
      .eq('activity', activity)
      .maybeSingle();

    if (existing) {
      res.json({
        status: 'ALREADY_SCANNED',
        message: `${registration.full_name} has already participated in this activity.`,
        attendee_name: registration.full_name,
        ticket_number: registration.ticket_number,
        scanned_at: existing.scanned_at,
      });
      return;
    }

    const now = new Date().toISOString();

    // Insert the activity scan record
    const { error: insertError } = await supabase
      .from('activity_scans')
      .insert({
        registration_id: registration.id,
        ticket_number: registration.ticket_number,
        attendee_name: registration.full_name,
        activity,
        scanned_at: now,
        scanned_by: scanned_by || 'unknown',
      });

    // Handle unique constraint violation from concurrent duplicate scan
    if (insertError) {
      if (insertError.code === '23505') {
        // Postgres unique violation
        res.json({
          status: 'ALREADY_SCANNED',
          message: `${registration.full_name} has already participated in this activity.`,
          attendee_name: registration.full_name,
          ticket_number: registration.ticket_number,
        });
        return;
      }
      throw insertError;
    }

    res.json({
      status: 'SUCCESS',
      message: `✓ Activity recorded! Welcome, ${registration.full_name}!`,
      attendee_name: registration.full_name,
      ticket_number: registration.ticket_number,
      activity,
      scanned_at: now,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
