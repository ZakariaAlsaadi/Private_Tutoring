async function subjectsButtons () {
    database.query(`SELECT subject FROM subjects`, async function (err, subjectList, fields) 
    {  
      if (err) throw err;
            
    var KeyBoardRow = [];
    var keyBoard = [];
    for (let j = 0; j < subjectList.length; j++) {
      if (j % 3 == 0) {
        keyBoard.push(KeyBoardRow);
        KeyBoardRow = [];
      }
      KeyBoardRow.push({ text: `${subjectList[j].subject}` });
    }
    if (KeyBoardRow.length != 0) {
      keyBoard.push(KeyBoardRow);
      KeyBoardRow = [];
    }
    const replyKeyboard = {
      keyboard: keyBoard,
      resize_keyboard: true,
    };
    await telegramBot.sendMessage(textStep, message.chat.id, replyKeyboard);
    });
}

function insertSubjects (message) {

}

module.exports = {insertSubjects, subjectsButtons};