import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { findRegistrationAsync, StudentRegistration } from '../../../utils/registrationStore';
import OfficialTicketPass from '../../../components/OfficialTicketPass';

export function TicketPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<StudentRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    let isMounted = true;
    findRegistrationAsync(id)
      .then((res) => {
        if (!isMounted) return;
        if (res) {
          setTicket(res);
        } else {
          setError('Ticket registration not found.');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Error loading ticket');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Loader2 size={32} className="animate-spin text-aws-orange mb-4" />
        <p className="font-mono text-sm text-white/50 tracking-widest uppercase">
          Loading Pass...
        </p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-4">
        <AlertCircle size={48} className="text-f1-red mb-4" />
        <p className="font-sans font-black italic text-2xl uppercase text-white mb-2">Ticket Not Found</p>
        <p className="font-mono text-xs text-white/40 mb-6">{error || 'No matching record exists for this ticket.'}</p>
        <Link to="/ticket" className="px-6 py-2.5 bg-aws-orange text-black font-mono text-xs uppercase font-bold tracking-widest hover:bg-white transition-colors">
          Return to Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white/30 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors">
          <ArrowLeft size={14} /> Back to Event
        </Link>
        <Link to="/ticket?tab=track" className="text-xs font-mono text-aws-orange hover:text-white transition-colors uppercase tracking-widest">
          Track another ticket
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-4xl space-y-6">
          {ticket.status === 'APPROVED' ? (
            <OfficialTicketPass registration={ticket} showActions={true} />
          ) : ticket.status === 'UNDER_SURVEILLANCE' ? (
            <div className="p-8 bg-[#0d0d0d] border border-amber-500/30 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                <Loader2 size={24} className="animate-spin" />
              </div>
              <h3 className="font-sans font-black italic text-2xl uppercase text-white">Verification in Progress</h3>
              <p className="font-mono text-xs text-white/50">
                Your payment reference ({ticket.transactionId}) is being verified by event organizers.
              </p>
            </div>
          ) : (
            <div className="p-8 bg-[#0d0d0d] border border-f1-red/30 text-center max-w-lg mx-auto space-y-4">
              <AlertCircle size={36} className="text-f1-red mx-auto" />
              <h3 className="font-sans font-black italic text-2xl uppercase text-white">Verification Rejected</h3>
              <p className="font-mono text-xs text-white/50">
                {ticket.rejectionReason || 'The submitted UPI transaction reference could not be matched.'}
              </p>
              <Link to="/ticket" className="inline-block px-5 py-2.5 bg-f1-red text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors">
                Re-Submit Registration
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
