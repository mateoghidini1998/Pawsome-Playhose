const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const User = require('../../models/user.model.js');
const { check , validationResult } = require('express-validator/');


 
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