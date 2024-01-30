const express = require('express');
const router = express.Router();
const User = require('../../models/User.model.js');
const auth = require('../../middleware/auth');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check , validationResult } = require('express-validator/');


//@route    POST api/auth/register
//@desc     Register a user
//@access   Public

router.post('/register', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('lastname', 'Lastname is required')
        .not()
        .isEmpty(),
    check('email', 'Plese include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min:6})
 ], 
 async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array()}); //400 is for bad requests
    }
 
    const { name, lastname, email, password } = req.body;
 
    try {
        
        //Check if user exists
        let user = await User.findOne({ where: { email } });
 
        if(user){
            return res.status(400).json({ errors: [{ msg: 'User already exists'}]});
        }
 
        //Create user
        user = await User.create({ name, lastname, email, password });

        //Return jsonwebtoken -> this for users to be logged in right after registration

        sendTokenResponse(user, 200, res);
       
 
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
 
 });


//@route   POST api/auth
//@desc    Authenticate user & get token
//@access  public

router.post('/', [
    
    check('email', 'Plese include a valid email').isEmail(),
    check('password', 'Password is required').exists()
], 
async (req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors:errors.array()}); //400 is for bad requests
    }


    const { email, password } = req.body;
    console.log('Received Password:', password);

    try{

        // Validate emil & password
        if (!email || !password) {
            return next(new ErrorResponse('Please provide an email and password', 400));
        }

        //See if user exists
        let user = await User.findOne({ where: { email: email }, attributes: ['email', 'password'] });

        if(!user){
            return res.status(400).json({ errors: [{ msg:'Invalid credentials' }] });
        }

        //Compare the input password, plane text, to the encrypted password.
        const isMatch = await user.matchPassword(password);
        
        if(!isMatch){
            return res.status(401).json({ errors: [{ msg:'Invalid credentials' }] });
        }
    
        //Return jsonwebtoken -> this for users to be logged in right after registration
        sendTokenResponse(user, 200, res);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    

});


module.exports = router;

//@route   GET api/auth/me
//@desc    Get current logged in user
//@access  Private

router.get('/me', auth, async (req, res)=>{
    try {
       const user = await User.findByPk(req.user.id);
       
       if(!user){
        return res.status(400).json({ msg: 'User not found' });
       }

       res.json(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})


//@route   GET api/auth/logout
//@desc    Logout user
//@access  Private

router.get('/logout', auth, async (req, res)=>{
    
})


//Get Token from model, create a cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
  
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
