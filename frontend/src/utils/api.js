const API_URL = 'http://localhost:5000/api';

const AIRPORT_CITIES = ['chennai', 'bangalore', 'mumbai', 'delhi', 'hyderabad', 'coimbatore', 'pune', 'kolkata', 'kochi', 'ahmedabad'];

// Simple Haversine distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Fallback generator for coordinates within India roughly
function getDummyCoords(cityStr) {
  // Hash string to consistent number
  let hash = 0;
  for (let i = 0; i < cityStr.length; i++) hash = cityStr.charCodeAt(i) + ((hash << 5) - hash);
  const lat = 10 + (Math.abs(hash) % 20) + (Math.abs(hash) % 100) / 100; // between 10 and 30 N
  const lon = 70 + (Math.abs(hash) % 20) + (Math.abs(hash) % 100) / 100; // between 70 and 90 E
  return { lat, lon };
}

async function getCoordinates(city) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ', India')}`);
    if (!res.ok) throw new Error('Geocoding down');
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return getDummyCoords(city);
  } catch(e) {
    return getDummyCoords(city);
  }
}

export const getRoutes = async (source, destination, date) => {
  // Perform Geocoding
  const c1 = await getCoordinates(source);
  const c2 = await getCoordinates(destination);
  
  let distance = getDistanceFromLatLonInKm(c1.lat, c1.lon, c2.lat, c2.lon);
  if (distance < 10) distance = 250; // default minimum distance to avoid weird routes if same city typed

  const sourceL = source.toLowerCase().trim();
  const destL = destination.toLowerCase().trim();
  
  const hasAirport = AIRPORT_CITIES.includes(sourceL) && AIRPORT_CITIES.includes(destL);
  
  const trainPrice = Math.round(distance * 1.25);
  const busPrice = Math.round(distance * 1.7);
  const flightPrice = Math.round(distance * 5);

  const routePoints = [ [c1.lat, c1.lon], [c2.lat, c2.lon] ];

  const busNames = ["Mettur Super Service", "VeeBee Travels", "KPN Premium", "SRS Transport"];
  const trainNames = ["Chennai Superfast Express", "Madurai Superfast Express", "Delhi Superfast Express", "Mumbai Superfast Express"];
  const flightNames = ["Air India", "IndiGo", "SpiceJet", "Vistara Core"];

  return [
    {
      id: 1, type: 'Train', price: trainPrice, time: `${Math.floor(distance / 60)}h 30m`, comfort: 'High', 
      stops: [source, destination], source, destination, routePoints, distance, available: true,
      vehicleName: trainNames[Math.floor(Math.random() * trainNames.length)]
    },
    {
      id: 2, type: 'Bus', price: busPrice, time: `${Math.floor(distance / 40)}h 00m`, comfort: 'Medium', 
      stops: [source, destination], source, destination, routePoints, distance, available: true,
      vehicleName: busNames[Math.floor(Math.random() * busNames.length)]
    },
    {
      id: 3, type: 'Flight', price: flightPrice, time: `${Math.floor(distance / 500) + 1}h 15m`, comfort: 'Very High', 
      stops: [source, destination], source, destination, routePoints, distance, available: hasAirport,
      vehicleName: flightNames[Math.floor(Math.random() * flightNames.length)]
    }
  ];
};

export const bookTicket = async (bookingData) => {
  const res = await aFetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  return res.booking;
};

export const getBookings = async (userName = 'User') => {
  const res = await aFetch(`${API_URL}/bookings?userName=${encodeURIComponent(userName)}`);
  return res.bookings;
};

async function aFetch(url, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    return { bookings: [] };
  }
}
