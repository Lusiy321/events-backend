import { Orders } from '../order.model';
export declare function newViberMsgOrder(order: Orders): Promise<string>;
export declare function newViberKeyboardOrder(userId: string, order: Orders): Promise<{
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
