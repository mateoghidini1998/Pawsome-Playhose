const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth'); 

const {
   createProfile, 
   getProfiles,
   getProfile,
   getProfileMe,
} = require('../../controllers/profiles');

router.post('/', protect, createProfile);
router.get('/', getProfiles);
router.get('/me', protect, getProfileMe);
router.get('/:user_id', getProfile);

module.exports = router;

