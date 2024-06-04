const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;

function filterTeachersOut (message) {
    database.query(
        `SELECT * FROM searching_steps WHERE telegram_id = ${message.chat.id};`
        , function (err, studentResult, fields) {
        if (err) throw err;

        database.query(
`SELECT * FROM teachers WHERE gender = '${studentResult.teacher_gender}' AND student_gender = '${studentResult.gender}' AND sassion_location = '${studentResult.sassion_location}' AND locations LIKE '%${studentResult.location}%' ;`
            , function (err, teacherResult, fields) {
            if (err) throw err;

database.query(
`SELECT * FROM teacher_subject_class WHERE teacher_telegram_id = '${teacherResult.telegram_id}' AND subject_id = '${studentResult.subject}' AND class_id = '${studentResult.class}' ;`
            , function (err, subjectResult, fields) {
            if (err) throw err;

database.query(
`SELECT * FROM teachers WHERE teacher_id = '${subjectResult.teacher_telegram_id}';`
            , async function (err, finalResult, fields) {
            if (err) throw err;
                if (finalResult.length == 0) {
                    for (let index = 0; index < finalResult.length; index++) {
                        telegramBot.sendMessage( 
                        `${finalResult.username} ${finalResult.first_name} ${finalResult.last_name} ,
                        هاتف : ${finalResult.phonenumber} ,
                        المبلغ ${finalResult.lowest_price} - ${finalResult.highest_price} ليرة سورية`
                        ,message.chat.id);
                    }
                    await deleteSearchRow(message);
                }
                else {
                    telegramBot.sendMessage(`لا يوجد مدرسين وفق الشروط المطلوبة`,message.chat.id);
                    deleteSearchRow(message);
                }
                });
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