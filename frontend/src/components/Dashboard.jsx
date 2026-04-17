import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Search, Network } from 'lucide-react';
import { getBookings } from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ userName }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      // Use exact dynamic user name
      const data = await getBookings(userName);
      setBookings(data || []);
      setLoading(false);
    };
    fetchHistory();
  }, [userName]);

  const totalBookings = bookings.length;
  const targetForReward = 10;
  const progressPercent = Math.min((totalBookings / targetForReward) * 100, 100);

  return (
    <div className="min-h-screen bg-darkBg text-white pt-24 px-4 md:px-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-black mb-3 tracking-tight drop-shadow-md glow-text">My Dashboard</h2>
            <p className="text-cyan-100/60 tracking-wider text-xl">Welcome back, {userName}! Here is your travel history.</p>
          </div>
          <button onClick={() => navigate('/book')} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-8 py-3 rounded-xl font-bold flex items-center transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] tracking-widest uppercase text-sm">
            <Search className="w-4 h-4 mr-3" /> Execute Plan
          </button>
        </div>

        {/* Rewards Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2rem] p-8 md:p-10 mb-16 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4 opacity-[0.03] group-hover:opacity-5 transition-opacity duration-700">
            <Network className="w-64 h-64" />
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Network className="w-12 h-12 text-white" />
          </div>
          
          <div className="flex-1 w-full z-10">
            <h3 className="text-3xl font-black mb-2 flex items-center tracking-tight">
              TripX Loyalty Protocol 
              <span className="ml-4 text-xs bg-cyan-900 text-cyan-400 px-4 py-1.5 rounded-full uppercase tracking-widest font-bold border border-cyan-500/30">Active</span>
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl leading-relaxed">Execute {targetForReward} bookings to unlock a premium 10% discount on any smart travel route. Your journeys await!</p>
            
            <div className="w-full">
              <div className="flex justify-between text-sm font-bold tracking-widest uppercase mb-3">
                <span className="text-cyan-100/80">{totalBookings} Bookings</span>
                <span className="text-cyan-400">{targetForReward} Bookings (10% OFF)</span>
              </div>
              <div className="w-full bg-black/50 border border-white/5 rounded-full h-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-cyan-600 via-cyan-400 to-blue-400 h-full relative"
                >
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking History */}
        <div className="space-y-8">
          <h3 className="text-3xl font-black tracking-tight flex items-center">
            <Briefcase className="w-8 h-8 mr-4 text-cyan-500" /> Past Journeys
          </h3>
          
          {loading ? (
             <div className="text-center py-20 text-cyan-500/50 animate-pulse font-bold tracking-widest uppercase">Initializing History Logs...</div>
          ) : bookings.length === 0 ? (
            <div className="py-24 glass-card border-dashed rounded-[2rem] flex flex-col items-center justify-center text-cyan-500/50">
              <MapPin className="w-16 h-16 mb-6 opacity-30" />
              <p className="font-bold tracking-widest uppercase text-sm">No bookings found in databanks. Initiate a new session.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((b, i) => (
                <motion.div 
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card hover:bg-white/10 border-white/5 hover:border-cyan-500/30 rounded-3xl p-8 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-black/60 text-cyan-400 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full border border-cyan-900 group-hover:border-cyan-500 transition-colors">{b.type}</span>
                    <span className="text-2xl font-black text-white glow-text">₹{b.price}</span>
                  </div>
                  <h4 className="text-2xl font-black tracking-tighter mb-2">{b.source} <span className="text-cyan-500 mx-2">→</span> {b.destination}</h4>
                  <div className="flex items-center text-sm font-bold tracking-widest opacity-60 mt-6 pt-6 border-t border-white/10 uppercase">
                    <Calendar className="w-4 h-4 mr-3" />
                    {new Date(b.date).toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
