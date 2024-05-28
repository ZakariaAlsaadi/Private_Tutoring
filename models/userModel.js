const database = require("../db/connect");

module.exports = function getNewUser (chat) 
{
    database.query("SELECT telegram_id FROM telegram_user", function (err, result, fields) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            if (result[i].telegram_id == chat.id) {
              isExist = false;
              break;
            }
        }
        if (isExist == false) {
            database.query(
            `INSERT INTO 'telegram_user' ('id', 'user_name', 'first_name', 'last_name', 'telegram_id', 'teacher_profile_id') 
            VALUES (NULL, '@${chat.username}', '${chat.first_name}', '${chat.last_name}', '${chat.id}', NULL;`
            , function (err, result, fields) {
                if (err) throw err;
                console.log('success');
            });
        }
      });
}