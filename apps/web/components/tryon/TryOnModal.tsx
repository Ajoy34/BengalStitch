'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoUpload } from './PhotoUpload';
import { WebcamCapture } from './WebcamCapture';
import { ProcessingAnimation } from './ProcessingAnimation';
import { TryOnResult } from './TryOnResult';

type Step = 'choose' | 'upload' | 'webcam' | 'processing' | 'result' | 'error';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  garmentUrl: string;
  productTitle: string;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export function TryOnModal({ isOpen, onClose, garmentUrl, productTitle }: Props) {
  const [step, setStep] = useState<Step>('choose');
  const [direction, setDirection] = useState(1);
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('choose');
        setPersonFile(null);
        setPersonPreview('');
        setResultImage('');
        setErrorMsg('');
      }, 300);
    }
  }, [isOpen]);

  const goTo = useCallback((next: Step) => {
    const order: Step[] = ['choose', 'upload', 'webcam', 'processing', 'result', 'error'];
    setDirection(order.indexOf(next) > order.indexOf(step) ? 1 : -1);
    setStep(next);
  }, [step]);

  const handleImageSelected = useCallback(
    (file: File, preview: string) => {
      setPersonFile(file);
      setPersonPreview(preview);
      goTo('processing');
      startTryOn(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [garmentUrl]
  );

  async function startTryOn(file: File) {
    try {
      const formData = new FormData();
      formData.append('person_image', file);
      formData.append('garment_url', garmentUrl);
      formData.append('category', 'tops');

      const res = await fetch('/api/tryon', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Try-on failed');

      await pollResult(data.id);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      goTo('error');
    }
  }

  async function pollResult(predictionId: string) {
    const maxAttempts = 60;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 2000));

      try {
        const res = await fetch(`/api/tryon/${predictionId}`);
        const data = await res.json();

        if (data.status === 'succeeded' && data.output) {
          const outputUrl = Array.isArray(data.output) ? data.output[0] : data.output;
          setResultImage(outputUrl);
          goTo('result');
          return;
        }

        if (data.status === 'failed') {
          throw new Error(data.error || 'Try-on generation failed');
        }
      } catch (err) {
        if (i === maxAttempts - 1) {
          setErrorMsg(err instanceof Error ? err.message : 'Timed out waiting for result');
          goTo('error');
        }
      }
    }
  }

  function handleSave() {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = `bengalstitch-tryon-${Date.now()}.jpg`;
    a.click();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-lg">Virtual Try-On</h2>
                <p className="text-xs text-gray-500">{productTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content with step animations */}
            <div className="p-5 min-h-[500px] overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                {step === 'choose' && (
                  <motion.div
                    key="choose"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="space-y-4"
                  >
                    <p className="text-center text-sm text-gray-600">
                      Upload a full-body photo to see how this looks on you
                    </p>

                    <motion.button
                      onClick={() => goTo('upload')}
                      className="w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-4 group"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Upload Photo</p>
                        <p className="text-xs text-gray-500">Choose from your gallery</p>
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={() => goTo('webcam')}
                      className="w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-4 group"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Use Camera</p>
                        <p className="text-xs text-gray-500">Take a photo with your webcam</p>
                      </div>
                    </motion.button>

                    {/* Tips */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-600">Tips for best results:</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">&#9679;</span>
                          Use a clear, well-lit full-body photo
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">&#9679;</span>
                          Stand facing the camera directly
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">&#9679;</span>
                          Plain background works best
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {step === 'upload' && (
                  <motion.div
                    key="upload"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <button
                      onClick={() => goTo('choose')}
                      className="mb-4 text-sm text-gray-500 hover:text-primary flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <PhotoUpload onImageSelected={handleImageSelected} />
                  </motion.div>
                )}

                {step === 'webcam' && (
                  <motion.div
                    key="webcam"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <WebcamCapture
                      onCapture={handleImageSelected}
                      onCancel={() => goTo('choose')}
                    />
                  </motion.div>
                )}

                {step === 'processing' && (
                  <motion.div
                    key="processing"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <ProcessingAnimation personPreview={personPreview} garmentUrl={garmentUrl} />
                  </motion.div>
                )}

                {step === 'result' && (
                  <motion.div
                    key="result"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <TryOnResult
                      personImage={personPreview}
                      resultImage={resultImage}
                      onSave={handleSave}
                      onRetry={() => {
                        setPersonFile(null);
                        setPersonPreview('');
                        setResultImage('');
                        goTo('choose');
                      }}
                    />
                  </motion.div>
                )}

                {step === 'error' && (
                  <motion.div
                    key="error"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex flex-col items-center justify-center min-h-[400px] gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center"
                    >
                      <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </motion.div>
                    <p className="text-sm text-gray-600 text-center max-w-xs">{errorMsg}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => goTo('choose')}
                        className="px-6 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm hover:bg-gray-50 transition-colors"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl gradient-cta font-semibold text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
