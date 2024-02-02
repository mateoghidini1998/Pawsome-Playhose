const { faker } = require('@faker-js/faker/locale/en');
const sequelize = require('./config/db');
const User = require('./models/User.model');
const UserType = require('./models/UserType.model');

async function seedDatabase() {
  
    //Deactivate Foreing Keys
    await sequelize.query('SET FOREIGN_KEY_CHECKS=0;');

    // Truncate tables
    await User.destroy({ where: {}, truncate: true });
    await UserType.destroy({ where: {}, truncate: true });

    // Truncate user_types table
    await sequelize.query('TRUNCATE TABLE user_types;');

    // Reactivate Foreign Keys
    await sequelize.query('SET FOREIGN_KEY_CHECKS=1;');
    
    const users = Array.from({ length: 100 }, () => ({
       name: faker.person.firstName(),
       lastname: faker.person.lastName(),
       email: faker.internet.email().toLowerCase(),
       password: faker.internet.password(),
       createdAt: new Date(),
       updatedAt: new Date()
    }));

    const userTypes = [
        {
            id: 1,
            type: 'House Sitter'
        },
        {
            id: 2,
            type: 'Pet Sitter'
        }
    ];
   
    await User.bulkCreate(users);
    await UserType.bulkCreate(userTypes);

    const createdUsers = await User.findAll();
    const createdUserTypes = await UserType.findAll();

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
       
        // Mientras queden elementos para mezclar
        while (currentIndex !== 0) {
       
           // Selecciona un elemento restante
           randomIndex = Math.floor(Math.random() * currentIndex);
           currentIndex--;
       
           // Y cámbialo con el elemento actual
           [array[currentIndex], array[randomIndex]] = [
             array[randomIndex], array[currentIndex]
           ];
        }
       
        return array;
       }
       


    // Generate data for table `user_types`
    const userTypesData = createdUsers.flatMap((user) => {
        return shuffle(createdUserTypes).filter(() => Math.random() < 0.5).map(userType => ({
             UserId: user.id,
             UserTypeId: userType.id
        }));
    });
       

    // Insert data on `user_types`
    await sequelize.query(`INSERT INTO user_types (UserId, UserTypeId) VALUES ${userTypesData.map(row => `(${row.UserId}, ${row.UserTypeId})`).join(', ')};`);
}


seedDatabase();