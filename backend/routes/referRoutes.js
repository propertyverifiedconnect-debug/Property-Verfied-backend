const express = require('express');
const { referIntoDB, getAllLeadtoApproved, setCustomerleadtoApproval, getAllApprovedLead } = require('../controllers/referController');
const authorize = require('../middleware/authorize');



const router = express.Router();

router.post('/referInDB' , referIntoDB);
router.get('/getAllLeadtoApproved' , getAllLeadtoApproved);
router.post('/setCustomerleadtoApproval' , setCustomerleadtoApproval);
router.get('/getAllApprovedLead' ,authorize(["partner"]) ,getAllApprovedLead);



module.exports = router;