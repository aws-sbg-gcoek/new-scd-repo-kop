import React from 'react';
import { motion } from 'motion/react';
import type { PassType } from '../hooks/usePassTypes';
import UpiPaymentCard from '../../../components/UpiPaymentCard';

interface Props {
  selectedPass: PassType;
  attendeeName?: string;
  loading: boolean;
  error: string | null;
  onPaymentSubmitted: (utrNumber: string, screenshotBase64?: string, screenshotName?: string) => void;
  onBack: () => void;
}

export function PaymentEmbed({
  selectedPass,
  attendeeName,
  loading,
  error,
  onPaymentSubmitted,
  onBack,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Tier & Fee Banner */}
      <div className="p-4 border border-white/10 bg-[#0d0d0d] flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="w-2.5 h-10 shrink-0" style={{ backgroundColor: selectedPass.badge_color }} />
          <div>
            <span className="font-mono text-[9px] text-aws-orange uppercase tracking-widest block font-bold">
              TICKET TIER SELECTED
            </span>
            <h3 className="font-sans font-black italic text-lg uppercase text-white tracking-tight">
              {selectedPass.name}
            </h3>
            {attendeeName && (
              <p className="font-mono text-[10px] text-white/50">Attendee: {attendeeName}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block">
            TOTAL PAYABLE
          </span>
          <span className="font-mono text-2xl font-black text-emerald-400">
            ₹{selectedPass.price}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 border border-f1-red/30 bg-f1-red/10 text-f1-red text-xs font-mono">
          {error}
        </div>
      )}

      {/* Proven UPI Payment Component from Commity Day */}
      <UpiPaymentCard
        amount={selectedPass.price}
        payeeName="Anas Pathan"
        upiId="pathananas2007@oksbi"
        transactionNote="AWS SCD 2026 Ticket"
        onPaymentDone={(utr, ssBase64, ssName) => {
          onPaymentSubmitted(utr, ssBase64, ssName);
        }}
      />

      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors"
        >
          ← Back to Details
        </button>
      </div>
    </motion.div>
  );
}
