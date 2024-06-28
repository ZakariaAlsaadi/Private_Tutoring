const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;

function stepPlus (message) {
  database.query(
    `SELECT sign_up_step FROM teachers WHERE telegram_id = '${message.chat.id}';`
    , function (err, teacher_step, fields) 
    {  
      if (err) throw err;
        database.query(
          `UPDATE teachers SET sign_up_step = ${teacher_step[0].sign_up_step} + 1 WHERE telegram_id = '${message.chat.id}';`
          , function (err, result, fields) 
              {
                  if (err) throw err;
        });
  });
}

function stepMinusTwo (message) {
  database.query(
    `SELECT sign_up_step FROM teachers WHERE telegram_id = '${message.chat.id}';`
    , function (err, teacher_step, fields) 
    {  
      if (err) throw err;

        database.query(
          `UPDATE teachers SET sign_up_step = ${teacher_step[0].sign_up_step} - 2 WHERE telegram_id = '${message.chat.id}';`
          , function (err, result, fields) 
              {
                  if (err) throw err;
        });
  });
}

function insertSubjects (message) {
        database.query(
          `INSERT INTO teacher_subject_class (teacher_telegram_id, subject_id) VALUES ('${message.chat.id}', '${message.text}');`
          , function (err, result, fields) 
          {  if (err) throw err; 
           });
  stepPlus(message);
}

function insertClass (message) {
  database.query(
    `SELECT * FROM teacher_subject_class WHERE teacher_telegram_id = '${message.chat.id}';`
    , function (err, result, fields) 
    {  if (err) throw err; 

      database.query(
        `UPDATE teacher_subject_class SET class_id = '${message.text}' WHERE id = ${result[result.length -1].id};`
        , function (err, result, fields) 
        {  if (err) throw err;  });
    });
  stepPlus(message);
}

async function subjectsButtons (askingForSubjectOrClass, message, subjectOrClass) {

    if (subjectOrClass == "subject") {
        database.query(`SELECT subject FROM subjects ;`, async function (err, subjectOrClassList, fields) 
    {  
      if (err) throw err;
            
    var KeyBoardRow = [];
    var keyBoard = [];
    for (let j = 0; j < subjectOrClassList.length; j++) {
      if (j % 3 == 0) {
        keyBoard.push(KeyBoardRow);
        KeyBoardRow = [];
      }
      KeyBoardRow.push({ text: `${subjectOrClassList[j].subject}` });
    }
    if (KeyBoardRow.length != 0) {
      keyBoard.push(KeyBoardRow);
      KeyBoardRow = [];
    }
    const replyKeyboard = {
      keyboard: keyBoard,
      resize_keyboard: true,
    };
    await telegramBot.sendMessage(askingForSubjectOrClass, message.chat.id, replyKeyboard);
    });

    }
    else if (subjectOrClass == "class") {
        database.query(`SELECT class_name FROM classes ;`, async function (err, subjectOrClassList, fields) 
    {  
      if (err) throw err;
            
    var KeyBoardRow = [];
    var keyBoard = [];
    for (let j = 0; j < subjectOrClassList.length; j++) {
      if (j % 3 == 0) {
        keyBoard.push(KeyBoardRow);
        KeyBoardRow = [];
      }
      KeyBoardRow.push({ text: `${subjectOrClassList[j].class_name}` });
    }
    if (KeyBoardRow.length != 0) {
      keyBoard.push(KeyBoardRow);
      KeyBoardRow = [];
    }
    const replyKeyboard = {
      keyboard: keyBoard,
      resize_keyboard: true,
    };
    await telegramBot.sendMessage(askingForSubjectOrClass, message.chat.id, replyKeyboard);
    });
    }
    else {
        return 0 ;
    }
}

async function subjectsSection (message,step_number) {
        if (step_number == 10) {
          database.query(`SELECT subject FROM subjects ;`, async function (err, result, fields) 
          {  
            if (err) throw err;
            result = JSON.stringify(result);
            if (result.includes(message.text) == true) { 
              subjectsButtons ('اختر المرحلة الصفية المناسبة', message, "class");
              insertSubjects (message);
            }
            else {
              telegramBot.sendMessage('اختر مادة من قائمة الازرار في الاسفل',message.chat.id);
            }
          });
        }
        else if (step_number == 11) {

          

          database.query(`SELECT class_name FROM classes ;`, async function (err, result, fields) 
          {  
            if (err) throw err;
            result = JSON.stringify(result);
            if (result.includes(message.text) == true) { 
              insertClass(message);
              const replyKeyboard = {
                keyboard: [[{ text: "نعم" }],[{ text: "لا" }]],
                resize_keyboard: true,
              };
              await telegramBot.sendMessage("هل تود باضافة مادة جديدة", message.chat.id, replyKeyboard);
            }
            else {
              telegramBot.sendMessage('اختر صف من قائمة الازرار في الاسفل',message.chat.id);
            }
          });
        }

        else if (step_number == 12) {
          if (message.text == "نعم") {
            stepMinusTwo(message);
            subjectsButtons("اختر المادة" , message , 'subject');
          }
          else if (message.text == "لا") {
            stepPlus(message);
            const replyKeyboard = {
              keyboard: [[{ text: "ابحث عن مدرس" },{ text: "تعديل" }],],
              resize_keyboard: true,
            };
            await telegramBot.sendMessage("تهانينا لقد تم تسجيل حسابك بنجاح", message.chat.id, replyKeyboard);
            
          }
          else {
            telegramBot.sendMessage('اجب بنعم او لا',message.chat.id);
          }
        }
}

module.exports = {subjectsSection, subjectsButtons};