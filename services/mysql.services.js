const mysql = require('mysql2/promise');
const config = require('../env/mysql.config');

const pool = mysql.createPool(config);

module.exports = pool;