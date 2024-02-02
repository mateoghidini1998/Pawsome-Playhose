const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


User.addHook('beforeCreate', async (user, options) => {
    if (user.password) {
        console.log('Original Password:', user.password);
        const salt = await bcrypt.genSalt(10);
        console.log('Generated Salt:', salt);
        user.password = await bcrypt.hash(user.password, salt);
        console.log('Hashed Password:', user.password);
    }
});


   
User.prototype.getSignedJwtToken = function() {
    /* console.log('This: ', this.id); */
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
       expiresIn: process.env.JWT_EXPIRE
    });
};



   
User.prototype.matchPassword = function(enteredPassword) {
    console.log('Entered Password:', enteredPassword);
    console.log('Stored Password:', this.password);
    
    try {
        const isMatch = bcrypt.compareSync(enteredPassword.trim(), this.password.trim());
        console.log('Password Match Result:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('Error in matchPassword:', error);
        return false;
    }
};



module.exports = User;