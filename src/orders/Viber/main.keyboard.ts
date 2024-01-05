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
      BgColor: '#094356',
    },
    {
      ActionType: 'reply',
      ActionBody: `orders`,
      Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
      TextSize: 'regular',
      TextVAlign: 'middle',
      TextHAlign: 'center',
      BgColor: '#094356',
    },
    {
      ActionType: 'reply',
      ActionBody: `review`,
      Text: '<font color="#FFFFFF" size="5">Мої відгуки (лише для виконавців)</font>',
      TextSize: 'regular',
      TextVAlign: 'middle',
      TextHAlign: 'center',
      BgColor: '#094356',
    },
  ],
};

export function mainKeyboardViber(userProfile: string, userId: string) {
  const MAIN_KEYBOARD = {
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
        BgColor: '#094356',
      },
      {
        ActionType: 'reply',
        ActionBody: `orders:${userProfile}:${userId}`,
        Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
        TextSize: 'large',
        TextVAlign: 'middle',
        TextHAlign: 'center',
        BgColor: '#094356',
      },
      {
        ActionType: 'reply',
        ActionBody: `review:${userProfile}:${userId}`,
        Text: '<font color="#FFFFFF" size="5">Мої відгуки (лише для виконавців)</font>',
        TextSize: 'regular',
        TextVAlign: 'middle',
        TextHAlign: 'center',
        BgColor: '#094356',
      },
    ],
  };
  return MAIN_KEYBOARD;
}
