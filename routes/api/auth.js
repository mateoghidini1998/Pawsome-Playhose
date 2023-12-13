const express = require('express');
const router = express.Router();
const User = require('../../models/user.model.js');
const auth = require('../../middleware/auth');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check , validationResult } = require('express-validator/');


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

    try{
        //See if user exists

        let user = await User.findOne({ where: { email: email } });

        if(!user){
            return res.status(400).json({ errors: [{ msg:'Invalid credentials' }] });
        }

        //Compare the input password, plane text, to the encrypted password.
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            return res.status(400).json({ errors: [{ msg:'Invalid credentials' }] });
        }
    
        //Return jsonwebtoken -> this for users to be logged in right after registration

        const payload = {
            user:{
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 360000}, //change to 3600 for production
            (err, token)=>{
                if(err) throw err;
                res.json({ token });
            }
            )

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    

});


module.exports = router;