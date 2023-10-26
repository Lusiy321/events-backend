"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioService = void 0;
const Twilio = require("twilio");
class TwilioService {
    constructor() {
        this.twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
    async sendSMS(to, body) {
        try {
            await this.twilioClient.messages.create({
                to,
                from: process.env.TWILIO_PHONE_NUMBER,
                body,
            });
        }
        catch (error) {
            console.error('Error sending SMS:', error);
            throw error;
        }
    }
}
exports.TwilioService = TwilioService;
//# sourceMappingURL=twilio.service.js.map