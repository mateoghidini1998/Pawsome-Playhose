const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserType = sequelize.define('UserType', {
    id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('House Sitter', 'Pet Sitter'),
        allowNull: false
    }
});


module.exports = UserType;