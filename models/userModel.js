const database = require("../db/connect");
const TelegramBot = require("../telegram");
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

async function respondToNormalUser() {
    if (message.text == "/start") {
        const replyKeyboard = {
          keyboard: [
            [{ text: "ابحث عن مدرس" }, { text: "انا استاذ" }],
          ],
          resize_keyboard: true,
        };
        await TelegramBot.replyToButtonPressed("من انت ؟", message, replyKeyboard);
      }

    else if (message.text == "انا استاذ") {
         
}   else if (message.text == "ابحث عن مدرس") {
         
}   else {
    TelegramBot.sendmessage("اضغط على /start", message.from.id);
      }
}

function replyToButtonPressed(messageReplyed, message, replyKeyboard) {
    axios.post(`${apiUrl}/sendMessage`, {
      chat_id: message.chat.id,
      text: `${messageReplyed}`,
      reply_markup: JSON.stringify(replyKeyboard),
    });
  }

module.exports = {getNewUser, teacherOrNot}