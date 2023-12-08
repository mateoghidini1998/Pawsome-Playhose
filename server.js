const express = require('express');
const sequelize = require('./config/db');

const app = express();

sequelize.authenticate()
 .then(() => {
   console.log('Conexión a la base de datos establecida exitosamente.');
 })
 .catch(err => {
   console.error('No se pudo conectar a la base de datos:', err);
 });


app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


