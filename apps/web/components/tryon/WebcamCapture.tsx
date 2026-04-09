'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onCapture: (file: File, previewUrl: string) => void;
  onCancel: () => void;
}

export function WebcamCapture({ onCapture, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: 720, height: 960 } })
      .then((s) => {
        if (!mounted) { s.getTracks().forEach((t) => t.stop()); return; }
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setError('Camera access denied. Please allow camera permissions.'));

    return () => { mounted = false; stream?.getTracks().forEach((t) => t.stop()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCountdown = useCallback(() => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCaptured(dataUrl);
  }, []);

  const confirmCapture = useCallback(() => {
    if (!captured) return;
    fetch(captured)
      .then((r) => r.blob())
      .then((blob) => {
        const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
        onCapture(file, captured);
      });
  }, [captured, onCapture]);

  return (
    <div className="space-y-4">
      {error ? (
        <div className="aspect-[3/4] max-h-[400px] mx-auto rounded-2xl bg-gray-100 flex items-center justify-center p-6 text-center">
          <div>
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500">{error}</p>
            <button onClick={onCancel} className="mt-3 text-primary text-sm font-semibold hover:underline">
              Use photo upload instead
            </button>
          </div>
        </div>
      ) : (
        <div className="relative aspect-[3/4] max-h-[400px] mx-auto rounded-2xl overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            {captured ? (
              <motion.img
                key="captured"
                src={captured}
                alt="Captured"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full object-cover"
              />
            ) : (
              <motion.video
                key="video"
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                key={countdown}
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-8xl font-extrabold text-white drop-shadow-2xl">{countdown}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Body guide overlay */}
          {!captured && countdown === null && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <svg className="w-full h-full" viewBox="0 0 300 400" fill="none">
                <motion.ellipse
                  cx="150" cy="80" rx="40" ry="50"
                  stroke="white" strokeWidth="1" strokeDasharray="4 4"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.path
                  d="M110 130 Q80 160 70 250 L90 380 M190 130 Q220 160 230 250 L210 380"
                  stroke="white" strokeWidth="1" strokeDasharray="4 4"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </svg>
            </motion.div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <div className="flex gap-3">
        {captured ? (
          <>
            <button
              onClick={() => setCaptured(null)}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Retake
            </button>
            <motion.button
              onClick={confirmCapture}
              className="flex-1 py-3 rounded-xl gradient-cta font-semibold"
              whileTap={{ scale: 0.97 }}
            >
              Use This Photo
            </motion.button>
          </>
        ) : (
          <>
            <button onClick={onCancel} className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <motion.button
              onClick={startCountdown}
              disabled={!stream || countdown !== null}
              className="flex-1 py-3 rounded-xl gradient-cta font-semibold disabled:opacity-50"
              whileTap={{ scale: 0.97 }}
            >
              {countdown !== null ? `${countdown}...` : 'Take Photo'}
            </motion.button>
          </>
        )}
      </div>
    </div>
  );
}
