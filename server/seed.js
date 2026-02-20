require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected!');

  await User.create({
    name: 'Test Helper',
    email: 'helper@test.com',
    phone: '+91XXXXXXXXXX',
    password: 'password123',
    role: 'helper',
    skills: ['medical', 'fire'],
    location: { type: 'Point', coordinates: [80.2707, 13.0827] }
  });

  console.log('✅ User created — MongoDB schemas are working!');
  process.exit();
}).catch(err => {
  console.error('❌ Failed:', err.message);
  process.exit(1);
});