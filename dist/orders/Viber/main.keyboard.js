"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsKeyboardUser = exports.reviewsKeyboard = exports.findOrderKeyboardViberActive = exports.findUsersKeyboardViber = exports.findOrderKeyboardViber = exports.findMsgViber = exports.findKeyboardViber = exports.mainKeyboardViber = exports.MAIN_KEYBOARD_VIBER = void 0;
exports.MAIN_KEYBOARD_VIBER = {
    Type: 'keyboard',
    Revision: 1,
    ButtonsGroupColumns: 3,
    ButtonsGroupRows: 1,
    Buttons: [
        {
            ActionType: 'open-url',
            ActionBody: 'https://www.wechirka.com',
            Text: '<font color="#FFFFFF" size="5">Перейти на наш сайт</font>',
            TextSize: 'regular',
            TextVAlign: 'middle',
            TextHAlign: 'center',
            BgColor: '#a259ff',
        },
        {
            ActionType: 'reply',
            ActionBody: `orders`,
            Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
            TextSize: 'regular',
            TextVAlign: 'middle',
            TextHAlign: 'center',
            BgColor: '#a259ff',
        },
        {
            ActionType: 'reply',
            ActionBody: `review`,
            Text: '<font color="#FFFFFF" size="5">Мої відгуки (лише для виконавців)</font>',
            TextSize: 'regular',
            TextVAlign: 'middle',
            TextHAlign: 'center',
            BgColor: '#a259ff',
        },
        {
            ActionType: 'reply',
            ActionBody: `support`,
            Text: '<font color="#FFFFFF" size="5">Підтримка</font>',
            TextSize: 'regular',
            TextVAlign: 'middle',
            TextHAlign: 'center',
            BgColor: '#a259ff',
        },
    ],
};
async function mainKeyboardViber(userProfile, userId) {
    return {
        Type: 'keyboard',
        Revision: 1,
        ButtonsGroupColumns: 3,
        ButtonsGroupRows: 1,
        Buttons: [
            {
                ActionType: 'open-url',
                ActionBody: 'https://www.wechirka.com',
                Text: '<font color="#FFFFFF" size="5">Перейти на наш сайт</font>',
                TextSize: 'large',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
            {
                ActionType: 'reply',
                ActionBody: `orders:${userProfile}:${userId}`,
                Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
                TextSize: 'large',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
            {
                ActionType: 'reply',
                ActionBody: `review:${userProfile}:${userId}`,
                Text: '<font color="#FFFFFF" size="5">Мої відгуки (лише для виконавців)</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
            {
                ActionType: 'reply',
                ActionBody: `support`,
                Text: '<font color="#FFFFFF" size="5">Підтримка</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
        ],
    };
}
exports.mainKeyboardViber = mainKeyboardViber;
async function findKeyboardViber(finded, chatId) {
    return {
        Type: 'keyboard',
        Revision: 1,
        ButtonsGroupColumns: 3,
        ButtonsGroupRows: 1,
        Buttons: [
            {
                ActionType: 'open-url',
                ActionBody: 'https://www.wechirka.com',
                Text: '<font color="#FFFFFF" size="5">Перейти на наш сайт</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
            {
                ActionType: 'reply',
                ActionBody: `orders:${finded.name}:${finded.viber_chat}`,
                Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
            {
                ActionType: 'reply',
                ActionBody: `review:${finded.name}:${chatId}`,
                Text: '<font color="#FFFFFF" size="5">Мої відгуки (лише для виконавців)</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
        ],
    };
}
exports.findKeyboardViber = findKeyboardViber;
async function findMsgViber(finded) {
    return `Замовник: ${finded.name}.
      Дата події: ${finded.date}.
      Категорія: ${finded.category[0].subcategories[0].name}.
      Вимоги замовника: ${finded.description}.
      Локація: ${finded.location}.
      Гонорар: ${finded.price}.
      Кількість відгуків: ${finded.approve_count}.
      Статус: ${finded.active ? 'Активний' : 'Неактивний'}.\n`;
}
exports.findMsgViber = findMsgViber;
async function findOrderKeyboardViber(finded) {
    return {
        Type: 'keyboard',
        Revision: 1,
        ButtonsGroupColumns: 3,
        ButtonsGroupRows: 1,
        Buttons: [
            {
                ActionType: 'reply',
                ActionBody: `delete:${finded._id}:${finded.viber_chat}`,
                Text: '<font color="#FFFFFF" size="5">Видалити</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
            {
                ActionType: 'reply',
                ActionBody: `deactive:${finded._id}:${finded.viber_chat}`,
                Text: '<font color="#FFFFFF" size="5">Деактивувати</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
        ],
    };
}
exports.findOrderKeyboardViber = findOrderKeyboardViber;
async function findUsersKeyboardViber(finded) {
    return {
        Type: 'keyboard',
        Revision: 1,
        ButtonsGroupColumns: 6,
        ButtonsGroupRows: 1,
        Buttons: [
            {
                ActionType: 'reply',
                ActionBody: `users:${finded._id}:${finded.viber_chat}`,
                Text: '<font color="#FFFFFF" size="5">Відгуки на пропозицію</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
        ],
    };
}
exports.findUsersKeyboardViber = findUsersKeyboardViber;
async function findOrderKeyboardViberActive(finded) {
    return {
        Type: 'keyboard',
        Revision: 1,
        ButtonsGroupColumns: 3,
        ButtonsGroupRows: 1,
        Buttons: [
            {
                ActionType: 'reply',
                ActionBody: `delete:${finded._id}:${finded.viber_chat}`,
                Text: '<font color="#FFFFFF" size="5">Видалити</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
            {
                ActionType: 'reply',
                ActionBody: `active:${finded._id}:${finded.viber_chat}`,
                Text: '<font color="#FFFFFF" size="5">Активувати</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
        ],
    };
}
exports.findOrderKeyboardViberActive = findOrderKeyboardViberActive;
async function reviewsKeyboard(chatId) {
    return {
        Type: 'keyboard',
        Revision: 1,
        ButtonsGroupColumns: 3,
        ButtonsGroupRows: 1,
        Buttons: [
            {
                ActionType: 'open-url',
                ActionBody: 'https://www.wechirka.com',
                Text: '<font color="#FFFFFF" size="5">Перейти на наш сайт</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
            {
                ActionType: 'reply',
                ActionBody: `orders:${chatId}:${chatId}`,
                Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
            {
                ActionType: 'reply',
                ActionBody: `review:${chatId}:${chatId}`,
                Text: '<font color="#FFFFFF" size="5">Мої відгуки (лише для виконавців)</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
        ],
    };
}
exports.reviewsKeyboard = reviewsKeyboard;
async function reviewsKeyboardUser(user) {
    return {
        Type: 'keyboard',
        Revision: 1,
        ButtonsGroupColumns: 3,
        ButtonsGroupRows: 1,
        Buttons: [
            {
                ActionType: 'open-url',
                ActionBody: 'https://www.wechirka.com',
                Text: '<font color="#FFFFFF" size="5">Перейти на наш сайт</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
            {
                ActionType: 'reply',
                ActionBody: `orders:${user.name}:${user.viber_chat}`,
                Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
            {
                ActionType: 'reply',
                ActionBody: `review:${user.viber_chat}:${user.viber_chat}`,
                Text: '<font color="#FFFFFF" size="5">Мої відгуки (лише для виконавців)</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#a259ff',
            },
        ],
    };
}
exports.reviewsKeyboardUser = reviewsKeyboardUser;
//# sourceMappingURL=main.keyboard.js.map