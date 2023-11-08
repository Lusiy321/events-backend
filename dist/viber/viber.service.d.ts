export declare const ViberBot: any;
export declare class ViberService {
    private app;
    private bot;
    constructor();
    handleIncomingMessage(message: any, response: any): void;
    private sendDefaultResponse;
    private sendSubscriptionPrompt;
    startServer(): any;
}
