"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgKeyboardTrue = exports.msgKeyboardFalse = exports.contactKeyboard = exports.generalKeyboard = exports.settingsKeyboard = exports.mainKeyboard = void 0;
exports.mainKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: 'Замовлення' }],
            [{ text: 'Відгуки' }],
            [{ text: 'Налаштування' }],
        ],
        resize_keyboard: true,
    },
};
exports.settingsKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: 'Зупинити оповіщення' }],
            [
                {
                    text: 'Підтримка',
                },
            ],
            [{ text: 'Головна' }],
        ],
        resize_keyboard: true,
    },
};
exports.generalKeyboard = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: 'Відправити номер телефону',
                    request_contact: true,
                },
            ],
            [{ text: 'Головна' }],
        ],
        resize_keyboard: true,
    },
};
exports.contactKeyboard = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: 'Відправити номер телефону',
                    request_contact: true,
                },
            ],
        ],
        resize_keyboard: true,
    },
};
async function msgKeyboardFalse(finded, chatId) {
    const keyboard = {
        inline_keyboard: [
            [
                {
                    text: 'Видалити',
                    callback_data: `delete:${finded._id}:${chatId}`,
                },
                {
                    text: 'Деактивувати',
                    callback_data: `deactive:${finded._id}:${chatId}`,
                },
            ],
            [
                {
                    text: 'Відгуки на пропозицію',
                    callback_data: `users:${finded._id}:${chatId}`,
                },
            ],
        ],
    };
    return keyboard;
}
exports.msgKeyboardFalse = msgKeyboardFalse;
async function msgKeyboardTrue(finded, chatId) {
    const keyboard = {
        inline_keyboard: [
            [
                {
                    text: 'Видалити',
                    callback_data: `delete:${finded._id}:${chatId}`,
                },
                {
                    text: 'Активувати',
                    callback_data: `active:${finded._id}:${chatId}`,
                },
            ],
            [
                {
                    text: 'Відгуки на пропозицію',
                    callback_data: `users:${finded._id}:${chatId}`,
                },
            ],
        ],
    };
    return keyboard;
}
exports.msgKeyboardTrue = msgKeyboardTrue;
//# sourceMappingURL=keyboards_tg.js.map