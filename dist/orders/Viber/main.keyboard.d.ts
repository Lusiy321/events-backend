import { User } from 'src/users/users.model';
import { Orders } from '../order.model';
export declare const MAIN_KEYBOARD_VIBER: {
    Type: string;
    Revision: number;
    ButtonsGroupColumns: number;
    ButtonsGroupRows: number;
    Buttons: {
        ActionType: string;
        ActionBody: string;
        Text: string;
        TextSize: string;
        TextVAlign: string;
        TextHAlign: string;
        BgColor: string;
    }[];
};
export declare function mainKeyboardViber(userProfile: string, userId: string): Promise<{
    Type: string;
    Revision: number;
    ButtonsGroupColumns: number;
    ButtonsGroupRows: number;
    Buttons: {
        ActionType: string;
        ActionBody: string;
        Text: string;
        TextSize: string;
        TextVAlign: string;
        TextHAlign: string;
        BgColor: string;
    }[];
}>;
export declare function findKeyboardViber(finded: Orders, chatId: string): Promise<{
    Type: string;
    Revision: number;
    ButtonsGroupColumns: number;
    ButtonsGroupRows: number;
    Buttons: {
        ActionType: string;
        ActionBody: string;
        Text: string;
        TextSize: string;
        TextVAlign: string;
        TextHAlign: string;
        BgColor: string;
    }[];
}>;
export declare function findMsgViber(finded: Orders): Promise<string>;
export declare function findOrderKeyboardViber(finded: Orders): Promise<{
    Type: string;
    Revision: number;
    ButtonsGroupColumns: number;
    ButtonsGroupRows: number;
    Buttons: {
        ActionType: string;
        ActionBody: string;
        Text: string;
        TextSize: string;
        TextVAlign: string;
        TextHAlign: string;
        BgColor: string;
    }[];
}>;
export declare function findUsersKeyboardViber(finded: Orders): Promise<{
    Type: string;
    Revision: number;
    ButtonsGroupColumns: number;
    ButtonsGroupRows: number;
    Buttons: {
        ActionType: string;
        ActionBody: string;
        Text: string;
        TextSize: string;
        TextVAlign: string;
        TextHAlign: string;
        BgColor: string;
    }[];
}>;
export declare function findOrderKeyboardViberActive(finded: Orders): Promise<{
    Type: string;
    Revision: number;
    ButtonsGroupColumns: number;
    ButtonsGroupRows: number;
    Buttons: {
        ActionType: string;
        ActionBody: string;
        Text: string;
        TextSize: string;
        TextVAlign: string;
        TextHAlign: string;
        BgColor: string;
    }[];
}>;
export declare function reviewsKeyboard(chatId: string): Promise<{
    Type: string;
    Revision: number;
    ButtonsGroupColumns: number;
    ButtonsGroupRows: number;
    Buttons: {
        ActionType: string;
        ActionBody: string;
        Text: string;
        TextSize: string;
        TextVAlign: string;
        TextHAlign: string;
        BgColor: string;
    }[];
}>;
export declare function reviewsKeyboardUser(user: User): Promise<{
    Type: string;
    Revision: number;
    ButtonsGroupColumns: number;
    ButtonsGroupRows: number;
    Buttons: {
        ActionType: string;
        ActionBody: string;
        Text: string;
        TextSize: string;
        TextVAlign: string;
        TextHAlign: string;
        BgColor: string;
    }[];
}>;
