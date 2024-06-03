const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;
const subjectsModel = require("./subjectsModel")

function addLocation (message) {
  database.query(`SELECT * FROM sign_up_steps`, function (err, teacher_step, fields) 
    {  
      if (err) throw err;
      if (message.text == "لا") {
           database.query(
              `UPDATE teachers SET sign_up_step = 10 WHERE telegram_id = ${message.chat.id};`
            , function (err, result, fields) 
      {
            if (err) throw err;
              console.log('success');
      });

      subjectsModel.subjectsButtons("اختر المادة" , message , 'subject');

      }
      else {
      
        database.query(`SELECT locations FROM teachers WHERE telegram_id = ${message.chat.id}`, function (err, result, fields) 
        {  
          if (err) throw err;

          let addedLocation = result[0].locations + " , " + message.text;
              database.query(
                `UPDATE teachers SET ${teacher_step[8].the_step} = '${addedLocation}' WHERE telegram_id = ${message.chat.id};`
              , async function (err, resu, fields) 
        {
              if (err) throw err;
              console.log('success');
              const replyKeyboard = {
                keyboard: [[{ text: "لا" }]],
                resize_keyboard: true,
              };
              await telegramBot.sendMessage("هل هناك منطقة اخرى ؟", message.chat.id, replyKeyboard);
        });
      });
      }
    });
}

function updateSignUp (message,step_number) {
    database.query(`SELECT * FROM sign_up_steps`, function (err, teacher_step, fields) 
    {  
      if (err) throw err;
              database.query(
                `UPDATE teachers SET ${teacher_step[step_number].the_step} = '${message.text}' , sign_up_step = ${step_number} + 1 WHERE telegram_id = ${message.chat.id};`
              , function (err, result, fields) 
        {
              if (err) throw err;
              console.log('success');
        });
    });
  }

async function telegramButtons (message, step_number) {

        if (step_number == 0) {
            telegramBot.sendMessage("ما هو لقبك (الكنية)", message.chat.id);
            updateSignUp(message, step_number);
        }

        else if (step_number == 1) {
            telegramBot.sendMessage("ما هو رقم الهاتف ؟", message.chat.id);
            updateSignUp(message, step_number);
        }

        else if (step_number == 2) {
          const replyKeyboard = {
              keyboard: [[{ text: "انثى" }, { text: "ذكر" }]],
              resize_keyboard: true,
            };
            await telegramBot.sendMessage("هل انت ذكر ام انثى ؟", message.chat.id, replyKeyboard);
            updateSignUp(message, step_number);
          }

        else if (step_number == 3) {
                if (message.text == "ذكر" || message.text == "انثى") {
                    telegramBot.sendMessage(
                        "ما هو اعلى مرتب من الممكن ان تأخذه في الساعة",
                        message.from.id
                      );
                    updateSignUp(message, step_number);
                }
                else {
                  const replyKeyboard = {
                    keyboard: [[{ text: "انثى" }, { text: "ذكر" }]],
                    resize_keyboard: true,
                  };
                  await telegramBot.sendMessage("هل انت ذكر ام انثى ؟", message.chat.id, replyKeyboard);
                }
        }
        
        else if (step_number == 4) {
          telegramBot.sendMessage(
            "ما هو اقل مرتب من الممكن ان تأخذه في الساعة",
            message.from.id
          );
        updateSignUp(message, step_number);
        }

        else if (step_number == 5) {
          const replyKeyboard = {
            keyboard: [
              [{ text: "اناث فقط" }, { text: "ذكور فقط" }],
              [{ text: "لا يهم" }],
            ],
            resize_keyboard: true,
          };
          await telegramBot.sendMessage(
            "هل ترغب بتدريس ذكور فقط ام اناث فقط ام لا يهم",
            message.chat.id,
            replyKeyboard
          );
          updateSignUp(message, step_number);
        }

        else if (step_number == 6) {
                if (message.text == "ذكور فقط" || message.text == "اناث فقط" || message.text == "لا يهم") {
                  updateSignUp(message, step_number);
                  const replyKeyboard = {
                    keyboard: [
                      [{ text: "في منزلهم فقط" }, { text: "في منزلي فقط" }],
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

                else {
                  const replyKeyboard = {
                    keyboard: [
                      [{ text: "اناث فقط" }, { text: "ذكور فقط" }],
                      [{ text: "لا يهم" }],
                    ],
                    resize_keyboard: true,
                  };
                  await telegramBot.sendMessage(
                    "هل ترغب بتدريس ذكور فقط ام اناث فقط ام لا يهم",
                    message.chat.id,
                    replyKeyboard
                  );
                }
        }

        else if (step_number == 7) {
                if (message.text == "في منزلي فقط" || message.text == "في منزلهم فقط" || message.text == "لا يهم") {
                  telegramBot.sendMessage("اين مكان تواجدك", message.from.id);
                  updateSignUp(message, step_number);
                }
                else {
                  const replyKeyboard = {
                    keyboard: [
                      [{ text: "في منزلهم فقط" }, { text: "في منزلي فقط" }],
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

        else if (step_number == 8) {
          updateSignUp(message, step_number);
          const replyKeyboard = {
            keyboard: [[{ text: "لا" }]],
            resize_keyboard: true,
          };
          await telegramBot.sendMessage("هل هناك منطقة اخرى ؟", message.chat.id, replyKeyboard);
        }

        else if (step_number == 9) {
                if (message.text == "نعم") 
                  telegramBot.sendMessage("ادخل اسم المنطقة", message.from.id);
                else {
                  addLocation(message);
                }
        }

        else if (step_number == 10) {
          subjectsModel.insertSubjects(message);
        }
}

module.exports = {telegramButtons};