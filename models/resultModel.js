const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;


function deleteSearchRow (message) {
    database.query(
        `DELETE FROM searching_steps WHERE telegram_id = '${message.chat.id}'`
        , function (err, finalResult, fields) {
            if (err) throw err;
        }
    );
}

function part2ofSearching(message,teacherResult) {
    console.log(teacherResult.length);
    for (let i = 0; i < teacherResult.length; i++) {
        console.log(`in for ${i}`);
        part3ofSearching(message,teacherResult,i);
    }
}

function part3ofSearching(message,teacherResult,i) {


    database.query(
        `SELECT * FROM teacher_subject_class WHERE teacher_telegram_id = '${teacherResult[i].telegram_id}' AND subject_id = '${studentResult.subject}' AND class_id = '${studentResult.class}' ;`
                    , function (err, subjectResult, fields) {
                    if (err) throw err;
                        console.log('before for');
        
        database.query(
        `SELECT * FROM teachers WHERE teacher_id = '${subjectResult[0].teacher_telegram_id}';`
                    , async function (err, finalResult, fields) {
                    if (err) throw err;
                        if (finalResult.length != 0) {
                            console.log('if true');
                                telegramBot.sendMessage(`${finalResult[0].username} ${finalResult[0].first_name} ${finalResult[0].last_name} ,
                                هاتف : ${finalResult[0].phonenumber} ,
                                المبلغ ${finalResult[0].lowest_price} - ${finalResult[0].highest_price} ليرة سورية`
                                ,message.chat.id);
                            
                            await deleteSearchRow(message);
                        }
                        else {
                            console.log('if false');
                            telegramBot.sendMessage(`لا يوجد مدرسين وفق الشروط المطلوبة`,message.chat.id);
                            await deleteSearchRow(message);
                        }
                        });
                        
                        console.log('after for');
                    });

}

function filterTeachersOut (message) {
    database.query(
        `SELECT * FROM searching_steps WHERE telegram_id = ${message.chat.id};`
        , function (err, studentResult, fields) {
        if (err) throw err;
            if (studentResult[studentResult.length - 1].teacher_gender == 'لا يهم'&& studentResult[studentResult.length - 1].sassion_location == 'لا يهم') {
                database.query(
                `SELECT * FROM teachers WHERE (student_gender = ${studentResult[studentResult.length - 1].gender} OR student_gender = لا يهم) AND locations LIKE %${studentResult[studentResult.length - 1].location}%;`
            , function (err, teacherResult, fields) {
            if (err) throw err;

            part2ofSearching(message,teacherResult);
            });
            }
            else if (studentResult[studentResult.length - 1].teacher_gender == 'لا يهم') {
                database.query(
                    `SELECT * FROM teachers WHERE (student_gender = ${studentResult[studentResult.length - 1].gender} OR student_gender = لا يهم) AND (sassion_location = ${studentResult[studentResult.length - 1].sassion_location} OR sassion_location = لا يهم) AND locations LIKE '%${studentResult[studentResult.length - 1].location}%' ;`
                                , function (err, teacherResult, fields) {
                                if (err) throw err;
                    
                                part2ofSearching(message,teacherResult);
                                });
            }
            else if (studentResult[studentResult.length - 1].sassion_location == 'لا يهم') {
                database.query(
                    `SELECT * FROM teachers WHERE gender = ${studentResult[studentResult.length - 1].teacher_gender} AND (student_gender = ${studentResult[studentResult.length - 1].gender} OR student_gender = لا يهم) AND locations LIKE '%${studentResult[studentResult.length - 1].location}%' ;`
                                , function (err, teacherResult, fields) {
                                if (err) throw err;
                    
                                part2ofSearching(message,teacherResult);
                                });
            }
                else {
        database.query(
`SELECT * FROM teachers WHERE gender = ${studentResult[studentResult.length - 1].teacher_gender} AND (student_gender = ${studentResult[studentResult.length - 1].gender} OR student_gender = لا يهم) AND (sassion_location = ${studentResult[studentResult.length - 1].sassion_location} OR sassion_location = لا يهم) AND locations LIKE '%${studentResult[studentResult.length - 1].location}%' ;`
            , function (err, teacherResult, fields) {
            if (err) throw err;

            part2ofSearching(message,teacherResult);

            /*
            
            for (let i = 0; i < teacherResult.length; i++) {
                console.log(`in for ${i}`);

database.query(
`SELECT * FROM teacher_subject_class WHERE teacher_telegram_id = '${teacherResult[i].telegram_id}' AND subject_id = '${studentResult.subject}' AND class_id = '${studentResult.class}' ;`
            , function (err, subjectResult, fields) {
            if (err) throw err;
                console.log('before for');

database.query(
`SELECT * FROM teachers WHERE teacher_id = '${subjectResult[0].teacher_telegram_id}';`
            , async function (err, finalResult, fields) {
            if (err) throw err;
                if (finalResult.length != 0) {
                    console.log('if true');
                        telegramBot.sendMessage(`${finalResult[0].username} ${finalResult[0].first_name} ${finalResult[0].last_name} ,
                        هاتف : ${finalResult[0].phonenumber} ,
                        المبلغ ${finalResult[0].lowest_price} - ${finalResult[0].highest_price} ليرة سورية`
                        ,message.chat.id);
                    
                    await deleteSearchRow(message);
                }
                else {
                    console.log('if false');
                    telegramBot.sendMessage(`لا يوجد مدرسين وفق الشروط المطلوبة`,message.chat.id);
                    await deleteSearchRow(message);
                }
                });
                
                console.log('after for');
            }); 
        } */
        });

    }
    });
    console.log('end');
}



module.exports = {filterTeachersOut}