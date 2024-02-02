const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User.model');
const { UserType } = require('./models/UserType.model');

//Route files
const auth = require('./routes/api/auth');
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');

const app = express();

app.use(cors());

sequelize.authenticate()
 .then(() => {
   console.log('Conexión a la base de datos establecida exitosamente.');
 })
 .catch(err => {
   console.error('No se pudo conectar a la base de datos:', err);
 });

//Body parser
app.use(express.json({ extended:false }));

//Cookie parser
app.use(cookieParser());

//Define routes
app.use('/api/users', users);
app.use('/api/auth', auth);

sequelize.sync()
 .then(() => console.log('Users table synced'))
 .catch(error => console.error('Error while syncronizing Users table:', error));


app.get('/', (req, res) => res.send('API Running'));





//Load env vars
dotenv.config({path: './config/config.env'});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


