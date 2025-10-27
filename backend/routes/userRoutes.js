const express = require('express');
const { getProfile, getDashboard, getAllApprovedProperty, getApprovedPropertybyID } = require('../controllers/userController');
const authorize  = require('../middleware/authorize');


const router = express.Router();

router.get('/profile', authorize(['admin', 'user', 'partner']), getProfile);
router.get('/dashboard', authorize(['admin', 'user']), getDashboard);
router.get('/getAllApprovedProperty', getAllApprovedProperty);
router.post('/getApprovedPropertybyID', getApprovedPropertybyID);

module.exports = router;