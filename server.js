const express = require('express');
const session = require('express-session');
const cors = require('cors');
const blogRoutes = require('./routes/blogs'); // ✅ Correct path to your router

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Enable CORS for frontend requests (adjust origin if needed)
app.use(cors({
  origin: 'http://localhost:5173', // your React app URL
  credentials: true
}));

// Session setup
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}));

// Simulated login for testing (replace with real signin logic later)
app.use((req, res, next) => {
  req.session.user = { user_id: 'user123', name: 'Alice' };
  next();
});

// Root route for confirmation
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Routes
app.use('/api', blogRoutes); // ✅ Mount router under /api

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
