require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const initSocket = require('./socket/socketManager');

// Route imports
const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');
const helperRoutes = require('./routes/helperRoutes');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.io
const io = initSocket(server);

// Make io accessible in routes via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors(
  {
    origin:"http://localhost:4028",
    credentials:true,
  }
));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/helpers', helperRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Emergency Backend is running', timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚨 Emergency Server running on port ${PORT}`);
});
