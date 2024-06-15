const axios = require('axios');

const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

class TelegramBot {
    constructor() {
        this.botToken = process.env.bot_token;
    }
    
    async getUpdates() {
        const url = `${TELEGRAM_API_URL}${this.botToken}/getUpdates?offset=${this.offset}`;

        try {
            const response = await axios.get(url);

            if (!response.data.ok) {
                throw new Error(`Error getting updates: ${response.data.description}`);
            }

            if (response.data.result.length > 0) {
                this.offset = response.data.result[response.data.result.length - 1].update_id + 1;
            }

            return response.data.result;
        } catch (error) {
            throw new Error(`Error getting updates: ${error.message}`);
        }
    }

    async  sendMessage(Msg, Id, replyKeyboard) {
        let query = {chat_id: Id, text: Msg ,reply_markup: replyKeyboard};
        if (query.reply_markup == null) {
            query.reply_markup = {
            remove_keyboard: true
            }
        }
        axios.post(`${TELEGRAM_API_URL}${this.botToken}/sendMessage`, query);
      }
}

module.exports = TelegramBot;
