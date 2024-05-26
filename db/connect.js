var mysql = require('mysql');
const Module = require("module");
require('dotenv').config({ path: './.env' });

let con = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_pass,
    database:process.env.db_name,
    port:process.env.db_port
});

con.connect(function(err) {
    if (err) {
        console.log('Database Not connected')
    }else{
        console.log("DB Connected!");
    }
});

Module.export =con;