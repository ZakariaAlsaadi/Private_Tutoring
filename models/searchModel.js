const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;

function searchPlus(message,value) {
    database.query(
    `SELECT searching_step FROM telegram_user WHERE telegram_id = ${message.chat.id};`
        , function (err, result, fields) {
    if (err) throw err;
    database.query(
        `UPDATE SET telegram_user searching_step = '${result[0].searching_step} + ${value}'WHERE telegram_id = ${message.chat.id};`
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
                `UPDATE teachers SET ${searcher_step[step_number - 1].search_step} = '${message.text}' WHERE telegram_id = ${message.chat.id};`
              , function (err, result, fields) 
        {
              if (err) throw err;
              console.log('success');
        });
    });
  }


function getSearchingStep (message) {
    database.query(
        `SELECT searching_step FROM telegram_user WHERE telegram_id = ${message.chat.id};`
        , function (err, result, fields) {
    if (err) throw err;
        if (result[0].searching_step == 0) {
            database.query(
                `INSERT INTO searching_step SET (telegram_id) VALUES ('${message.chat.id}');`
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
    }
}

module.exports = {getSearchingStep}