const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;

function filterTeachersOut (message) {
    database.query(
        `SELECT * FROM searching_steps WHERE telegram_id = ${message.chat.id};`
        , function (err, studentResult, fields) {
        if (err) throw err;

        database.query(
`SELECT * FROM teachers WHERE gender = '${studentResult[0].teacher_gender}' AND student_gender = '${studentResult[0].gender}' AND sassion_location = '${studentResult[0].sassion_location}' AND locations LIKE '%${studentResult[0].location}%' ;`
            , function (err, teacherResult, fields) {
            if (err) throw err;

database.query(
`SELECT * FROM teacher_subject_class WHERE teacher_telegram_id = '${teacherResult.telegram_id}' AND subject_id = '${studentResult.subject}' AND class_id = '${studentResult.class}' ;`
            , function (err, subjectResult, fields) {
            if (err) throw err;

            for (let index = 0; index < subjectResult.length; index++) {

database.query(
`SELECT * FROM teachers WHERE teacher_id = '${subjectResult[i].teacher_telegram_id}';`
            , async function (err, finalResult, fields) {
            if (err) throw err;
                if (finalResult.length != 0) {
                    
                        telegramBot.sendMessage( 
                        `${finalResult[0].username} ${finalResult[0].first_name} ${finalResult[0].last_name} ,
                        هاتف : ${finalResult[0].phonenumber} ,
                        المبلغ ${finalResult[0].lowest_price} - ${finalResult[0].highest_price} ليرة سورية`
                        ,message.chat.id);
                    
                    await deleteSearchRow(message);
                }
                else {
                    telegramBot.sendMessage(`لا يوجد مدرسين وفق الشروط المطلوبة`,message.chat.id);
                    deleteSearchRow(message);
                }
                });
                }
            });
        });
    });
}

function deleteSearchRow (message) {
    database.query(
        `DELETE FROM searching_steps WHERE telegram_id = '${message.chat.id}'`
        , function (err, finalResult, fields) {
            if (err) throw err;
        }
    );
}

module.exports = {filterTeachersOut}