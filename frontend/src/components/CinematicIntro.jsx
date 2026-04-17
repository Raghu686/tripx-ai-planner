import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import introVideo from '../assets/video/intro.mp4';

export default function CinematicIntro({ onComplete }) {
  const [showBranding, setShowBranding] = useState(false);

  const handleVideoEnd = () => {
    setShowBranding(true);
    setTimeout(() => {
      onComplete();
    }, 3500); 
  };

  useEffect(() => {
    const backupTimer = setTimeout(() => {
       if (!showBranding) {
         handleVideoEnd();
       }
    }, 15000); 
    return () => clearTimeout(backupTimer);
  }, [showBranding]);

  return (
    <div className="fixed inset-0 z-[90] bg-black flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {!showBranding ? (
          <motion.div
            key="video-sequence"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-black"
          >
            <video 
               src={introVideo} 
               autoPlay 
               muted 
               playsInline 
               onEnded={handleVideoEnd}
               onError={handleVideoEnd}
               className="w-full h-full object-cover opacity-80"
            />
          </motion.div>
        ) : (
          <motion.div
            key="final-branding"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="flex flex-col items-center justify-center text-center space-y-6"
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]"
            >
              TripX
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-xl md:text-3xl font-light tracking-widest text-cyan-100/80"
            >
              Plan Smart. Travel Better.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
