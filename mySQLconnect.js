const mysql = require("mysql2");
require("dotenv").config();

// MySQL Database Connection
const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "Vungkhual10!!", // Replace with your actual password
    database: "gamedata"
  });
module.exports = pool.promise(); 
