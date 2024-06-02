const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;

async function subjectsButtons (askingForSubjectOrClass, message, subjectOrClass) {

    if (subjectOrClass == "subject") {
        database.query(`SELECT subject FROM subjects`, async function (err, subjectOrClassList, fields) 
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
    else if (subjectOrClass == "subject") {
        database.query(`SELECT class_name FROM classes`, async function (err, subjectOrClassList, fields) 
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
        console.log('error , you didnt choose subject or class');
        return 0 ;
    }
}

function insertSubjects (message) {

}

module.exports = {insertSubjects, subjectsButtons};