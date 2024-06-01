const database = require("../db/connect");
const TelegramBot = require("../telegram");
const telegramBot = new TelegramBot;

class TelegramButtonsModel {
    async telegramButtons0 (message) {
        telegramBot.sendMessage("ما هو لقبك (الكنية)", message.from.id);
    }
    async telegramButtons1 (message) {
        
    }
    async telegramButtons2 (message) {
        
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

module.exports = TelegramButtonsModel;