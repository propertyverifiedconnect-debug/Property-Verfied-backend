// backend/index.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('./config/supabaseClient');
const morgun = require("morgan")
const helmet= require('helmet')
const {GeminiCall}  = require("./services/geminiService")



const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const partnerRoutes = require("./routes/propertyRoute")
const referRoutes = require("./routes/referRoutes")
const aiRoutes  = require("./routes/aiRoute")



dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  process.env.FRONTEND_URL,
  "https://property-verfied-frontend.vercel.app",
  "https://property-verfied-partner.vercel.app",
  "https://property-verified-admin.vercel.app",
];



app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // CRITICAL for cookies!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'], // Allow Set-Cookie header
   preflightContinue: false,
  optionsSuccessStatus: 204
}));




app.use(cookieParser());
app.use(express.json());

app.use(morgun("dev"));



app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/refer', referRoutes);
app.use('/api/ai', aiRoutes);




// Test on startup



// GeminiCall("Hello Gemini  , can you tell me the meaning of Muchkund ")
//   .then(response => console.log("✅ Gemini Response:", response))
//   .catch(error => console.error("❌ Failed to call Gemini:", error.message));





app.get('/', (req, res) => {
  res.json({ message: '✅ API Server is running successfully!' });
});

// ======== Global Error Handler ======== //
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(process.env.PORT, "0.0.0.0",() => console.log(`Server running on port ${process.env.PORT}`));
