const axios = require('axios');

const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

class TelegramBot {
    constructor(botToken) {
        this.botToken = botToken;
    }

    async sendMessage(message, chatId) {
        const url = `${TELEGRAM_API_URL}${this.botToken}/sendMessage`;

        try {
            const response = await axios.post(url, {
                chat_id: chatId,
                text: message
            });

            if (!response.data.ok) {
                throw new Error(`Error sending message: ${response.data.description}`);
            }

            return response.data.result;
        } catch (error) {
            throw new Error(`Error sending message: ${error.message}`);
        }
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

    async replyToButtonPressed(messageReplyed, message, replyKeyboard) {
        axios.post(`${apiUrl}/sendMessage`, {
          chat_id: message.chat.id,
          text: `${messageReplyed}`,
          reply_markup: JSON.stringify(replyKeyboard),
        });
      }
}

module.exports = TelegramBot;
