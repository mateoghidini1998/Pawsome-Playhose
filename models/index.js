const User = require('./User.model');
const UserType = require('./UserType.model');

UserType.belongsToMany(User, { through: 'User_Types' });
User.belongsToMany(UserType, { through: 'User_Types' });
