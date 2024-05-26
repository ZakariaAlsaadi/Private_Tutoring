const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const request = require("request");
const axios = require("axios");
const http = require("http");
const app = express();
app.use(bodyParser.json());
app.use(express.json());
const port = process.env.PORT || 4040;
const server = http.createServer(app);
const token = "5232088474:AAHHrA2KbFkHH5VhrOn68QR-rDwxdECLU3o";


const database = require("./db/connect");

// Start the server
app.get('/', (req,res) => {

    database.query("SELECT * FROM teachers", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
        
      });

});


// Start the server
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});