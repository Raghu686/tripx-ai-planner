import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Search, Train, Bus, Plane, Navigation2, Lock } from 'lucide-react';
import { getRoutes } from '../utils/api';
import RoutePreview from './RoutePreview';

export default function BookingSystem({ userName }) {
  const [formData, setFormData] = useState({ source: '', destination: '', date: '', type: 'Train' });
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleSearch = async () => {
    if (!formData.source || !formData.destination || !formData.date) {
      alert("Please enter origin, destination, and temporal parameters.");
      return;
    }
    setLoading(true);
    const results = await getRoutes(formData.source, formData.destination, formData.date);
    setRoutes(results);
    setLoading(false);
    setSelectedRoute(null); // reset selection visually mapping to new search
  };

  const travelTypes = [
    { name: 'Train', icon: <Train className="w-8 h-8 mb-2" /> },
    { name: 'Bus', icon: <Bus className="w-8 h-8 mb-2" /> },
    { name: 'Flight', icon: <Plane className="w-8 h-8 mb-2" /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-12 lg:px-24 bg-darkBg text-white">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-md glow-text mb-4">
            Initialize Parameters
          </h2>
          <p className="text-cyan-100/60 tracking-wider">Configure your optimal path, {userName}.</p>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Configuration Matrix */}
          <div className="lg:col-span-5 space-y-8 glass-card p-6 md:p-8 rounded-[2rem]">
            
            {/* Source & Destination Visual Cards */}
            <div>
              <h3 className="text-gray-400 text-sm tracking-widest uppercase mb-4">Coordinate Selection</h3>
              <div className="flex flex-col gap-4 relative">
                
                {/* Source Input */}
                <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-4 focus-within:border-cyan-400 transition-colors">
                  <label className="text-xs text-cyan-500 font-bold tracking-wider">ORIGIN</label>
                  <div className="flex items-center mt-2">
                    <MapPin className="text-cyan-400 w-5 h-5 mr-3" />
                    <input 
                      type="text"
                      placeholder="e.g. Chennai"
                      value={formData.source} 
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                      className="bg-transparent text-xl font-bold w-full outline-none placeholder:text-gray-700 uppercase"
                    />
                  </div>
                </div>

                <div className="absolute top-1/2 left-8 md:left-10 -translate-y-1/2 z-10 bg-cyan-600 rounded-full p-2 border-4 border-[#0a0a0a] shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                   <Navigation2 className="w-4 h-4 text-white rotate-180" />
                </div>

                {/* Destination Input */}
                <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-4 focus-within:border-cyan-400 transition-colors">
                  <label className="text-xs text-cyan-500 font-bold tracking-wider">DESTINATION</label>
                  <div className="flex items-center mt-2">
                    <MapPin className="text-cyan-400 w-5 h-5 mr-3" />
                    <input 
                      type="text"
                      placeholder="e.g. Coimbatore"
                      value={formData.destination} 
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      className="bg-transparent text-xl font-bold w-full outline-none placeholder:text-gray-700 uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date Input */}
            <div>
               <h3 className="text-gray-400 text-sm tracking-widest uppercase mb-4">Temporal Index</h3>
               <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-4 flex items-center focus-within:border-cyan-400 transition-colors">
                  <Calendar className="text-cyan-400 w-5 h-5 mr-3" />
                  <input 
                    type="date" 
                    required 
                    value={formData.date} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                    className="bg-transparent w-full outline-none font-bold text-lg [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" 
                  />
               </div>
            </div>

            <button 
              onClick={handleSearch} 
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-4 rounded-full font-black tracking-widest uppercase shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex justify-center items-center"
            >
              {loading ? 'Simulating Matrix...' : <><Search className="w-5 h-5 mr-3" /> Execute Search</>}
            </button>
          </div>

          {/* Right Panel: Output & Visualization */}
          <div className="lg:col-span-7 h-full flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {routes.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col h-full gap-6"
                >
                  {/* Results Cards Row */}
                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="bg-cyan-500 w-2 h-6 mr-3 rounded-full glow-text"></span>
                      Available Routes <span className="text-sm font-light ml-4 opacity-50 bg-white/10 px-3 py-1 rounded-full">Distance: {routes[0]?.distance} km</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {routes.map((route, i) => {
                        const isAvailable = route.available;
                        return (
                          <motion.div 
                            key={route.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => { if(isAvailable) setSelectedRoute(route); }}
                            className={`p-4 rounded-2xl border transition-all ${!isAvailable ? 'opacity-50 cursor-not-allowed bg-black/40 border-red-500/20' : selectedRoute?.id === route.id ? 'cursor-pointer border-cyan-400 bg-cyan-900/40 shadow-[0_0_20px_rgba(6,182,212,0.2)] scale-[1.03] z-10 glass-card' : 'cursor-pointer border-white/10 hover:border-cyan-500/50 glass-card'}`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold tracking-widest uppercase text-sm text-gray-300">{route.type}</span>
                              <span className={`text-lg font-black glow-text ${isAvailable ? 'text-cyan-400' : 'text-gray-500'}`}>
                                {isAvailable ? `₹${route.price}` : <Lock className="w-5 h-5"/>}
                              </span>
                            </div>
                            
                            {!isAvailable ? (
                               <div className="text-xs text-red-400 mt-3 font-semibold uppercase tracking-wider">Flight not available for this route</div>
                            ) : (
                              <div className="text-xs text-gray-400 space-y-1">
                                <div className="flex justify-between"><span>Dur:</span> <span className="text-white">{route.time}</span></div>
                                <div className="flex justify-between"><span>Lvl:</span> <span className="text-white">{route.comfort}</span></div>
                                <div className="flex justify-between opacity-50 pt-1 border-t border-white/10"><span>Rate:</span> <span>₹{route.price / route.distance}/km</span></div>
                              </div>
                            )}
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Map Viewer */}
                  <div className="flex-1 min-h-[400px] glass-card rounded-3xl border border-white/10 overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    {selectedRoute ? (
                      <RoutePreview route={selectedRoute} queryData={formData} userName={userName} />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                         <MapPin className="w-16 h-16 mb-4 opacity-20" />
                         <p className="tracking-widest uppercase text-sm">Select a route module to load geographic visualization</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full border border-dashed border-cyan-500/20 rounded-3xl flex items-center justify-center text-cyan-500/50 bg-black/20">
                   <p className="tracking-widest uppercase font-bold text-sm flex items-center"><Navigation2 className="animate-spin w-4 h-4 mr-3"/> Awaiting Coordinate Input</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
