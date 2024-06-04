const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;
const telegramButtonsModel = require("./telegramButtonsModel");
const searchModel = require("./searchModel");

function askForSignUpInfo (message) {
  database.query(`SELECT * FROM teachers WHERE telegram_id = ${message.chat.id};`
  , async function (err, result, fields) {
    if (err) throw err;
          if (result[0].sign_up_step < 13) 
    telegramButtonsModel.telegramButtons (message,result[0].sign_up_step);
          else {

            database.query( 
              `SELECT searching_step FROM telegram_user WHERE telegram_id = ${message.chat.id}`
          , async function (err, searchResult, fields) {
          if (err) throw err;
              
               if (searchResult[0].searching_step != 0) 
                  searchModel.getSearchingStep(message);

                  else if (message.text == "تعديل") {
                    database.query(`UPDATE teachers SET sign_up_step = 0 ;`, function (err, result, fields) {
                      if (err) throw err;
                      database.query(`DElETE FROM teacher_subject_class WHERE teacher_telegram_id = '${message.chat.id}';`
                      , function (err, result, fields) {
                        if (err) throw err;
                      telegramBot.sendMessage("ما هو اسمك", message.from.id);
                      });
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
                      });
          }
  });
}

module.exports = {askForSignUpInfo}