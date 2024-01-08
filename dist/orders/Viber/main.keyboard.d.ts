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
export declare function mainKeyboardViber(userProfile: string, userId: string): {
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
