const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost", // Default host
  port: 3306, // Default port
  database: "hospital-db", // Replace with the name of your database
});

module.exports = connection;
