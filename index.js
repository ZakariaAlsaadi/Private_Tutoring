const teacherModel = require("./models/teacherModel");
const userModel = require("./models/userModel");
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const TelegramBot =  require('./telegram');
const app = express();
app.use(bodyParser.json());
app.use(express.json());
const port = process.env.PORT || 4040;
const server = http.createServer(app);
const database = require("./db/connect");
require('dotenv').config();

const token = process.env.bot_token;
const telegramBot = new TelegramBot(token);




function handleUserMessage(telegramResponse)
{
    const message = telegramResponse.message;

    try {

        userModel.getNewUser(message);

        userModel.teacherOrNot(message);
    }catch (e){
        console.log(e)
    }
}



// Function to continuously get updates
const getContinuousUpdates = async () => {
    try {
        const messages = await telegramBot.getUpdates();
        if (messages.length > 0) {
            messages.forEach(message=>{
                handleUserMessage(message)
            })
            // Process the messages here
        }
        // Call the function recursively to continue receiving updates
        await getContinuousUpdates();
    } catch (error) {
        console.error('Error getting messages:', error);
        // Retry after an error
        setTimeout(getContinuousUpdates, 1000);
    }
};

// Start receiving updates
getContinuousUpdates()


// Start the server webpage
app.get('/', (req,res) => {
    database.query(`SELECT * FROM teachers;`, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      });
});

// Start the server
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});