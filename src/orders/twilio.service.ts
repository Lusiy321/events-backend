import * as Twilio from 'twilio';

export class TwilioService {
  private twilioClient: Twilio.Twilio;

  constructor() {
    this.twilioClient = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendSMS(to: string, body: string) {
    try {
      await this.twilioClient.messages.create({
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
        body,
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }
}
