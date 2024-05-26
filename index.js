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


// Start the server
app.get('/', (req,res) => {
    res.send('hi');
});


// Start the server
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});