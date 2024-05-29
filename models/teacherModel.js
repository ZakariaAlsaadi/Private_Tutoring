const database = require("../db/connect");

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

  database.query(`SELECT * FROM sing_up_steps`, function (err, the_step, fields) 
  {  
    if (err) throw err;
            database.query(
              `UPDATE teachers SET ${the_step[step_number].the_step} = '${text}' WHERE telegram_id = ${telegramId};`
            , function (err, result, fields) 
      {
            if (err) throw err;
            console.log('success');
      });
  });
}

function askForSignUpInfo () {
  console.log('askForSingInfo')
}

module.exports = {getTeachers, updateSignUp, askForSignUpInfo}