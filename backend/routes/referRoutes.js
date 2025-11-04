const express = require('express');
const { referIntoDB, getAllLeadtoApproved, setCustomerleadtoApproval, getAllApprovedLead } = require('../controllers/referController');



const router = express.Router();

router.post('/referInDB' , referIntoDB);
router.get('/getAllLeadtoApproved' , getAllLeadtoApproved);
router.post('/setCustomerleadtoApproval' , setCustomerleadtoApproval);
router.get('/getAllApprovedLead' , getAllApprovedLead);



module.exports = router;