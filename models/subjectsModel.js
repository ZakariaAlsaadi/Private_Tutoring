async function subjectsButtons (askingForSubjectOrClass, message, subjectOrClass) {

    if (subjectOrClass == "subject") {
        sqlTable = 'subjects';
        sqlColumn = 'subject';
    }
    else {
        sqlTable = 'classes';
        sqlColumn = 'class_name';
    }

    database.query(`SELECT ${sqlColumn} FROM ${sqlTable}`, async function (err, subjectOrClassList, fields) 
    {  
      if (err) throw err;
            
    var KeyBoardRow = [];
    var keyBoard = [];
    for (let j = 0; j < subjectOrClassList.length; j++) {
      if (j % 3 == 0) {
        keyBoard.push(KeyBoardRow);
        KeyBoardRow = [];
      }
      KeyBoardRow.push({ text: `${subjectOrClassList[j]}` });
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

function insertSubjects (message) {

}

module.exports = {insertSubjects, subjectsButtons};