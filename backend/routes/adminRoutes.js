// routes/adminRoutes.js
const express = require('express');
const authorize  = require('../middleware/authorize');
const { Change_Automation_flag_toauto, Change_Automation_flag_toManual, getFlagValue } = require('../controllers/adminController');

const router = express.Router();

router.put('/Change_toAuto',Change_Automation_flag_toauto);
router.put('/Change_toManual',Change_Automation_flag_toManual);
router.get('/getFlagValue',getFlagValue);


module.exports = router;
