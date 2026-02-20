const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Socket.io Manager
 * Handles real-time connections, rooms, and events.
 */
const initSocket = (server) => {
  const { Server } = require('socket.io');

  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  // Authenticate socket connection using JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication error'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));

      socket.user = user;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const { user } = socket;
    console.log(`🔌 Connected: ${user.name} (${user.role})`);

    // Each user joins their personal room for targeted messages
    socket.join(`user_${user._id}`);

    // Helpers also join the helpers broadcast room
    if (user.role === 'helper') {
      socket.join(`helper_${user._id}`);
      socket.join('helpers_room');
    }

    // ── Client Events ──────────────────────────────────────

    // Helper updates their live location
    socket.on('update_location', async ({ longitude, latitude }) => {
      await User.findByIdAndUpdate(user._id, {
        location: { type: 'Point', coordinates: [longitude, latitude] },
      });
      // Broadcast helper location to admin room
      io.to('admins_room').emit('helper_location_update', {
        helperId: user._id,
        name: user.name,
        coordinates: [longitude, latitude],
      });
    });

    // Helper sends a live status message to alert sender
    socket.on('send_status', ({ alertId, senderId, message }) => {
      io.to(`user_${senderId}`).emit('helper_status_message', {
        alertId,
        helper: { id: user._id, name: user.name },
        message,
        timestamp: new Date(),
      });
    });

    // Chat message within an alert thread
    socket.on('alert_chat', ({ alertId, message }) => {
      io.to(`alert_${alertId}`).emit('new_chat_message', {
        alertId,
        sender: { id: user._id, name: user.name },
        message,
        timestamp: new Date(),
      });
    });

    // Join an alert-specific chat room
    socket.on('join_alert_room', (alertId) => {
      socket.join(`alert_${alertId}`);
      console.log(`${user.name} joined alert room: ${alertId}`);
    });

    // ── Disconnect ──────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`❌ Disconnected: ${user.name}`);
      // Mark helper as unavailable when they go offline
      if (user.role === 'helper') {
        await User.findByIdAndUpdate(user._id, { isAvailable: false });
        io.emit('helper_availability', { helperId: user._id, isAvailable: false });
      }
    });
  });

  return io;
};

module.exports = initSocket;
