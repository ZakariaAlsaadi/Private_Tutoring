export function summon_teachers ( ) {
    x ;
    database.query("SELECT * FROM teachers", function (err, result, fields) {
        if (err) throw err;
        x = result;
      });
    return x;
}