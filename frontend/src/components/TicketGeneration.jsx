import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Printer, ArrowRight, User, Hash, Navigation2 } from 'lucide-react';
import { bookTicket } from '../utils/api';

export default function TicketGeneration({ userName }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState('generating');
  const [bookingObj, setBookingObj] = useState(null);

  useEffect(() => {
    // Disabled aggressive unmounting redirects allowing fallbacks to preserve visual states
    if (!state?.route || !state?.queryData) return;

    const processBooking = async () => {
      setTimeout(async () => {
        const payload = {
          userName,
          routeId: state.route.id,
          type: state.route.type,
          price: state.route.price * state.ticketCount,
          date: state.queryData.date,
          source: state.queryData.source,
          destination: state.queryData.destination,
          distance: state.route.distance,
          seatNumber: state.selectedSeats.join(', '),
          vehicleName: state.route.vehicleName,
          ticketCount: state.ticketCount
        };
        const booking = await bookTicket(payload);
        setBookingObj(booking);
        setStatus('generated');
      }, 2500); 
    };

    processBooking();
  }, [state, navigate, userName]);

  if (status === 'generating') {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-20 h-20 border-t-4 border-b-4 border-cyan-400 rounded-full mb-8 shadow-[0_0_30px_rgba(34,211,238,0.5)]"></motion.div>
        <h2 className="text-3xl font-light tracking-[0.2em] text-cyan-400 glow-text animate-pulse uppercase">Minting Smart Ticket Block...</h2>
      </div>
    );
  }

  if (!state || !state.route || !state.queryData) {
     return <div className="min-h-screen bg-darkBg flex items-center justify-center text-red-500 font-bold uppercase tracking-widest">Invalid Trajectory Data</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-darkBg relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black pointer-events-none Print-Hide"></div>
      
      <motion.div 
        id="printable-ticket"
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative z-10 w-full max-w-[50rem] bg-white text-black rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.2)] flex flex-col md:flex-row border border-cyan-900"
      >
        <div className="bg-gradient-to-b from-gray-900 to-black p-8 text-white flex flex-col justify-between items-center md:w-1/3 relative overflow-hidden border-r-2 border-dashed border-gray-400">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
          
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} className="bg-cyan-500/20 p-4 rounded-full backdrop-blur-sm border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <CheckCircle className="w-12 h-12 text-cyan-400" />
          </motion.div>
          
          <div className="text-center mt-6 w-full relative z-10">
            <p className="text-sm uppercase tracking-[0.3em] font-bold text-cyan-500 mb-2">TripX Premium Pass</p>
            <p className="text-4xl font-black uppercase tracking-wider">{state.route.type}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center w-full relative z-10">
             <div className="text-sm font-bold text-gray-500 tracking-widest uppercase mb-1">TOTAL AMOUNT</div>
             <div className="text-4xl font-black text-white glow-text">₹{state.route.price * state.ticketCount}</div>
          </div>
        </div>

        <div className="p-8 md:w-2/3 flex flex-col justify-between bg-white relative">
          
          <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">PASSENGER NAME</p>
              <div className="flex items-center text-xl md:text-2xl font-black text-gray-900 uppercase">
                <User className="w-5 h-5 mr-3 text-cyan-500" /> {userName || 'Guest User'}
              </div>
            </div>
            <div className="text-right">
               <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">DEPARTURE</p>
               <p className="font-black text-lg md:text-xl text-gray-900">{state.queryData.date}</p>
            </div>
          </div>

          {/* New Vehicle Identity Render Layer */}
          <div className="flex justify-between items-center mb-8 px-2 bg-gray-50 rounded-xl p-4 border border-cyan-100">
             <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">SERVICE IDENTITY</p>
                <p className="font-black text-sm md:text-base text-gray-900 uppercase tracking-wide">{state.route.vehicleName}</p>
             </div>
             <div className="text-right">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">TICKETS: {state.ticketCount}</p>
                <div className="inline-block bg-cyan-500 text-black px-3 py-1 font-black rounded uppercase text-sm w-full md:w-auto text-center truncate max-w-[150px]" title={state.selectedSeats.join(', ')}>
                   {state.selectedSeats.join(', ')}
                </div>
             </div>
          </div>

          <div className="flex items-center justify-between mb-8 relative px-2">
             <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-gray-100 -z-10 border-t-2 border-dashed border-gray-300"></div>
             
             <div className="bg-white pr-4 flex flex-col items-start max-w-[120px]">
                <p className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter mb-1 uppercase truncate w-full">{state.queryData.source.substring(0,3)}</p>
                <p className="text-gray-500 text-[10px] md:text-xs font-bold tracking-widest uppercase truncate w-full" title={state.queryData.source}>{state.queryData.source}</p>
             </div>
             
             <div className="bg-white px-2 text-cyan-500 shadow-[0_0_15px_rgba(255,255,255,1)] flex flex-col items-center">
                <Navigation2 className="w-6 h-6 rotate-90 mb-1" />
                <span className="text-xs font-black tracking-widest text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">{state.route.distance} km</span>
             </div>
             
             <div className="bg-white pl-4 flex flex-col items-end max-w-[120px]">
                <p className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter mb-1 uppercase truncate w-full text-right">{state.queryData.destination.substring(0,3)}</p>
                <p className="text-gray-500 text-[10px] md:text-xs font-bold tracking-widest uppercase truncate w-full text-right" title={state.queryData.destination}>{state.queryData.destination}</p>
             </div>
          </div>

          <div className="flex justify-between items-end mt-2 pt-6 border-t border-gray-100">
             <div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">BOOKING REFERENCE</p>
                <p className="font-mono text-gray-900 font-bold bg-gray-100 px-3 py-1 rounded inline-flex items-center text-sm md:text-base">
                  <Hash className="w-4 h-4 mr-1 text-gray-500"/> {bookingObj?.id || 'PENDING RECORD'}
                </p>
             </div>
             <div className="flex space-x-3 Print-Hide">
               <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:text-black hover:border-gray-300 transition-all uppercase tracking-wider text-xs md:text-sm">
                 Done
               </button>
               <button onClick={handlePrint} className="px-5 py-2.5 bg-black hover:bg-cyan-500 text-white hover:text-black rounded-xl font-black tracking-wider transition-all flex items-center shadow-xl uppercase text-xs md:text-sm">
                 <Printer className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Print
               </button>
             </div>
          </div>

          <div className="absolute top-0 -left-6 w-12 h-12 bg-darkBg rounded-full -translate-y-1/2 shadow-inner Print-Hide"></div>
          <div className="absolute bottom-0 -left-6 w-12 h-12 bg-darkBg rounded-full translate-y-1/2 shadow-inner Print-Hide"></div>
        </div>
      </motion.div>
    </div>
  );
}
