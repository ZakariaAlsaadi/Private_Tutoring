const database = require("../db/connect");
const TelegramButtonsModel = require("./telegramButtonsModel");
const telegramButtonsModel = new TelegramButtonsModel;

function getTeachers () {
    database.query("SELECT * FROM teachers", function (err, result, fields) {
        if (err) throw err;
        return result;
      });
}
/*
function updateFirstName (text,telegramId) {
    database.query(`UPDATE teachers
    SET first_name = '${text}'
    WHERE telegram_id = ${telegramId};
    `, function (err, result, fields) {
        if (err) throw err;
        console.log('success');
      });

}
*/
function updateSignUp (text,telegramId,step_number) 
{

  database.query(`SELECT * FROM sign_up_steps`, function (err, teacher_step, fields) 
  {  
    if (err) throw err;
            database.query(
              `UPDATE teachers SET ${teacher_step[step_number].the_step} = '${text}' WHERE telegram_id = ${telegramId};`
            , function (err, result, fields) 
      {
            if (err) throw err;
            console.log('success');
      });
  });
}

function askForSignUpInfo (message) {
  database.query(`SELECT * FROM teachers WHERE telegram_id = ${message};`
  , function (err, result, fields) {
    telegramButtonsModel.telegramButtons`${result[0].sign_up_step}`(meesage);
          updateSignUp(message.text , message.chat.id , result[0].sign_up_step);
  });
}

module.exports = {getTeachers, updateSignUp, askForSignUpInfo}