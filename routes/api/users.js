const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
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
 
        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);


        //Create user
        user = await User.create({ name, lastname, email, password:hashedPassword });

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


        return res.status(201).json({ user });
 
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
 
 });
 
module.exports = router;

//@route    GET api/users
//@desc     Get all users
//@access   Public

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }

});

//@route    GET api/users/:id
//@desc     Get user by id
//@access   Public

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        res.json(user);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});