const database = require("../db/connect");

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

function teacher1other0 (chat)  // محمد لاقي اسم
{ 
     database.query( 
        `SELECT teacher_profile_id, telegram_id  FROM telegram_user WHERE telegram_id = ${chat.id}`
    , function (err, result, fields) {
    if (err) throw err;  
        if (result[0].teacher_profile_id == null)
            poolResult = 0;
        else  poolResult = 1;
    });
return poolResult; // ماعم يستنى الداتا بيز
}


module.exports = {getNewUser, teacher1other0}