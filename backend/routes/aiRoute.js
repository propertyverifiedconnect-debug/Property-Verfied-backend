const express = require('express');
const authorize  = require('../middleware/authorize');
const { PropertyVerifiedAi } = require('../controllers/aiController');

const router = express.Router();

 router.post("/genrate",authorize(["user"]) ,PropertyVerifiedAi);



module.exports = router;
