const express = require('express');
const { getProfile, getDashboard, getAllApprovedProperty, getApprovedPropertybyID, setApprovalBooking, getBookingforApproval, getBookingforApprovalbyID, setBookingtoApproval, getApprovedBooking, getUserOrder } = require('../controllers/userController');
const authorize  = require('../middleware/authorize');


const router = express.Router();

router.get('/profile', authorize(['admin', 'user', 'partner']), getProfile);
router.get('/dashboard', authorize(['admin', 'user']), getDashboard);
router.get('/getAllApprovedProperty', getAllApprovedProperty);
router.post('/getApprovedPropertybyID', getApprovedPropertybyID);
router.post('/setApprovalBooking', authorize(['admin', 'user',  'partner']) , setApprovalBooking);
router.get('/getBookingforApproval' , getBookingforApproval);
router.post('/getBookingforApprovalbyID' , getBookingforApprovalbyID);
router.post('/setBookingtoApproval' , setBookingtoApproval);
router.get('/getApprovedBooking',authorize(['admin', 'user',  'partner']) , getApprovedBooking);
router.get('/getUserOrder' ,authorize(['user']) ,  getUserOrder);

module.exports = router;