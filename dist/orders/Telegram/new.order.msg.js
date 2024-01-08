"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newOrderKeyboard = exports.newOrderMsg = void 0;
function newOrderMsg(order) {
    const msg = `Доброго дня, з'явилось нове повідомлення за Вашим профілем. 
      Замовник: ${order.name}.
      Дата події: ${order.date}.
      Категорія: ${order.category[0].subcategories[0].name}.
      Вимоги замовника: ${order.description}.
      Локація: ${order.location}.
      Гонорар: ${order.price}`;
    return msg;
}
exports.newOrderMsg = newOrderMsg;
function newOrderKeyboard(order, chatId) {
    const keyboard = {
        inline_keyboard: [
            [
                {
                    text: 'Згоден',
                    callback_data: `accept:${order.phone}:${chatId}`,
                },
                {
                    text: 'Не цікаво',
                    callback_data: `disagree:${order.id}:${chatId}`,
                },
            ],
            [
                {
                    text: 'Перейти на сайт',
                    url: 'https://www.wechirka.com/',
                },
            ],
        ],
    };
    return keyboard;
}
exports.newOrderKeyboard = newOrderKeyboard;
//# sourceMappingURL=new.order.msg.js.map