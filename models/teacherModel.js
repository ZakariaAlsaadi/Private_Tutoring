const database = require("../db/connect");
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
  , function (err, result, fields) {
          if (result[0].sign_up_step < 13) 
    telegramButtonsModel.telegramButtons (message,result[0].sign_up_step);
          else {
                  if (message.text == "تعديل") {
                    database.query("UPDATE teachers SET sign_up_step = 0 ;", function (err, result, fields) {
                      if (err) throw err;
                      telegramBot.sendMessage("ما هو اسمك", message.from.id);
                    });
                  }
                  else if (message.text == "ابحث عن مدرس" ) 
                        searchModel.searchingForTeachers(message);
                  else 
                        telegramBot.sendMessage("اضغط على /start لاظهار الخدمات المتاحة", message.from.id);
          }
  });
}

module.exports = {getTeachers, askForSignUpInfo}