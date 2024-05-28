const database = require("../db/connect");

function getTeachers () {
    database.query("SELECT * FROM teachers", function (err, result, fields) {
        if (err) throw err;
        return result;
      });
}

function updateFirstName (text,telegramId) {
    database.query(`UPDATE teachers
    SET first_name = '${text}'
    WHERE telegram_id = ${telegramId};
    `, function (err, result, fields) {
        if (err) throw err;
        console.log('success');
      });

}

module.exports = {getTeachers, updateFirstName}