const express = require('express');
 
const authorize = require('../middleware/authorize');
const upload = require('../config/multerConfig');
const propertyController = require('../controllers/propertyController');


const router = express.Router();

router.post('/insertPropertyinDB', authorize(['partner']) ,upload.array("photos"), propertyController.createProperty );
router.get("/getAllProperties" , propertyController.getAllProperties);
router.post("/getPropertiesbyID"  , propertyController.getPropertybyID);
router.post("/setPropertytoApproval"  , propertyController.setPropertytoApproval);





module.exports = router;