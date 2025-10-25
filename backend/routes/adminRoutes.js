// routes/adminRoutes.js
const express = require('express');
const authorize  = require('../middleware/authorize');

const router = express.Router();

router.get('/', authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

router.get('/partner', authorize('partner'), (req, res) => {
  res.json({ message: 'Welcome Partner!' });
});

module.exports = router;
