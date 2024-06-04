const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;
const teacherModel = require("./teacherModel");
const searchModel = require('./searchModel')

function getNewUser (message) {
    database.query(`SELECT telegram_id FROM telegram_user WHERE telegram_id = ${message.chat.id}`,
            function (err, result, fields) {
        if (err) throw err;
        if (result.length == 0) {
            database.query(
                `INSERT INTO telegram_user (id, user_name, first_name, last_name, telegram_id, teacher_profile_id) VALUES (NULL, '@${message.chat.username}', '${message.chat.first_name}', '${message.chat.last_name}', '${message.chat.id}', NULL);`
            , function (err, result, fields) {
                if (err) throw err;
                console.log('added to the table');
            });
        }
        console.log('success');
    });
}

function teacherOrNot (message)  // محمد لاقي اسم
{ 
     database.query( 
        `SELECT telegram_id FROM teachers WHERE telegram_id = ${message.chat.id}`
    , function (err, teacherResult, fields) {
    if (err) throw err;  

    database.query( 
        `SELECT searching_step FROM telegram_user WHERE telegram_id = ${message.chat.id}`
    , function (err, searchResult, fields) {
    if (err) throw err;

        if (teacherResult.length != 0)
            teacherModel.askForSignUpInfo(message);
        
        else if (searchResult[0].searching_step != 0) 
            searchModel.getSearchingStep(message);
    
        else  
        respondToNormalUser(message);
    });
    });
}

async function respondToNormalUser(message) {
    if (message.text == "/start") {
        const replyKeyboard = {
          keyboard: [
            [{ text: "ابحث عن مدرس" }, { text: "انا استاذ" }],
          ],
          resize_keyboard: true,
        };
        await telegramBot.sendMessage("من انت ؟", message.chat.id, replyKeyboard);
      }

    else if (message.text == "انا استاذ") {
        telegramBot.sendMessage("ما هو اسمك", message.from.id);

        database.query(
            `INSERT INTO teachers (username, telegram_id) VALUES ('@${message.chat.username}', '${message.chat.id}');`
            , function (err, resu, fields) {

        database.query(
            `SELECT id FROM teachers WHERE telegram_id = ${message.chat.id};`
            , function (err, result, fields) {
        database.query(
            `UPDATE telegram_user SET teacher_profile_id = ${result[0].id} WHERE telegram_id = ${message.chat.id};`
            , function (err, res, fields) 
            {
                  if (err) throw err;
            });
        });
    });
}
    else if (message.text == "ابحث عن مدرس") 
            searchModel.getSearchingStep(message);
    else 
            telegramBot.sendMessage("اضغط على /start لاظهار الخدمات المتاحة", message.from.id);   
}

module.exports = {getNewUser, teacherOrNot}