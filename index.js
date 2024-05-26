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
const apiUrl = `https://api.telegram.org/bot${token}`;
const webHook = `${myServerUrl}webhook`;

const database = require("./db/connect");

// Start the server webpage
app.get('/', (req,res) => {

    database.query("SELECT * FROM teachers", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      });
});

// Telegram Bot messages
app.post("/webhook", async (req, res) => {
    const { message } = req.body;
    check_who_is_sending(message); // بدي شيك اذا هو استاذ او طالب وبأنو مرحلة 
});

function check_who_is_sending(message) {
    console.log(message,"نكمل لاحقا");
}

// Start the server
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});