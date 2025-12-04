const express = require('express');
const { signup, login, logOut, handleRequestResetRoute, handleUpdatePasswordRoute, googleAuth } = require('../controllers/authController');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logOut',logOut);
router.post('/request-reset', handleRequestResetRoute);
router.post('/update-password', handleUpdatePasswordRoute);
router.post('/google', googleAuth);


module.exports = router;