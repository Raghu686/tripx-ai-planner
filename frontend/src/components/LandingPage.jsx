import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plane, Hexagon, Network } from 'lucide-react';

export default function LandingPage({ userName }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-darkBg overflow-hidden">
      {/* High-tech ambient background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-cyan-600 rounded-full mix-blend-screen filter blur-[200px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-800 rounded-full mix-blend-screen filter blur-[200px] opacity-30"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="z-10 text-center px-4 flex flex-col items-center"
      >
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6 flex items-center justify-center space-x-2 text-cyan-400 font-bold tracking-widest uppercase text-sm border border-cyan-500/30 px-6 py-2 rounded-full glass-card">
           <Hexagon className="w-4 h-4 mr-2" /> V2 System Online
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-8xl font-black mb-6 tracking-tight text-white drop-shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {userName}'s Journey, <br className="hidden md:block"/>
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent glow-text">AI-Optimized</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-2xl text-cyan-100/70 font-light mb-12 max-w-3xl mx-auto tracking-wide leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Initialize your destination matrix. Experience a fluid calculation of time, cost, and absolute comfort.
        </motion.p>

        <motion.button
          onClick={() => navigate('/book')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="group relative inline-flex items-center justify-center px-10 py-5 font-black tracking-widest uppercase text-white transition-all duration-300 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_40px_rgba(34,211,238,0.5)] border border-cyan-400/50 overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12"></span>
          <span className="relative z-10 flex items-center">
            Plan Route <Plane className="ml-4 w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300" />
          </span>
        </motion.button>
      </motion.div>

      {/* Cyberpunk grid bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-cyan-900/40 to-transparent pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg)', transformOrigin: 'bottom' }}></div>
      
      {/* Floating decorative nodes */}
      <motion.div className="absolute left-20 bottom-32 text-cyan-500/30 hidden md:block" animate={{ y: [0, -30, 0], rotate: [0, 90, 0] }} transition={{ duration: 6, repeat: Infinity }}>
        <Network size={64} />
      </motion.div>
    </div>
  );
}
