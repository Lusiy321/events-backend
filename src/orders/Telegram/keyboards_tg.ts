import { Orders } from '../order.model';

export const mainKeyboard = {
  reply_markup: {
    keyboard: [
      [{ text: 'Замовлення' }],
      [{ text: 'Відгуки' }],
      [{ text: 'Налаштування' }],
    ],
    resize_keyboard: true,
  },
};

export const settingsKeyboard = {
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

export const generalKeyboard = {
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

export const contactKeyboard = {
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

export async function msgKeyboardFalse(finded: Orders, chatId: number) {
  return {
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
}

export async function msgKeyboardTrue(finded: Orders, chatId: number) {
  return {
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
}
