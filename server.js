const express = require('express');
const sequelize = require('./config/db');
const { User } = require('./models/user.model.js');

const app = express();

sequelize.authenticate()
 .then(() => {
   console.log('Conexión a la base de datos establecida exitosamente.');
 })
 .catch(err => {
   console.error('No se pudo conectar a la base de datos:', err);
 });

app.use(express.json({ extended:false }));

sequelize.sync()
 .then(() => console.log('Users table synced'))
 .catch(error => console.error('Error while syncronizing Users table:', error));


app.get('/', (req, res) => res.send('API Running'));

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


