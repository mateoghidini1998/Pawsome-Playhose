const express = require('express');
const router = express.Router();
const User = require('../../models/user.model.js');
const { check , validationResult } = require('express-validator/');

//@route    POST api/users
//@desc     Register a user
//@access   Public

router.post('/', [
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
        return res.status(201).json({ user });
 
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
 
 });
 
module.exports = router;