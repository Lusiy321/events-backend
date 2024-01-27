import { InlineKeyboardMarkup } from 'node-telegram-bot-api';
import { Orders } from 'src/orders/order.model';

export function newOrderMsg(order: Orders) {
  const msg = `Доброго дня, з'явилось нове повідомлення за Вашим профілем. 
      Замовник: ${order.name}.
      Дата події: ${order.date}.
      Категорія: ${order.category[0].subcategories[0].name}.
      Вимоги замовника: ${order.description}.
      Локація: ${order.location}.
      Гонорар: ${order.price}`;

  return msg;
}

export function newOrderKeyboard(
  order: Orders,
  chatId: number,
): InlineKeyboardMarkup {
  const keyboard: InlineKeyboardMarkup = {
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
