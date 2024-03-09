import { User } from 'src/users/users.model';
import { Orders } from '../order.model';

export const MAIN_KEYBOARD_VIBER = {
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

export async function mainKeyboardViber(userProfile: string, userId: string) {
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

export async function findKeyboardViber(finded: Orders, chatId: string) {
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

export async function findMsgViber(finded: Orders) {
  return `Замовник: ${finded.name}.
      Дата події: ${finded.date}.
      Категорія: ${finded.category[0].subcategories[0].name}.
      Вимоги замовника: ${finded.description}.
      Локація: ${finded.location}.
      Гонорар: ${finded.price}.
      Кількість відгуків: ${finded.approve_count}.
      Статус: ${finded.active ? 'Активний' : 'Неактивний'}.\n`;
}

export async function findOrderKeyboardViber(finded: Orders) {
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

export async function findUsersKeyboardViber(finded: Orders) {
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

export async function findOrderKeyboardViberActive(finded: Orders) {
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

export async function reviewsKeyboard(chatId: string) {
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

export async function reviewsKeyboardUser(user: User) {
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
