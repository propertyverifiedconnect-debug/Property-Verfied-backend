const express = require('express');
const { signup, login, logOut } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logOut', logOut);


module.exports = router;