const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;

function sendTeachersList (message,teacherResult) {

    if (teacherResult.length != 0) {
        telegramBot.sendMessage(
            `${teacherResult[0].username} ${teacherResult[0].first_name} ${teacherResult[0].last_name} ,
            هاتف : ${teacherResult[0].phonenumber} ,
            المبلغ ${teacherResult[0].lowest_price} - ${teacherResult[0].highest_price} ليرة سورية`
            ,message.chat.id
        );

        telegramBot.sendMessage(
            `لقد ظهرت في نتائج بحث`
            , teacherResult[0].telegram_id
        );
    }
}

function filterTeachersOut2 (message,studentResult,subjectResult,studentRow) {
    for (let i = 0; i < subjectResult.length; i++) {
        database.query(
`SELECT * FROM teachers WHERE telegram_id = ${subjectResult[i].teacher_telegram_id} AND locations LIKE '%${studentResult[studentRow].location}%' AND (student_gender = '${studentResult[studentRow].gender}' OR student_gender = 'لا يهم');`
            , function (err, teacherResult, fields) {
            if (err) throw err;
            sendTeachersList(message,teacherResult);
        });
    }
    telegramBot.sendMessage("انتهت عملية البحث , شكرا لاستخدام خدمتنا.", message.chat.id);
}

function filterTeachersOut3 (message,studentResult,subjectResult,studentRow) {
    for (let i = 0; i < subjectResult.length; i++) {
        database.query(
`SELECT * FROM teachers WHERE telegram_id = ${subjectResult[i].teacher_telegram_id} AND locations LIKE '%${studentResult[studentRow].location}%' AND (student_gender = '${studentResult[studentRow].gender}' OR student_gender = 'لا يهم') AND (sassion_location = '${studentResult[studentRow].gender}' OR sassion_location = 'لا يهم');`
        , function (err, teacherResult, fields) {
            if (err) throw err;
            sendTeachersList(message,teacherResult);
        });
    }
    telegramBot.sendMessage("انتهت عملية البحث , شكرا لاستخدام خدمتنا.", message.chat.id);
}

function filterTeachersOut4 (message,studentResult,subjectResult,studentRow) {
    for (let i = 0; i < subjectResult.length; i++) {
        database.query(
`SELECT * FROM teachers WHERE telegram_id = ${subjectResult[i].teacher_telegram_id} AND locations LIKE '%${studentResult[studentRow].location}%' AND (student_gender = '${studentResult[studentRow].gender}' OR student_gender = 'لا يهم') AND (gender = '${studentResult[studentRow].teacher_gender}' OR gender = 'لا يهم');`
        , function (err, teacherResult, fields) {
            if (err) throw err;
            sendTeachersList(message,teacherResult);
        });
    }
    telegramBot.sendMessage("انتهت عملية البحث , شكرا لاستخدام خدمتنا.", message.chat.id);
}

function filterTeachersOut5 (message,studentResult,subjectResult,studentRow) {
    for (let i = 0; i < subjectResult.length; i++) {
        database.query(
`SELECT * FROM teachers WHERE telegram_id = ${subjectResult[i].teacher_telegram_id} AND locations LIKE '%${studentResult[studentRow].location}%' AND (student_gender = '${studentResult[studentRow].gender}' OR student_gender = 'لا يهم') AND (sassion_location = '${studentResult[studentRow].gender}' OR sassion_location = 'لا يهم') AND (gender = '${studentResult[studentRow].teacher_gender}' OR gender = 'لا يهم');`
        , function (err, teacherResult, fields) {
            if (err) throw err;
            sendTeachersList(message,teacherResult);
        });
    }
    telegramBot.sendMessage("انتهت عملية البحث , شكرا لاستخدام خدمتنا.", message.chat.id);
}

function filterTeachersOut (message) {  
    database.query(
        `SELECT * FROM searching_steps WHERE telegram_id = '${message.chat.id}';`
        , function (err, studentResult, fields) {
        if (err) throw err; 
            let studentRow = studentResult.length -1;
        database.query(
`SELECT * FROM teacher_subject_class WHERE subject_id = '${studentResult[studentRow].subject}' AND class_id = '${studentResult[studentRow].class}';`
            , function (err, subjectResult, fields) {
            if (err) throw err;
            if (studentResult[studentRow].teacher_gender == 'لا يهم'&& studentResult[studentRow].sassion_location == 'لا يهم') {
                filterTeachersOut2(message,studentResult,subjectResult,studentRow);
             }
            else if (studentResult[studentRow].teacher_gender == 'لا يهم') {
                filterTeachersOut3(message,studentResult,subjectResult,studentRow);
                }
            else if (studentResult[studentRow].sassion_location == 'لا يهم') {
                filterTeachersOut4(message,studentResult,subjectResult,studentRow);
            }
            else {
                filterTeachersOut5(message,studentResult,subjectResult,studentRow);
            }
            });
        });
}

module.exports = {filterTeachersOut}