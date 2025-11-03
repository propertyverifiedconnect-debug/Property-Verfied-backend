// backend/index.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('./config/supabaseClient');
const morgun = require("morgan")
const helmet= require('helmet')


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const partnerRoutes = require("./routes/propertyRoute")
const referRoutes = require("./routes/referRoutes")



dotenv.config();
const app = express();
app.use(cors({
  //  origin: [
  //   'http://localhost:3000',
  //     process.env.CORS_URL // replace with your PC’s local IP
  // ],
  origin: true, 
   credentials: true ,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(cookieParser());
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(morgun("dev"));



app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/refer', referRoutes);





app.get('/', (req, res) => {
  res.json({ message: '✅ API Server is running successfully!' });
});

// ======== Global Error Handler ======== //
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(process.env.PORT, "0.0.0.0",() => console.log(`Server running on port ${process.env.PORT}`));
