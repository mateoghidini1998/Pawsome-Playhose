var mysql = require('mysql');
var connection = mysql.createConnection({
   host : 'localhost',
   database : 'pawsome_db',
   user : 'root',
   password : '',
});

connection.connect(function(err) {
   if (err) {
       console.error('Connection error: ' + err.stack);
       return;
   }
   console.log('Connected to Identifier ' + connection.threadId);
   console.log('Connected to database ' + connection.config.database);
   console.log('Connection State ' + connection.state);
});

module.exports = connection;