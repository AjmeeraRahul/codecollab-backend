const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://codecollab-frontend-ten.vercel.app"
];

// CORS Configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow server-to-server or Postman calls
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const projectRoutes = require('./routes/projectRoutes');

// Root test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 CodeCollab API Server is running!',
    status: 'success',
    endpoints: {
      projects: '/api/projects',
      health: '/api/health'
    }
  });
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/projects', projectRoutes);

// Handle 404 - Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`📊 Projects API: http://localhost:${PORT}/api/projects`);
});
