const express = require('express');
const { signup, login, logOut, handleRequestResetRoute, handleUpdatePasswordRoute, googleAuth, resetContact, signupPartner, resetContactPartner, googleAuthPartner } = require('../controllers/authController');
const authorize = require('../middleware/authorize');
const upload = require('../config/multerConfig');

const router = express.Router();

router.post('/signup', signup);
router.post('/signup-partner', upload.single("idProof") ,signupPartner);
router.post('/login', login);
router.post('/logOut',logOut);
router.post('/request-reset', handleRequestResetRoute);
router.post('/update-password', handleUpdatePasswordRoute);
router.post('/google', googleAuthPartner);
router.post('/resetContact',authorize(['admin', 'user', 'partner']) ,resetContact);
router.post('/resetContactpartner',authorize(['admin', 'user', 'partner']) , upload.single("idProof") ,resetContactPartner);


module.exports = router;