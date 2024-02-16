const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const Redis = require('ioredis');


//Create Redis Client
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
});

//Connect and Disconnect from Redis
redis.on('connect', () => {
  console.log('Redis connected successfully');
});

process.on('SIGINT', () => {
  redis.quit(() => {
    console.log('Disconnected from Redis due to signal SIGINT');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  redis.quit(() => {
    console.log('Disconnected from Redis due to signal SIGTERM');
    process.exit(0);
  });
});


//Route files
const auth = require('./routes/api/auth');
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');

const app = express();

app.use(cors());

//Sequelize connection to DB
sequelize.authenticate()
 .then(() => {
   console.log('Connection to DB successfully stablished.');
 })
 .catch(err => {
   console.error('Erro while trying to connect to DB:', err);
 });

//Body parser
app.use(express.json({ extended:false }));

//Cookie parser
app.use(cookieParser());

//Define routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/profiles', profiles);


sequelize.sync()
 .then(() => console.log('Tables Synced'))
 .catch(error => console.error('Error while syncronizing table:', error));

app.get('/', (req, res) => res.send('API Running'));

//Load env vars
dotenv.config({path: './config/config.env'});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


