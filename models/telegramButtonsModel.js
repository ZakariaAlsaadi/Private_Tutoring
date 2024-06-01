const database = require("../db/connect");
const TelegramBot = require("../telegram");
const teacherModel = require("./teacherModel")
const telegramBot = new TelegramBot;


async function telegramButtons (meesage, step_number) {

        if (step_number == 0) {
            telegramBot.sendMessage("ما هو لقبك (الكنية)", message.from.id);
            teacherModel.updateSignUp(message, 0);
        }

        else if (step_number == 1) {
            telegramBot.sendMessage("ما هو رقم الهاتف ؟", message.from.id);
            teacherModel.updateSignUp(message, 1);
        }

        else if (step_number == 2) {
            if (message.text == "ذكر" || message.text == "انثى") {
                telegramBot.sendMessage(
                    "ما هو اعلى مرتب من الممكن ان تأخذه في الساعة",
                    message.from.id
                  );
                teacherModel.updateSignUp(message, 2);
            }
    
            else {
            const replyKeyboard = {
                keyboard: [[{ text: "انثى" }, { text: "ذكر" }]],
                resize_keyboard: true,
              };
              await telegramBot.sendMessage("هل انت ذكر ام انثى ؟", message, replyKeyboard);
            }
        }


}
/*
    async telegramButtons0 (message) {
        telegramBot.sendMessage("ما هو لقبك (الكنية)", message.from.id);
        teacherModel.updateSignUp(message, 0);
    }
    async telegramButtons1 (message) {
        telegramBot.sendMessage("ما هو رقم الهاتف ؟", message.from.id);
        teacherModel.updateSignUp(message, 1);
    }
    async telegramButtons2 (message) {

        if (message.text == "ذكر" || message.text == "انثى") {
            telegramBot.sendMessage(
                "ما هو اعلى مرتب من الممكن ان تأخذه في الساعة",
                message.from.id
              );
            teacherModel.updateSignUp(message, 2);
        }

        else {
        const replyKeyboard = {
            keyboard: [[{ text: "انثى" }, { text: "ذكر" }]],
            resize_keyboard: true,
          };
          await telegramBot.sendMessage("هل انت ذكر ام انثى ؟", message, replyKeyboard);
        }
    }
    async telegramButtons3 (message) {
        
    }
    async telegramButtons4 (message) {
        
    }
    async telegramButtons5 (message) {
        
    }
    async telegramButtons6 (message) {
        
    }
    async telegramButtons7 (message) {
        
    }
    async telegramButtons8 (message) {
        
    }
    async telegramButtons9 (message) {
        
    }
    async telegramButtons10 (message) {
        
    }
}
*/
module.exports = {telegramButtons};