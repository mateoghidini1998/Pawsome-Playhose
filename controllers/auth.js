const asyncHandler = require('../middleware/async');
const User = require('../models/User.model');


//@route    POST api/auth/register
//@desc     Register a user
//@access   Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, lastname, email, password } = req.body;
 
    let user = await User.findOne({ where: { email } });

    if(user){
        return res.status(400).json({ errors: [{ msg: 'User already exists'}]});
    }

    //Create user
    user = await User.create({ name, lastname, email, password });

    //Return jsonwebtoken -> this for users to be logged in right after registration
    console.log(user);
    sendTokenResponse(user, 200, res);
});

//@route   POST api/auth
//@desc    Authenticate user & get token
//@access  public

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //Validate email and password
    if(!email || !password){
        return res.status(400).json({ errors: [{ msg: 'Please provide an email and password'}]});
    }

    //See if user exists
    let user = await User.findOne({ where: { email: email }});
    /* console.log('User: ', user); */
    if(!user){
        return res.status(400).json({ errors: [{ msg:'Invalid credentials' }] });
    }

    //Compare the input password, plane text, to the encrypted password.
    const isMatch = await user.matchPassword(password);
    /* console.log('Is Match: ', isMatch); */
    if(!isMatch){
        return res.status(401).json({ errors: [{ msg:'Invalid credentials' }] });
    }

    //Return jsonwebtoken -> this for users to be logged in right after registration
    sendTokenResponse(user, 200, res);

});

//@desc   Get current logged in user
//@route  GET api/auth/me
//@access Private

exports.getMe = asyncHandler(async (req, res, next) => {
    console.log(req);
    const user = await User.findByPk(req.user.id);
    console.log('User: ', user);
    res.status(200).json({
        success: true,
        data: user
    });
})

//Get Token from model, create a cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
    /* console.log('Token: ', token);
    console.log('User: ', user);
    console.log('Res: ', res); */
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
  
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        token
      });
  };