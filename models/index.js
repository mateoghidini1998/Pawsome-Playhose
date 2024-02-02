const User = require('./User.model');
const UserType = require('./UserType.model');
const Profile = require('./Profile.model');

UserType.belongsToMany(User, { through: 'User_Types' });
User.belongsToMany(UserType, { through: 'User_Types' });
User.hasOne(Profile, { foreignKey: 'user_id' });
Profile.belongsTo(User, { foreignKey: 'user_id' });