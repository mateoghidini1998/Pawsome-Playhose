const { faker } = require('@faker-js/faker/locale/en');

const User = require('./models/User.model');

async function seedDatabase() {
    
    console.log(faker.name);
    const users = Array.from({ length: 100 }, () => ({
       name: faker.name.firstName(),
       lastname: faker.name.lastName(),
       email: faker.internet.email().toLowerCase(),
       password: faker.internet.password(),
       createdAt: new Date(),
       updatedAt: new Date()
    }));
   
    await User.bulkCreate(users);
}


seedDatabase();