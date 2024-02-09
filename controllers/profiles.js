const asyncHandler = require('../middleware/async');
const Profile = require('../models/Profile.model');
const ErrorResponse = require('../utils/errorResponse');

//@desc     Create a Profile
//@route    POST /api/profile
//@access   Private

exports.createProfile = asyncHandler(async (req, res, next) => {
    const { biography, profileImageUrl, location, birthdate } = req.body;
    const profileFields = {};
    profileFields.user_id = req.user.id;

    profileFields.biography = biography;
    profileFields.location = location;
    profileFields.birthdate = birthdate;
    profileFields.profileImageUrl = profileImageUrl;

    if(biography) profileFields.biography = biography;
    if(profileImageUrl) profileFields.profileImageUrl = profileImageUrl;
    if(location) profileFields.location = location;
    if(birthdate) profileFields.birthdate = birthdate;

    let profile = await Profile.findOne({ where: { user_id: req.user.id } });

    if (profile) {
        profile = await profile.update(
            { user: req.user.id },
            { $set: profileFields },
            { new: true } 
        );
    }

    profile = await Profile.create(profileFields);
    res.status(200).json(profile);

});    

//@desc      Get all Profiles
//@route     GET /api/profile
//@access    Public

exports.getProfiles = asyncHandler(async (req, res, next) => {
    const profiles = await Profile.findAll();
    res.status(200).json(profiles);
});

//@desc      Get a Profile
//@route     GET /api/profile/:id
//@access    Public

exports.getProfile = asyncHandler(async (req, res, next) => {
    const profile = await Profile.findOne({ where: { user_id: req.params.user_id } })
    if (profile) {
        res.status(200).json(profile);
    } else {
        return next(new ErrorResponse(`Profile not found with user_id ${req.params.user_id}`, 404));
    }
});

//@desc      Get current logged in profile
//@route     GET /api/profile/me
//@access    Private

exports.getProfileMe = asyncHandler(async (req, res, next) => {
    const profile = await Profile.findOne({ where: { user_id: req.user.id } });
    if (profile) {
        res.status(200).json(profile);
    } else {
        return next(new ErrorResponse(`Profile not found with user_id ${req.user.id}`, 404));
    }
});


//@desc      Delete a Profile
//@route     DELETE /api/profile/:id
//@access    Private

exports.deleteProfile = asyncHandler(async (req, res, next) => {
    const profile = await Profile.findOne({ where: { user_id: req.user.id } });
    if (profile) {
        await profile.destroy();
        res.status(200).json({ success: true });
    } else {
        return next(new ErrorResponse(`Profile not found with user_id ${req.user.id}`, 404));
    }
});