import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Props {
  onScan: (token: string) => void;
  enabled: boolean;
}

export function QRScanner({ onScan, enabled }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScanRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback((decodedText: string) => {
    const now = Date.now();
    // 800ms debounce to prevent double-scan while still feeling instant
    if (now - lastScanRef.current < 800) return;
    lastScanRef.current = now;
    onScan(decodedText);
  }, [onScan]);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const scanner = new Html5Qrcode('qr-scanner-container', {
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true,
      },
    });
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      {
        fps: 30,
        qrbox: { width: 300, height: 300 },
        aspectRatio: 1,
      },
      handleScan,
      () => {} // Ignore scan failures
    ).catch((err) => {
      console.error('[Scanner]', err);
      setError('Camera access denied or not available. Please allow camera access.');
    });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [enabled, handleScan]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        id="qr-scanner-container"
        ref={containerRef}
        className="w-full aspect-square bg-black/50 border border-white/10 overflow-hidden"
      />
      {error && (
        <p className="mt-3 text-f1-red text-xs font-mono text-center">{error}</p>
      )}
    </div>
  );
}
