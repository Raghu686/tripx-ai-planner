const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock Data
let bookings = [];
const mockRoutes = [
  {
    id: 1,
    type: 'Train',
    price: 1850,
    time: '5h 30m',
    comfort: 'High',
    stops: ['Chennai', 'Vellore', 'Salem', 'Erode', 'Coimbatore'],
    routePoints: [
      [13.0827, 80.2707], // Chennai
      [12.9165, 79.1325], // Vellore
      [11.6643, 78.1460], // Salem
      [11.3410, 77.7172], // Erode
      [11.0168, 76.9558], // Coimbatore
    ]
  },
  {
    id: 2,
    type: 'Bus',
    price: 899,
    time: '8h 00m',
    comfort: 'Medium',
    stops: ['Chennai', 'Villupuram', 'Trichy', 'Madurai', 'Coimbatore'],
    routePoints: [
      [13.0827, 80.2707], // Chennai
      [11.9401, 79.4861], // Villupuram
      [10.7905, 78.7047], // Trichy
      [9.9252, 78.1198], // Madurai
      [11.0168, 76.9558], // Coimbatore
    ]
  },
  {
    id: 3,
    type: 'Flight',
    price: 4500,
    time: '1h 15m',
    comfort: 'Very High',
    stops: ['Chennai', 'Coimbatore'],
    routePoints: [
      [13.0827, 80.2707], // Chennai
      [11.0168, 76.9558], // Coimbatore
    ]
  }
];

// Routes API - Smart planner
app.get('/api/planner/routes', (req, res) => {
  const { source, destination, date } = req.query;
  // In a real app we'd filter or calculate based on source/dest.
  // For demo, we return our mock routes as "smart suggestions"
  res.json({ success: true, routes: mockRoutes });
});

// Bookings API
app.post('/api/bookings', (req, res) => {
  const { userName, routeId, type, price, date, source, destination, distance, seatNumber, vehicleName, ticketCount } = req.body;
  const newBooking = {
    id: Date.now(),
    userName: userName || 'User',
    routeId,
    type,
    price,
    date,
    source,
    destination,
    distance,
    seatNumber,
    vehicleName,
    ticketCount,
    createdAt: new Date()
  };
  bookings.push(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

app.get('/api/bookings', (req, res) => {
  const { userName } = req.query;
  const userBookings = userName ? bookings.filter(b => b.userName === userName) : bookings;
  res.json({ success: true, bookings: userBookings });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
