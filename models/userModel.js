const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;
const teacherModel = require("./teacherModel");

function getNewUser (chat) {
    database.query(`SELECT telegram_id FROM telegram_user WHERE telegram_id = ${chat.id}`,
            function (err, result, fields) {
        if (err) throw err;
        if (result.length == 0) {
            database.query(
                `INSERT INTO telegram_user (id, user_name, first_name, last_name, telegram_id, teacher_profile_id) VALUES (NULL, '@${chat.username}', '${chat.first_name}', '${chat.last_name}', '${chat.id}', NULL);`
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
        `SELECT teacher_profile_id, telegram_id  FROM telegram_user WHERE telegram_id = ${message.chat.id}`
    , function (err, result, fields) {
    if (err) throw err;  
        if (result[0].teacher_profile_id == null)
            respondToNormalUser(message);
        else  teacherModel.askForSignUpInfo(message);
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
        await telegramBot.replyToButtonPressed("من انت ؟", message, replyKeyboard);
      }

    else if (message.text == "انا استاذ") {
        telegramBot.sendMessage("ما هو اسمك", message.from.id);

        database.query(
            `INSERT INTO teachers (telegram_id) VALUES ('${message.chat.id}');`
            , function (err, result, fields) {
        database.query(
            `UPDATE telegram_user SET teacher_profile_id = ${result[result.length - 1].id};`
            , function (err, res, fields) 
            {
                  if (err) throw err;
            });
        });

}   else if (message.text == "ابحث عن مدرس") {
         
}   else {
    telegramBot.sendMessage("اضغط على /start", message.from.id);
      }
}

module.exports = {getNewUser, teacherOrNot}