"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newViberKeyboardOrder = exports.newViberMsgOrder = void 0;
async function newViberMsgOrder(order) {
    const msg = `Доброго дня, з'явилось нове замовлення по Вашому профілю. \n
      *Замовник*: ${order.name}.
      *Дата події*: ${order.date}.
      *Категорія*: ${order.category[0].subcategories[0].name}.
      *Вимоги замовника*: ${order.description}.
      *Локація*: ${order.location}.
      *Гонорар*: ${order.price}`;
    return msg;
}
exports.newViberMsgOrder = newViberMsgOrder;
async function newViberKeyboardOrder(userId, order) {
    const keyboard = {
        Type: 'keyboard',
        Revision: 1,
        ButtonsGroupColumns: 3,
        ButtonsGroupRows: 1,
        Buttons: [
            {
                ActionType: 'reply',
                ActionBody: `accept:${order.phone}:${userId}`,
                Text: '<font color="#FFFFFF" size="5">Згоден</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
            {
                ActionType: 'reply',
                ActionBody: `disagree:${order.phone}:${userId}`,
                Text: '<font color="#FFFFFF" size="5">Не згоден</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
        ],
    };
    return keyboard;
}
exports.newViberKeyboardOrder = newViberKeyboardOrder;
//# sourceMappingURL=new.order.msg.viber.js.map