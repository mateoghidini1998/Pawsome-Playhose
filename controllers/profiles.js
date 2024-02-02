const asyncHandler = require('../middleware/async');
const Profile = require('../models/Profile.model');

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
    res.json(profile);

});    