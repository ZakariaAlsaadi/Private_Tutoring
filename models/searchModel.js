function getSearchingStep (message) {
    database.query(
        `SELECT searching_step FROM telegram_user WHERE telegram_id = ${message.chat.id};`
        , function (err, result, fields) {
    if (err) throw err;
        if (result.length == 0) {
            database.query(
                `INSERT INTO searching_step SET (telegram_id) VALUES ('${message.chat.id}');`
                , function (err, result, fields) {
            if (err) throw err;





                });
        }
  });
}

module.exports = {getSearchingStep}