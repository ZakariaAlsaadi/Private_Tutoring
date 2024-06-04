const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;
const subjectsModel = require("./subjectsModel");
const resultModel = require("./resultModel");

function searchPlus(message,value) {
    database.query(
    `SELECT searching_step FROM telegram_user WHERE telegram_id = ${message.chat.id};`
        , function (err, result, fields) {
    if (err) throw err;
    database.query(
        `UPDATE telegram_user SET searching_step = ${result[0].searching_step} + ${value} WHERE telegram_id = ${message.chat.id};`
        , function (err, result, fields) {
    if (err) throw err;
        });
    });
}

function searchMinus(message,value) {
    database.query(
    `SELECT searching_step FROM telegram_user WHERE telegram_id = ${message.chat.id};`
        , function (err, result, fields) {
    if (err) throw err;
    database.query(
        `UPDATE telegram_user SET searching_step = ${result[0].searching_step} - ${value} WHERE telegram_id = ${message.chat.id};`
        , function (err, result, fields) {
    if (err) throw err;
        });
    });
}

function updateSearchInfo (message,step_number) {
    database.query(`SELECT * FROM searching_list`, function (err, searcher_step, fields) 
    {  
      if (err) throw err;
              database.query(
                `UPDATE searching_steps SET ${searcher_step[step_number - 1].search_step} = '${message.text}' WHERE telegram_id = ${message.chat.id};`
              , function (err, result, fields) 
        {
              if (err) throw err;
              searchPlus(message,1);
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

function getSearchingStep (message) {
    database.query(
        `SELECT searching_step FROM telegram_user WHERE telegram_id = ${message.chat.id};`
        , async function (err, result, fields) {
    if (err) throw err;
        if (result[0].searching_step == 0) {

            deleteSearchRow(message);

            database.query(
                `INSERT INTO searching_steps (telegram_id) VALUES ('${message.chat.id}');`
                , function (err, result, fields) {
            if (err) throw err;
                    telegramBot.sendMessage( "ادخل اسم المنطقة" , message.chat.id);
                    searchPlus(message,1);
                });
        }
    else {
        getSearchingInfo(message, result[0].searching_step)
    }
  });
}

async function getSearchingInfo (message,step_number) {
    if (step_number == 1) {
        updateSearchInfo(message,step_number);
        const replyKeyboard = {
            keyboard: [[{ text: "انثى" }, { text: "ذكر" }]],
            resize_keyboard: true,
          };
          await telegramBot.sendMessage("هل انت ذكر ام انثى ؟", message.chat.id, replyKeyboard);
    }
    else if (step_number == 2) {
        
        if (message.text == "ذكر" || message.text == "انثى") {
            
            const replyKeyboard = {
                keyboard: [
                  [{ text: "انثى" }, { text: "ذكر" }],
                  [{ text: "لا يهم" }],
                ],
                resize_keyboard: true,
              };
              await telegramBot.sendMessage(
                "هل ترغب باستاذ ام انسة ام لا يهم",
                message.chat.id,
                replyKeyboard
              );

              updateSearchInfo(message, step_number);
        }
        else {
          const replyKeyboard = {
            keyboard: [[{ text: "انثى" }, { text: "ذكر" }]],
            resize_keyboard: true,
          };
          await telegramBot.sendMessage("هل انت ذكر ام انثى ؟", message.chat.id, replyKeyboard);
        }
    }
    else if (step_number == 3) {
        if (message.text == "ذكر" || message.text == "انثى" || message.text == "لا يهم") {


            const replyKeyboard = {
                keyboard: [
                  [{ text: "منزل الطالب" }, { text: "منزل الاستاذ" }],
                  [{ text: "لا يهم" }],
                ],
                resize_keyboard: true,
              };
              await telegramBot.sendMessage(
                "في منزل من سيكون الدرس",
                message.chat.id,
                replyKeyboard
              );
            updateSearchInfo(message, step_number);
        }
        else {
            const replyKeyboard = {
                keyboard: [
                  [{ text: "انثى" }, { text: "ذكر" }],
                  [{ text: "لا يهم" }],
                ],
                resize_keyboard: true,
              };
              await telegramBot.sendMessage(
                "هل ترغب باستاذ ام انسة ام لا يهم",
                message.chat.id,
                replyKeyboard
              );
        }
    }
    else if (step_number == 4) {
        if (message.text == "منزل الاستاذ" || message.text == "منزل الطالب" || message.text == "لا يهم") {
            subjectsModel.subjectsButtons("اختر المادة" , message , 'subject');
            updateSearchInfo(message, step_number);
        }
        else {
            const replyKeyboard = {
                keyboard: [
                  [{ text: "منزل الطالب" }, { text: "منزل الاستاذ" }],
                  [{ text: "لا يهم" }],
                ],
                resize_keyboard: true,
              };
              await telegramBot.sendMessage(
                "اين ترغب بتدريس الطالب/ة",
                message.chat.id,
                replyKeyboard
              );
        }
    }
    else if (step_number == 5) {

        database.query(`SELECT subject FROM subjects`, async function (err, result, fields) 
        {  
            if (err) throw err;
            result = JSON.stringify(result);
            if (result.includes(message.text) == true) { 
                subjectsModel.subjectsButtons('اختر المرحلة الصفية المناسبة', message, "class");
            updateSearchInfo(message, step_number);
            }
            else {
            subjectsModel.subjectsButtons("اختر مادة من الزرار الموجودة في الاسفل" , message , 'subject');
            }
        });
    }
    else if (step_number == 6) {
        database.query(`SELECT class_name FROM classes`, async function (err, result, fields) 
          {  
            if (err) throw err;
            result = JSON.stringify(result);
            if (result.includes(message.text) == true) { 
                updateSearchInfo(message, step_number);
                resultModel.filterTeachersOut(message);
                searchMinus(message,7);
            }
            else {
                    subjectsModel.subjectsButtons('اختر المرحلة الصفية المناسبة', message, "class");
            }
        });
    }
    else {
        telegramBot.sendMessage("حدث خطأ حاول مجدداً بعد قليل",message.chat.id);
        database.query(
            `UPDATE telegram_user SET searching_step = 0 WHERE telegram_id = ${message.chat.id};`
            , function (err, result, fields) {
        if (err) throw err;
            });
    }
}

module.exports = {getSearchingStep}