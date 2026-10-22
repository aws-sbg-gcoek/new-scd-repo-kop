/* eslint-disable react-doctor/no-chain-state-updates, react-doctor/no-cascading-set-state */
import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, AlertCircle, Loader2, Search, CheckCircle2, Copy, Check, Ticket, Download, Calendar } from 'lucide-react';
import { usePassTypes, PassType } from '../hooks/usePassTypes';
import { useSettings } from '../hooks/useSettings';
import { PassTypeSelector } from '../components/PassTypeSelector';
import { RegistrationForm, RegistrationFormData } from '../components/RegistrationForm';
import { PaymentEmbed } from '../components/PaymentEmbed';
import { submitNewRegistration, findRegistrationAsync, StudentRegistration } from '../../../utils/registrationStore';
import { sendApplicationReceivedEmail } from '../../../services/emailService';
import { GOOGLE_CALENDAR_URL } from '../../../utils/eventConstants';
import OfficialTicketPass from '../../../components/OfficialTicketPass';

const stepLabels = ['Select Pass', 'Register Details', 'UPI Payment', 'Confirmation'];

export function TicketsPurchasePage() {
  const { passes, loading: passesLoading } = usePassTypes();
  const { registrationEnabled, loading: settingsLoading } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab: 'book' or 'track'
  const [activeTab, setActiveTab] = useState<'book' | 'track'>(() => {
    return searchParams.get('tab') === 'track' ? 'track' : 'book';
  });

  // Step in booking flow: 1 (Pass) | 2 (Form) | 3 (Payment) | 4 (Success)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPass, setSelectedPass] = useState<PassType | null>(null);
  const [attendeeData, setAttendeeData] = useState<RegistrationFormData | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<StudentRegistration | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Tracking State
  const [trackQuery, setTrackQuery] = useState(() => searchParams.get('ref') || '');
  const [trackResult, setTrackResult] = useState<StudentRegistration | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackSearched, setTrackSearched] = useState(false);

  // Auto-select pass if passId in URL
  useEffect(() => {
    const passId = searchParams.get('passId');
    if (passId && passes.length > 0 && !selectedPass) {
      const p = passes.find((x) => x.id === passId);
      if (p && !p.is_locked && p.available > 0) {
        setSelectedPass(p);
        setStep(2);
      }
    }
  }, [searchParams, passes, selectedPass]);

  // Auto-search if ref param present
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref && activeTab === 'track') {
      performTrack(ref);
    }
  }, [searchParams, activeTab]);

  const performTrack = async (queryStr: string) => {
    const q = queryStr.trim();
    if (!q) return;
    setTrackLoading(true);
    setTrackSearched(true);
    try {
      const result = await findRegistrationAsync(q);
      setTrackResult(result);
    } catch (err) {
      console.error(err);
      setTrackResult(null);
    } finally {
      setTrackLoading(false);
    }
  };

  const handleSelectPass = (pass: PassType) => {
    setSelectedPass(pass);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAttendeeSubmit = (data: RegistrationFormData) => {
    setAttendeeData(data);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmitted = async (
    utrNumber: string,
    screenshotBase64?: string,
    screenshotName?: string,
    payeeUpiId?: string,
    payeeName?: string
  ) => {
    if (!selectedPass || !attendeeData) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const record = submitNewRegistration({
        transactionId: utrNumber,
        fullName: attendeeData.fullName,
        email: attendeeData.email,
        phone: attendeeData.phone,
        district: attendeeData.district,
        collegeName: attendeeData.collegeName,
        prnRollNo: attendeeData.prnRollNo,
        degree: attendeeData.degree,
        branch: attendeeData.branch,
        academicYear: attendeeData.academicYear,
        idProofName: attendeeData.idProofName,
        idProofBase64: attendeeData.idProofBase64,
        paymentScreenshotBase64: screenshotBase64,
        paymentScreenshotName: screenshotName,
        ticketTier: selectedPass.name,
        amount: selectedPass.price,
        payeeUpiId: payeeUpiId || 'aj6244249-1@okaxis',
        payeeName: payeeName || 'Bhushan Jadhav',
      });

      // Dispatch application acknowledgment email with Application ID to student immediately
      sendApplicationReceivedEmail(record).catch((err) => {
        console.warn('Failed to send application confirmation email:', err);
      });

      setSubmittedRecord(record);
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBookingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-aws-orange" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Navbar minimal */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white/30 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors">
          <ArrowLeft size={14} />
          Back to Event
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('book'); setStep(1); }}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === 'book' ? 'bg-aws-orange text-black font-bold' : 'text-white/40 hover:text-white'
            }`}
          >
            Book Pass
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === 'track' ? 'bg-aws-orange text-black font-bold' : 'text-white/40 hover:text-white'
            }`}
          >
            Track Status
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-3xl bg-[#0d0d0d] border border-white/10 shadow-2xl relative">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-f1-red via-aws-orange to-f1-red" />

          {/* Header */}
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-sans font-black italic text-2xl uppercase tracking-tight text-white mb-1">
                {activeTab === 'book' ? 'Paddock Pass Registration' : 'Registration & Ticket Tracker'}
              </h2>
              <p className="font-mono text-xs text-white/40 uppercase tracking-widest">
                AWS Student Community Day Kolhapur 2026
              </p>
            </div>
            {activeTab === 'book' && (
              <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 uppercase tracking-widest font-bold">
                ● Direct UPI Verification
              </span>
            )}
          </div>

          {/* Booking View */}
          {activeTab === 'book' && (
            <>
              {/* Step indicator */}
              <div className="flex items-center gap-1 px-6 py-4 border-b border-white/5 overflow-x-auto">
                {stepLabels.map((label, i) => {
                  const stepNum = (i + 1) as 1 | 2 | 3 | 4;
                  const isActive = step === stepNum;
                  const isComplete = step > stepNum;
                  return (
                    <div key={i} className="flex items-center">
                      <div className={`flex items-center gap-2 px-2 py-1 text-xs font-mono uppercase tracking-wider transition-colors ${
                        isActive ? 'text-aws-orange' :
                        isComplete ? 'text-emerald-400' :
                        'text-white/20'
                      }`}>
                        <span className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border ${
                          isActive ? 'border-aws-orange text-aws-orange' :
                          isComplete ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400' :
                          'border-white/10 text-white/20'
                        }`}>
                          {isComplete ? '✓' : stepNum}
                        </span>
                        <span className="hidden sm:inline">{label}</span>
                      </div>
                      {i < 3 && <ChevronRight size={14} className="text-white/10 mx-2" />}
                    </div>
                  );
                })}
              </div>

              {/* Step Content */}
              <div className="p-4 sm:p-8 min-h-[400px]">
                {step === 1 && (
                  <PassTypeSelector
                    passes={passes}
                    loading={passesLoading}
                    onSelect={handleSelectPass}
                  />
                )}

                {step === 2 && selectedPass && (
                  <div className="max-w-xl mx-auto">
                    <RegistrationForm
                      selectedPass={selectedPass}
                      initialData={attendeeData || undefined}
                      loading={false}
                      error={null}
                      onSubmit={handleAttendeeSubmit}
                      onBack={() => setStep(1)}
                    />
                  </div>
                )}

                {step === 3 && selectedPass && attendeeData && (
                  <div className="max-w-xl mx-auto">
                    <PaymentEmbed
                      selectedPass={selectedPass}
                      attendeeName={attendeeData.fullName}
                      loading={isSubmitting}
                      error={submitError}
                      onPaymentSubmitted={handlePaymentSubmitted}
                      onBack={() => setStep(2)}
                    />
                  </div>
                )}

                {step === 4 && submittedRecord && (
                  <div className="max-w-xl mx-auto text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={36} />
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 block mb-1 font-bold">
                        REGISTRATION FORM SUBMITTED
                      </span>
                      <h3 className="font-sans font-black italic text-2xl uppercase tracking-tight text-white">
                        Under Committee Inspection
                      </h3>
                      <p className="font-mono text-xs text-white/60 mt-2 max-w-md mx-auto">
                        An acknowledgment email with your <strong className="text-aws-orange">Application ID</strong> has been dispatched to <strong className="text-white">{submittedRecord.email}</strong>.
                      </p>
                    </div>

                    {/* Booking ID box */}
                    <div className="p-4 bg-[#111] border border-white/15 rounded-lg flex items-center justify-between text-left">
                      <div>
                        <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block font-bold">
                          Official Application / Reference ID
                        </span>
                        <span className="font-mono text-lg font-black text-aws-orange">
                          {submittedRecord.bookingId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyBookingId(submittedRecord.bookingId)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                      >
                        {copiedRef ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        {copiedRef ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    {/* Verification Notice Banner */}
                    <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-lg text-left text-xs font-mono text-amber-300">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <span className="text-base">⏳</span>
                        <span className="uppercase tracking-wider">Inspection & Verification in Progress</span>
                      </div>
                      <p className="text-[11px] text-amber-200/80 leading-relaxed">
                        Our committee will inspect your submitted payment reference (UTR: <strong className="text-white">{submittedRecord.transactionId}</strong>) within 24-48 hours. After inspection, we will confirm your registration and email your official Event Pass with Entry QR Code.
                      </p>
                    </div>

                    {/* Summary Card */}
                    <div className="p-4 bg-white/[0.02] border border-white/10 text-left font-mono text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/40">Participant:</span>
                        <span className="text-white font-bold">{submittedRecord.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Email:</span>
                        <span className="text-white font-bold">{submittedRecord.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Tier / Amount:</span>
                        <span className="text-aws-orange font-bold">₹{submittedRecord.amount} ({submittedRecord.ticketTier})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Submitted UTR:</span>
                        <span className="text-emerald-400 font-bold">{submittedRecord.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Status:</span>
                        <span className="text-amber-400 font-bold uppercase">Inspection Pending</span>
                      </div>
                    </div>

                    <p className="text-[11px] font-mono text-white/40 max-w-md mx-auto">
                      Once verified by our committee, your official ticket pass will be emailed to <strong className="text-white">{submittedRecord.email}</strong> and will be downloadable via the Track Status tab.
                    </p>

                    <div className="pt-2">
                      <a
                        href={GOOGLE_CALENDAR_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-aws-orange text-white text-xs font-mono uppercase tracking-wider transition-all"
                      >
                        <Calendar size={14} className="text-aws-orange" />
                        <span>Add date to Google Calendar</span>
                      </a>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTrackQuery(submittedRecord.bookingId);
                          setActiveTab('track');
                          performTrack(submittedRecord.bookingId);
                        }}
                        className="flex-1 py-3 bg-aws-orange text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors"
                      >
                        Track Ticket Status
                      </button>
                      <Link
                        to="/"
                        className="px-6 py-3 border border-white/20 text-white/60 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center"
                      >
                        Home
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Tracking View */}
          {activeTab === 'track' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="max-w-md mx-auto">
                <label className="block font-mono text-xs uppercase tracking-widest text-white/50 mb-2 font-bold text-left">
                  Enter Reference ID, 12-Digit UTR, or Registered Email:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    placeholder="e.g. AWS-SCD-829104 or 428901234567"
                    className="flex-1 bg-[#111] border border-white/20 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-aws-orange focus:outline-none font-mono"
                    onKeyDown={(e) => { if (e.key === 'Enter') performTrack(trackQuery); }}
                  />
                  <button
                    type="button"
                    onClick={() => performTrack(trackQuery)}
                    disabled={trackLoading || !trackQuery.trim()}
                    className="px-5 py-2.5 bg-aws-orange text-black font-mono text-xs uppercase font-bold hover:bg-white transition-colors flex items-center gap-1.5"
                  >
                    {trackLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                    Track
                  </button>
                </div>
              </div>

              {/* Result Area */}
              {trackLoading && (
                <div className="py-12 text-center">
                  <Loader2 size={32} className="animate-spin text-aws-orange mx-auto mb-2" />
                  <p className="font-mono text-xs text-white/40 uppercase tracking-widest">Searching records...</p>
                </div>
              )}

              {!trackLoading && trackSearched && !trackResult && (
                <div className="p-6 bg-white/[0.02] border border-white/10 text-center max-w-md mx-auto">
                  <AlertCircle size={32} className="text-f1-red mx-auto mb-2" />
                  <p className="font-sans font-bold text-white text-base">No Registration Found</p>
                  <p className="font-mono text-xs text-white/40 mt-1">
                    No matching booking found for "{trackQuery}". Please double check your 12-digit UTR, email, or Booking ID.
                  </p>
                </div>
              )}

              {!trackLoading && trackResult && (
                <div className="space-y-6 pt-2">
                  {/* Status Banner */}
                  {trackResult.status === 'APPROVED' && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 size={18} />
                        <span className="font-sans font-bold text-base uppercase">Registration Approved & Pass Issued!</span>
                      </div>
                      <p className="font-mono text-xs text-emerald-400/80">
                        Your payment has been verified. Present this pass at the gate on 01 Nov 2026 for 1-time check-in.
                      </p>
                    </div>
                  )}

                  {trackResult.status === 'UNDER_SURVEILLANCE' && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle size={18} />
                        <span className="font-sans font-bold text-base uppercase">Verification In Progress</span>
                      </div>
                      <p className="font-mono text-xs text-amber-400/80">
                        Your payment reference is under administrative review. Pass will become available here once approved.
                      </p>
                    </div>
                  )}

                  {trackResult.status === 'REJECTED' && (
                    <div className="p-4 bg-f1-red/10 border border-f1-red/30 text-f1-red rounded-lg text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle size={18} />
                        <span className="font-sans font-bold text-base uppercase">Verification Rejected</span>
                      </div>
                      <p className="font-mono text-xs text-f1-red/80 mb-2">
                        Reason: {trackResult.rejectionReason || 'The submitted UPI transaction reference could not be verified.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('book'); setStep(1); }}
                        className="px-4 py-2 bg-f1-red text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-white hover:text-black transition-colors"
                      >
                        Re-Submit with Correct UTR
                      </button>
                    </div>
                  )}

                  {/* If Approved, show the official pass */}
                  {trackResult.status === 'APPROVED' && (
                    <div className="pt-2">
                      <OfficialTicketPass registration={trackResult} showActions={true} />
                    </div>
                  )}

                  {/* Details Card */}
                  <div className="p-5 bg-[#111] border border-white/10 text-left font-mono text-xs space-y-2.5 max-w-lg mx-auto">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40 uppercase">Booking Reference:</span>
                      <span className="text-aws-orange font-bold">{trackResult.bookingId}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40 uppercase">Participant:</span>
                      <span className="text-white font-bold">{trackResult.fullName}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40 uppercase">College:</span>
                      <span className="text-white font-bold text-right max-w-[240px] truncate">{trackResult.collegeName}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40 uppercase">PRN / Roll No:</span>
                      <span className="text-white font-bold">{trackResult.prnRollNo}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40 uppercase">Submitted UTR:</span>
                      <span className="text-white font-bold">{trackResult.transactionId}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40 uppercase">Ticket Tier:</span>
                      <span className="text-aws-orange font-bold">₹{trackResult.amount} ({trackResult.ticketTier})</span>
                    </div>
                    {trackResult.ticketCode && (
                      <div className="flex justify-between pt-1">
                        <span className="text-white/40 uppercase">Ticket Pass Code:</span>
                        <span className="text-emerald-400 font-bold">{trackResult.ticketCode}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
