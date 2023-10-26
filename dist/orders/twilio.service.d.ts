export declare class TwilioService {
    private twilioClient;
    constructor();
    sendSMS(to: string, body: string): Promise<void>;
}
