import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ChevronRight, Users } from 'lucide-react';

export default function SeatSelection() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [ticketCount, setTicketCount] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [matrix, setMatrix] = useState([]);

  useEffect(() => {
    // Silencing automatic redirects - let ErrorBoundary handle missing states if they occur
    if (!state || !state.route) return;

    const type = state.route.type;
    let newMatrix = [];

    // Seed Randomizer logic to keep booked seats consistent per session
    const deterministicRandom = () => Math.random() > 0.65; // ~35% booked

    if (type === 'Bus') {
      for (let r = 1; r <= 10; r++) {
         newMatrix.push([
           { id: `L${r}-1`, booked: deterministicRandom() },
           { id: `L${r}-2`, booked: deterministicRandom() },
           { id: 'AISLE', type: 'gap' },
           { id: `R${r}-1`, booked: deterministicRandom() },
           { id: `R${r}-2`, booked: deterministicRandom() }
         ]);
      }
    } else if (type === 'Train') {
      for (let r = 1; r <= 9; r++) {
        newMatrix.push([
           { id: `${r}L`, label: 'Lower', booked: deterministicRandom() },
           { id: `${r}M`, label: 'Mid', booked: deterministicRandom() },
           { id: `${r}U`, label: 'Upper', booked: deterministicRandom() },
           { id: 'AISLE', type: 'gap' },
           { id: `${r}SL`, label: 'SideL', booked: deterministicRandom() },
           { id: `${r}SU`, label: 'SideU', booked: deterministicRandom() }
        ]);
      }
    } else if (type === 'Flight') {
      const cols = ['A','B','C','GAP','D','E','F'];
      for (let r = 1; r <= 12; r++) {
         const rowData = cols.map(c => c === 'GAP' ? { id: 'AISLE', type: 'gap' } : { id: `${r}${c}`, booked: deterministicRandom() });
         newMatrix.push(rowData);
      }
    }
    setMatrix(newMatrix);
  }, [state, navigate]);

  if (!state || !state.route) return null;

  const handleSeatClick = (seat) => {
    if (seat.booked || seat.type === 'gap') return;

    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat.id));
    } else {
      if (selectedSeats.length < ticketCount) {
        setSelectedSeats([...selectedSeats, seat.id]);
      }
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length !== ticketCount) return;
    navigate('/payment', { state: { ...state, selectedSeats, ticketCount } });
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 bg-darkBg text-white flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl glass-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden min-h-[600px] flex flex-col"
      >
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
           <ShieldCheck className="w-64 h-64 text-cyan-400" />
        </div>

        <div className="mb-10 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-2 glow-text">
            {state.route.vehicleName}
          </h2>
          <p className="text-cyan-400 font-bold tracking-widest uppercase text-sm border border-cyan-500/30 px-4 py-1 rounded-full inline-block bg-cyan-900/40">
            {state.route.type} Control Matrix
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!ticketCount ? (
            <motion.div 
              key="ticket-count"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="flex-1 flex flex-col items-center justify-center relative z-10"
            >
               <Users className="w-16 h-16 text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
               <h3 className="text-2xl font-black tracking-widest uppercase mb-8">How many tickets do you want?</h3>
               <div className="flex gap-4">
                  {[1, 2, 3, 4].map(num => (
                    <button 
                      key={num}
                      onClick={() => setTicketCount(num)}
                      className="w-16 h-16 md:w-20 md:h-20 bg-black/50 border-2 border-cyan-500/30 text-white rounded-2xl text-2xl font-black shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all transform hover:scale-110"
                    >
                      {num}
                    </button>
                  ))}
               </div>
            </motion.div>
          ) : (
            <motion.div 
              key="seat-matrix"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col w-full relative z-10"
            >
              {/* Dynamic Key / Legend */}
              <div className="flex flex-wrap justify-center space-x-6 mb-8 text-xs font-bold tracking-widest uppercase">
                <div className="flex items-center mb-2"><div className="w-4 h-4 bg-black/50 border border-white/20 rounded mr-2"></div> Available</div>
                <div className="flex items-center mb-2"><div className="w-4 h-4 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] rounded mr-2"></div> Selected</div>
                <div className="flex items-center mb-2"><div className="w-4 h-4 bg-red-900/50 border border-red-500/30 rounded mr-2"></div> Booked</div>
              </div>

              {/* Status Message */}
              <div className="text-center mb-8">
                 <p className="text-xl tracking-widest uppercase font-black text-cyan-400">
                   {selectedSeats.length < ticketCount 
                      ? `Select ${ticketCount - selectedSeats.length} more seat${ticketCount - selectedSeats.length > 1 ? 's' : ''}`
                      : 'Target Coordinates Locked'}
                 </p>
              </div>

              {/* Seat Matrix Render */}
              <div className="relative max-w-md w-full mx-auto bg-black/40 border border-cyan-500/20 p-6 md:p-8 rounded-[3rem] shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] flex-1 overflow-y-auto mb-8">
                <div className="flex flex-col gap-4">
                  {matrix.map((row, rIdx) => (
                    <div key={rIdx} className="flex justify-between items-center w-full">
                       {row.map((seat, sIdx) => {
                          if (seat.type === 'gap') {
                             return <div key={`gap-${rIdx}-${sIdx}`} className="w-6 md:w-12 text-center text-[10px] text-gray-700 font-bold tracking-widest opacity-50 select-none"></div>;
                          }
                          
                          const isSelected = selectedSeats.includes(seat.id);
                          const isBooked = seat.booked;
                          const isMaxedOut = selectedSeats.length >= ticketCount && !isSelected;

                          return (
                            <motion.div 
                              key={seat.id}
                              whileHover={!isBooked && !isMaxedOut ? { scale: 1.1 } : {}}
                              whileTap={!isBooked && !isMaxedOut ? { scale: 0.95 } : {}}
                              onClick={() => handleSeatClick(seat)}
                              className={`
                                relative w-10 h-10 md:w-12 md:h-12 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border
                                ${isBooked ? 'bg-red-900/20 border-red-500/20 text-red-500/30 cursor-not-allowed' : 
                                  isSelected ? 'bg-cyan-500 border-cyan-300 text-black shadow-[0_0_20px_rgba(6,182,212,0.8)]' : 
                                  isMaxedOut ? 'bg-black/80 border-white/10 text-gray-700 cursor-not-allowed' :
                                  'bg-black/80 border-cyan-500/30 text-gray-300 hover:border-cyan-500 hover:text-white'}
                              `}
                            >
                               <span className="font-bold text-xs">{seat.id}</span>
                               {seat.label && <span className="text-[8px] uppercase tracking-tighter opacity-80">{seat.label}</span>}
                            </motion.div>
                          );
                       })}
                    </div>
                  ))}
                </div>
              </div>

              {/* State Footer Action */}
              <div className="mt-auto flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 relative z-10 w-full">
                <div className="mb-6 md:mb-0 text-center md:text-left flex-1">
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Assigned Coordinates</p>
                   <p className="text-xl md:text-2xl font-black uppercase text-white glow-text">
                     {selectedSeats.length > 0 ? selectedSeats.join(', ') : '--'}
                   </p>
                </div>
                <button 
                   disabled={selectedSeats.length !== ticketCount}
                   onClick={handleProceed}
                   className={`flex items-center px-8 md:px-10 py-4 font-black uppercase tracking-widest rounded-xl transition-all ${
                     selectedSeats.length === ticketCount 
                       ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]' 
                       : 'bg-black border border-white/5 text-gray-600 cursor-not-allowed'
                   }`}
                >
                   Verify Checkout <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
