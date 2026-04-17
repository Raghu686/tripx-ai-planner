import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Map, MapPinned } from 'lucide-react';

// Fit bounds component to automatically center the dynamic route markers
function FitBounds({ routePoints }) {
  const map = useMap();
  useEffect(() => {
    if (routePoints && routePoints.length === 2) {
      map.fitBounds(routePoints, { padding: [50, 50] });
    }
  }, [routePoints, map]);
  return null;
}

export default function RoutePreview({ route, queryData, userName }) {
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setRevealed(false);
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 1500); 
    return () => clearTimeout(timer);
  }, [route]);

  if (!route || !route.routePoints || route.routePoints.length < 2 || !route.source || !route.destination) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-cyan-500/50">
        <MapPinned className="w-12 h-12 mb-4 opacity-50 animate-pulse" />
        <p className="tracking-widest uppercase text-sm font-bold">Acquiring Trajectory Data...</p>
      </div>
    );
  }

  const center = route.routePoints[Math.floor(route.routePoints.length / 2)];
  
  const handleBook = () => {
    navigate('/select-seat', { state: { route, queryData } });
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-darkBg">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence>
          {!revealed && (
            <motion.div 
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-20 pointer-events-none bg-cyan-900/40 backdrop-blur-sm flex flex-col items-center justify-center p-8 border border-cyan-500/30"
            >
              <MapPinned className="w-16 h-16 text-cyan-400 animate-bounce mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              <div className="text-xl font-black text-white uppercase tracking-[0.3em] bg-black/50 px-6 py-2 border border-cyan-500/50 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                 Calculating Trajectory...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="absolute inset-0 z-10 bg-[#050510]">
           <MapContainer center={center} zoom={6} scrollWheelZoom={false} className={`w-full h-full filter transition-all duration-[2s] ${revealed ? 'hue-rotate-0 saturate-100 brightness-100' : 'hue-rotate-180 saturate-0 brightness-50'}`}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}
            />
            {route.routePoints.map((pos, idx) => (
              <Marker key={idx} position={pos}>
                <Popup className="font-sans font-bold text-gray-800">{idx === 0 ? 'Origin' : 'Destination'}</Popup>
              </Marker>
            ))}
            <Polyline positions={route.routePoints} color="#06b6d4" weight={4} dashArray={revealed ? "10, 10" : ""} className="animate-pulse" />
            <FitBounds routePoints={route.routePoints} />
          </MapContainer>
        </div>
      </div>
      
      <motion.div 
        initial={{ y: 200 }}
        animate={{ y: revealed ? 0 : 200 }}
        className="absolute bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-xl border-t border-cyan-500/30 p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
      >
        <div className="flex-1 w-full">
          <h4 className="font-black text-xl tracking-wide flex items-center">
             <span className="text-cyan-400 mr-2 glow-text">₹{route.price}</span> | {route.source.toUpperCase()} → {route.destination.toUpperCase()}
          </h4>
          <p className="text-sm text-cyan-200/60 mt-2 flex items-center font-bold tracking-widest uppercase">
             <Map className="w-5 h-5 mr-2" /> Traveling from {route.source} to {route.destination} covering approximately {route.distance} km
          </p>
        </div>
        <button 
          onClick={handleBook}
          className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all w-full md:w-auto flex items-center justify-center"
        >
          Confirm Trajectory
        </button>
      </motion.div>
    </div>
  );
}
