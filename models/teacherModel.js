const database = require("../db/connect");
const telegramButtonsModel = require("./telegramButtonsModel");

function getTeachers () {
    database.query("SELECT * FROM teachers", function (err, result, fields) {
        if (err) throw err;
        return result;
      });
}

function askForSignUpInfo (message) {
  database.query(`SELECT * FROM teachers WHERE telegram_id = ${message.chat.id};`
  , function (err, result, fields) {
          if (result[0].sign_up_step < 11) 
    telegramButtonsModel.telegramButtons (message,result[0].sign_up_step);
          else
    console.log('later');
  });
}

module.exports = {getTeachers, askForSignUpInfo}