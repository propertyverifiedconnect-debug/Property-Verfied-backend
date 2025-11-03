const express = require('express');
const { referIntoDB, getAllLeadtoApproved, setCustomerleadtoApproval } = require('../controllers/referController');



const router = express.Router();

router.post('/referInDB' , referIntoDB);
router.get('/getAllLeadtoApproved' , getAllLeadtoApproved);
router.post('/setCustomerleadtoApproval' , setCustomerleadtoApproval);


module.exports = router;