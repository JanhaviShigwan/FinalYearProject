import React, { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ScanLine, X, AlertCircle, QrCode } from 'lucide-react';
import API_URL from '../../api';
import { getAdminRequestConfig } from '../../utils/adminAuth';

export default function AdminQRScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const isProcessingRef = useRef(false);

  // â”€â”€ Stop camera & scan loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const stopScanner = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScanning(false);
    isProcessingRef.current = false;
  }, []);

  // â”€â”€ Scan loop â€” runs on every animation frame â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const scanLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    const { videoWidth: w, videoHeight: h } = video;
    if (!w || !h) {
      rafRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0, w, h);
    const imageData = ctx.getImageData(0, 0, w, h);
    const code = jsQR(imageData.data, w, h, { inversionAttempts: 'dontInvert' });

    if (code && code.data && !isProcessingRef.current) {
      isProcessingRef.current = true;
      handleQRFound(code.data);
      return; // don't schedule next frame â€” handleQRFound stops the scanner
    }

    rafRef.current = requestAnimationFrame(scanLoop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // â”€â”€ Handle a decoded QR string â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleQRFound = useCallback(async (decodedText) => {
    stopScanner();
    setApiLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        `${API_URL}/attendance/mark`,
        { qrData: decodedText },
        getAdminRequestConfig()
      );
      setResult({
        type: 'success',
        message: 'Attendance Marked!',
        detail: `${res.data.studentName} â€” ${res.data.eventName}`,
        time: res.data.attendanceTime
          ? new Date(res.data.attendanceTime).toLocaleTimeString('en-IN', {
              hour: '2-digit', minute: '2-digit', hour12: true,
            })
          : null,
      });
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      if (status === 409) {
        const at = err.response?.data?.attendanceTime;
        setResult({
          type: 'already',
          message: 'Already Marked',
          detail: `${err.response?.data?.studentName || ''} â€” ${err.response?.data?.eventName || ''}`,
          time: at ? new Date(at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : null,
        });
      } else if (status === 404) {
        setResult({ type: 'error', message: 'Not Registered', detail: msg });
      } else {
        setResult({ type: 'error', message: 'Error', detail: msg });
      }
    } finally {
      setApiLoading(false);
      isProcessingRef.current = false;
    }
  }, [stopScanner]);

  // â”€â”€ Start camera + scan loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const startScanner = useCallback(async () => {
    if (streamRef.current) return;
    setCameraError('');
    setResult(null);
    isProcessingRef.current = false;

    // Try rear camera first, fall back to any camera
    const constraints = [
      { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } },
      { video: true },
    ];

    let stream = null;
    for (const c of constraints) {
      try {
        stream = await navigator.mediaDevices.getUserMedia(c);
        break;
      } catch {
        // try next constraint
      }
    }

    if (!stream) {
      setCameraError('Could not access camera. Please allow camera permission and try again.');
      return;
    }

    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play().catch(() => {});
    }

    setScanning(true);
    rafRef.current = requestAnimationFrame(scanLoop);
  }, [scanLoop]);

  // â”€â”€ Cleanup on unmount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => () => stopScanner(), [stopScanner]);

  const resultStyles = {
    success: { bg: 'bg-pastel-green/20', border: 'border-pastel-green/40', Icon: CheckCircle2, iconColor: 'text-deep-slate', label: 'text-deep-slate' },
    already: { bg: 'bg-lavender/15', border: 'border-lavender/30', Icon: AlertCircle, iconColor: 'text-lavender', label: 'text-lavender' },
    error: { bg: 'bg-soft-blush/80', border: 'border-coral/30', Icon: AlertCircle, iconColor: 'text-coral', label: 'text-coral' },
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3">
        <ScanLine className="w-6 h-6 text-lavender" />
        <div>
          <h2 className="text-2xl font-extrabold text-deep-slate">Scan Attendance</h2>
          <p className="text-sm text-deep-slate/50 mt-0.5">Scan a student's QR code to mark attendance</p>
        </div>
      </div>

      {/* Camera error */}
      {cameraError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {cameraError}
        </div>
      )}

      {/* Scanner card */}
      <div className="bg-white rounded-2xl border border-soft-blush shadow-sm">

        {/* Viewfinder */}
        <div className="relative bg-black rounded-t-2xl overflow-hidden" style={{ minHeight: '340px' }}>

          {/* Native <video> element â€” no library touching the DOM */}
          <video
            ref={videoRef}
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ display: scanning ? 'block' : 'none', maxHeight: '420px' }}
          />

          {/* Hidden canvas used for per-frame QR decoding */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Idle placeholder */}
          {!scanning && !apiLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <QrCode className="w-16 h-16 text-white/20" />
              <p className="text-sm text-white/50 font-medium">Press Start to open camera</p>
            </div>
          )}

          {/* API loading spinner */}
          {apiLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-lavender border-t-transparent animate-spin" />
                <p className="text-sm font-semibold text-white/80">Verifyingâ€¦</p>
              </div>
            </div>
          )}

          {/* Decorative scan-box overlay */}
          {scanning && !apiLoading && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Dark surround */}
              <div className="absolute inset-0 bg-black/30" />
              {/* Transparent scan window */}
              <div
                className="relative z-10 bg-transparent"
                style={{ width: '260px', height: '260px', boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)' }}
              >
                {/* Corner brackets */}
                <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-lavender rounded-tl-lg" />
                <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-lavender rounded-tr-lg" />
                <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-lavender rounded-bl-lg" />
                <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-lavender rounded-br-lg" />
                {/* Scanning line animation */}
                <div
                  className="absolute left-0 right-0 h-0.5 bg-lavender/70"
                  style={{ animation: 'scanline 2s linear infinite', top: '0px' }}
                />
              </div>
              <p className="absolute bottom-5 left-0 right-0 text-center text-xs text-white/70 font-medium">
                Align QR code within the frame
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-5 border-t border-soft-blush">
          {!scanning ? (
            <button
              onClick={startScanner}
              disabled={apiLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-lavender text-white font-bold text-sm hover:bg-lavender/85 transition-colors disabled:opacity-50"
            >
              <ScanLine className="w-4 h-4" />
              Start Scanner
            </button>
          ) : (
            <button
              onClick={stopScanner}
              disabled={apiLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-coral/10 border border-coral/30 text-coral font-bold text-sm hover:bg-coral hover:text-white transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Stop Scanner
            </button>
          )}
        </div>
      </div>

      {/* Result card */}
      <AnimatePresence>
        {result && (
          <motion.div
            key={`${result.type}-${result.detail}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
            className={`rounded-2xl border px-5 py-5 ${resultStyles[result.type].bg} ${resultStyles[result.type].border}`}
          >
            <div className="flex items-start gap-3">
              {React.createElement(resultStyles[result.type].Icon, {
                className: `w-5 h-5 mt-0.5 shrink-0 ${resultStyles[result.type].iconColor}`,
              })}
              <div className="flex-1 min-w-0">
                <p className={`font-extrabold text-base ${resultStyles[result.type].label}`}>{result.message}</p>
                {result.detail && <p className="text-sm text-deep-slate/70 mt-1 font-medium">{result.detail}</p>}
                {result.time && <p className="text-xs text-deep-slate/45 mt-1">Time: {result.time}</p>}
              </div>
              <button onClick={() => setResult(null)} className="p-1 rounded-lg hover:bg-black/5 shrink-0">
                <X className="w-4 h-4 text-deep-slate/40" />
              </button>
            </div>
            <button
              onClick={() => { setResult(null); startScanner(); }}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-lavender/30 bg-white/60 text-lavender text-sm font-bold hover:bg-lavender hover:text-white transition-colors"
            >
              <ScanLine className="w-4 h-4" />
              Scan Next
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanline keyframe */}
      <style>{`
        @keyframes scanline {
          0%   { top: 0px; opacity: 1; }
          50%  { opacity: 0.6; }
          100% { top: 256px; opacity: 1; }
        }
      `}</style>

      {/* How-to */}
      <div className="rounded-2xl border border-soft-blush bg-white px-5 py-4 text-sm text-deep-slate/60 space-y-1.5">
        <p className="font-bold text-deep-slate/80 text-xs uppercase tracking-wider">How it works</p>
        <p>1. Press <span className="font-semibold text-lavender">Start Scanner</span> and allow camera access.</p>
        <p>2. Hold the student's QR code steady inside the frame.</p>
        <p>3. Attendance is automatically marked once the QR is detected.</p>
        <p>4. Each student can only be marked <span className="font-semibold text-deep-slate">once per event</span>.</p>
      </div>

    </div>
  );
}

