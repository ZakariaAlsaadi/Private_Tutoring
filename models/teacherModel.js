const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;
const telegramButtonsModel = require("./telegramButtonsModel");
const searchModel = require("./searchModel");

function getTeachers () {
    database.query("SELECT * FROM teachers", function (err, result, fields) {
        if (err) throw err;
        return result;
      });
}

function askForSignUpInfo (message) {
  database.query(`SELECT * FROM teachers WHERE telegram_id = ${message.chat.id};`
  , async function (err, result, fields) {
    if (err) throw err;
          if (result[0].sign_up_step < 13) 
    telegramButtonsModel.telegramButtons (message,result[0].sign_up_step);
          else {
                  if (message.text == "تعديل") {
                    database.query("UPDATE teachers SET sign_up_step = 0 ;", function (err, result, fields) {
                      if (err) throw err;
                      telegramBot.sendMessage("ما هو اسمك", message.from.id);
                    });
                  }
                  else if (message.text == "/start") {
                    const replyKeyboard = {
                      keyboard: [[{ text: "ابحث عن مدرس" },{ text: "تعديل" }],],
                      resize_keyboard: true,
                    };
                    await telegramBot.sendMessage("اختر احد الازرار في الاسفل", message.chat.id, replyKeyboard);
                  }
                  else if (message.text == "ابحث عن مدرس") 
                        searchModel.getSearchingStep(message);
                  else 
                        telegramBot.sendMessage("اضغط على /start لاظهار الخدمات المتاحة", message.from.id);
          }
  });
}

module.exports = {getTeachers, askForSignUpInfo}