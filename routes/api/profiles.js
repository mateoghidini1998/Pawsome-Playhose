const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth'); 

const {
   createProfile, 
   getProfiles,
   getProfile,
   getProfileMe,
   deleteProfile
} = require('../../controllers/profiles');

router.post('/', protect, createProfile);
router.get('/', getProfiles);
router.get('/me', protect, getProfileMe);
router.get('/:user_id', getProfile);
router.delete('/', protect, deleteProfile);

module.exports = router;

