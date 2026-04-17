import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WelcomeScreen({ onComplete }) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setSubmitted(true);
      // Wait for greeting animation to finish before mapping back
      setTimeout(() => {
        onComplete(name.trim());
      }, 3500); 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-darkBg flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-md w-full px-6"
          >
            <h2 className="text-3xl md:text-4xl text-gray-200 mb-8 font-light tracking-wider text-center drop-shadow-md">
              Before we begin your journey...
            </h2>
            <form onSubmit={handleSubmit} className="w-full flex-col flex gap-6">
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name" 
                className="w-full bg-black/50 border-b-2 border-primary/50 text-white text-xl md:text-2xl py-4 px-2 text-center outline-none focus:border-cyan-400 focus:bg-black/80 transition-all placeholder:text-gray-600 rounded-t-lg"
                autoFocus
                required
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-cyan-500 text-white py-3 px-8 rounded-full font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.7)]"
              >
                Begin
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="flex items-center justify-center text-center"
          >
            <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tight text-white drop-shadow-[0_0_40px_rgba(34,211,238,0.8)] glow-text">
              Welcome, <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{name}</span>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-darkBg to-darkBg pointer-events-none -z-10"></div>
    </div>
  );
}
