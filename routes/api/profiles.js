const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth'); 

const {
   createProfile, 
} = require('../../controllers/profiles');

router.post('/', protect, createProfile);

module.exports = router;

