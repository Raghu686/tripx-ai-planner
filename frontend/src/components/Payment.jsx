import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Defusing strict redirects allowing ErrorBoundary or graceful fallbacks to catch instead
  }, [state, navigate]);

  if (!state || !state.route) return null;

  const handlePaid = () => {
    // Proceed to Ticket Generation with the fully enriched state
    // We navigate using route ID to match previous URL structures, though payload sits in memory
    navigate(`/ticket/${state.route.id}`, { state });
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 bg-darkBg text-white flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-darkBg to-darkBg pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl grid md:grid-cols-2 gap-8 glass-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-white/5 md:w-[2px] md:h-full z-0 block"></div>

        {/* Left Side: Summary */}
        <div className="relative z-10 flex flex-col justify-center space-y-8 pr-0 md:pr-8">
          <div>
            <h2 className="text-3xl font-black uppercase text-white mb-2 tracking-tight">Checkout Protocol</h2>
            <p className="text-cyan-400 font-bold tracking-widest text-sm uppercase">Please verify your routing details</p>
          </div>

          <div className="space-y-4 bg-black/40 p-6 rounded-3xl border border-white/5 text-sm uppercase tracking-widest font-bold">
             <div className="flex justify-between border-b border-white/5 pb-4">
                <span className="text-gray-500">Journey</span>
                <span className="text-white text-right">{state.queryData.source} <span className="text-cyan-500 mx-1">→</span> {state.queryData.destination}</span>
             </div>
             <div className="flex justify-between border-b border-white/5 pb-4">
                <span className="text-gray-500">Transport Node</span>
                <span className="text-cyan-400">{state.route.vehicleName}</span>
             </div>
             <div className="flex justify-between border-b border-white/5 pb-4">
                <span className="text-gray-500">Selected Coordinate(s)</span>
                <span className="text-white bg-cyan-900/50 px-3 py-1 rounded border border-cyan-500/30">Seats: {state.selectedSeats.join(', ')}</span>
             </div>
             <div className="flex justify-between border-b border-white/5 pb-4">
                <span className="text-gray-500">Net Distance</span>
                <span className="text-white">{state.route.distance} KM</span>
             </div>
             <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500 flex flex-col">
                  <span>Total Obligation</span>
                  <span className="text-[10px] text-cyan-500/50">{state.ticketCount} Ticket(s) × ₹{state.route.price}</span>
                </span>
                <span className="text-3xl text-cyan-400 glow-text">₹{state.route.price * state.ticketCount}</span>
             </div>
          </div>
        </div>

        {/* Right Side: Payment Portal */}
        <div className="relative z-10 flex flex-col items-center justify-center pl-0 md:pl-8">
           <div className="w-full bg-white text-black p-8 rounded-3xl shadow-[0_0_40px_rgba(34,211,238,0.2)] border flex flex-col items-center text-center">
              <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full uppercase tracking-widest font-black text-xs mb-6 flex items-center border border-green-300">
                <ShieldCheck className="w-4 h-4 mr-2" /> Secured Gateway
              </div>
              
              <h3 className="text-xl tracking-tight font-black uppercase mb-6">Scan QR to Transfer</h3>
              
              {/* CSS Generated QR placeholder logic to avoid external dependencies */}
              <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 p-2 relative overflow-hidden flex items-center justify-center rounded-xl mb-6 mask-qr">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
                 <div className="absolute top-2 left-2 w-10 h-10 border-[6px] border-black rounded"></div>
                 <div className="absolute top-2 right-2 w-10 h-10 border-[6px] border-black rounded"></div>
                 <div className="absolute bottom-2 left-2 w-10 h-10 border-[6px] border-black rounded"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1 flex-wrap w-24 h-24">
                    {Array.from({length: 36}).map((_, i) => (
                      <div key={i} className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black rounded-sm' : 'bg-transparent'}`}></div>
                    ))}
                 </div>
                 {/* Scanning Bar Animation Overlay */}
                 <motion.div 
                   animate={{ top: ['0%', '100%', '0%'] }}
                   transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                   className="absolute left-0 w-full h-[2px] bg-red-500 shadow-[0_0_10px_red]"
                 ></motion.div>
              </div>

              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8">
                Strictly await processing after payment confirms on your mobile device.
              </p>

              <button 
                onClick={handlePaid}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center transition-all hover:scale-[1.02]"
              >
                 <Zap className="w-5 h-5 mr-3" /> I Have Paid
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
