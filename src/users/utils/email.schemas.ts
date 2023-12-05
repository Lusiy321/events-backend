export async function verifyEmailMsg(verificationLink: string) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 16px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333333;
        }

        p {
            color: #666666;
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }

        a {
            text-decoration: none;
            font-size: 20px;
            color: #3498db;
            border-bottom: 2px solid #3498db;
            transition: color 0.3s, border-bottom 0.3s;
        }

        a:hover {
            color: #2079b0;
            border-bottom: 2px solid #2079b0;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Вітаємо з реєстрацією на WECHIRKA</h1>
        <p>Дякуємо за реєстрацію на нашій платформі.</p>
        <p>Щоб завершити реєстрацію, натисніть кнопку нижче, щоб підтвердити свою електронну адресу:</p>
        <a href="${verificationLink}" class="button">Підтвердити E-mail</a>
        <p>Якщо ви не зареєструвалися на нашій платформі, не звертайте уваги на цей електронний лист.</p>
        <p>З найкращими побажаннями,<br><br>Команда <a href="https://www.wechirka.com/">wechirka</a></p>
    </div>
</body>

</html>`;
}