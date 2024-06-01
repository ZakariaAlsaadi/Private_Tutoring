const database = require("../db/connect");
const telegramButtonsModel = require("./telegramButtonsModel");

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
function updateSignUp (message,step_number) {
  step_number = Math.min(step_number,10);
  database.query(`SELECT * FROM sign_up_steps`, function (err, teacher_step, fields) 
  {  
    if (err) throw err;
            database.query(
              `UPDATE teachers SET ${teacher_step[step_number].the_step} = '${message.text}' , sign_up_step = ${step_number} WHERE telegram_id = ${message.chat.id};`
            , function (err, result, fields) 
      {
            if (err) throw err;
            console.log('success');
      });
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

module.exports = {getTeachers, updateSignUp, askForSignUpInfo}