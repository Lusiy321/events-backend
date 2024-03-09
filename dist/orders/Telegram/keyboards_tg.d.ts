import { Orders } from '../order.model';
export declare const mainKeyboard: {
    reply_markup: {
        keyboard: {
            text: string;
        }[][];
        resize_keyboard: boolean;
    };
};
export declare const settingsKeyboard: {
    reply_markup: {
        keyboard: {
            text: string;
        }[][];
        resize_keyboard: boolean;
    };
};
export declare const generalKeyboard: {
    reply_markup: {
        keyboard: ({
            text: string;
            request_contact: boolean;
        }[] | {
            text: string;
        }[])[];
        resize_keyboard: boolean;
    };
};
export declare const contactKeyboard: {
    reply_markup: {
        keyboard: {
            text: string;
            request_contact: boolean;
        }[][];
        resize_keyboard: boolean;
    };
};
export declare function msgKeyboardFalse(finded: Orders, chatId: number): Promise<{
    inline_keyboard: {
        text: string;
        callback_data: string;
    }[][];
}>;
export declare function msgKeyboardTrue(finded: Orders, chatId: number): Promise<{
    inline_keyboard: {
        text: string;
        callback_data: string;
    }[][];
}>;
