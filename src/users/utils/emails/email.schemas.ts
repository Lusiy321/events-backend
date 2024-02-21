export async function verifyEmailMsg(id: string) {
  return `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title></title>
    <style>
        .es-button-border:hover>a.es-button {
            color: #ffffff !important;
        }

        .es-desk-hidden {
            display: none;
            float: left;
            overflow: hidden;
            width: 0;
            max-height: 0;
            line-height: 0;
        }

        a.es-button {
            text-decoration: none !important;
        }

        span.MsoHyperlink,
        span.MsoHyperlinkFollowed {
            color: inherit;
        }

        #outlook a {
            padding: 0;
        }

        u+.body img~div div {
            display: none;
        }

        .rollover span {
            font-size: 0px;
        }

        .esd-block-button {
            padding: 20px;
        }

        .rollover:hover .rollover-first {
            max-height: 0px !important;
            display: none !important;
        }

        .rollover:hover .rollover-second {
            max-height: none !important;
            display: block !important;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /*
        END OF IMPORTANT
        */
        .es-button-border {
            border: 10px;
        }

        body {
            max-width: 600px;
            margin: 0 auto;
            /* Updated to center the container */
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        table {
            border-collapse: collapse;
            border-spacing: 0px;
        }

        table td,
        body,
        .es-wrapper {
            padding: 0;
            margin: 0;
            /* Removed unnecessary margin */
        }

        .es-content,
        .es-header,
        .es-footer {
            width: 100%;
            table-layout: fixed !important;
        }

        img {
            display: block;
            font-size: 18px;
            border: 0;
            outline: none;
            text-decoration: none;
        }

        p,
        hr {
            margin: 0;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            margin: 0;
            font-family: Imprima, Arial, sans-serif;
            letter-spacing: 0;
        }

        p,
        a {
            padding: 1px;
        }

        .es-left {
            float: left;
        }

        .es-right {
            float: right;
        }

        .es-menu td {
            border: 0;
        }

        .es-menu td a img {
            display: inline !important;
            vertical-align: middle;
        }

        s {
            text-decoration: line-through;
        }

        ul,
        ol {
            font-family: Imprima, Arial, sans-serif;
            padding: 0px 0px 0px 40px;
            margin: 15px 0px;
        }

        ul li,
        ol li {
            color: #2d3142;
        }

        li {
            margin: 0px 0px 15px;
            font-size: 18px;
        }

        a {
            text-decoration: underline;
        }

        .es-menu td a {
            font-family: Imprima, Arial, sans-serif;
            text-decoration: none;
            display: block;
        }

        .es-wrapper {
            max-width: 600px;
            margin: 0 auto;
            /* Center the container */
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .es-content-body p,
        .es-footer-body p,
        .es-header-body p,
        .es-infoblock p {
            font-family: Imprima, Arial, sans-serif;
            line-height: 150%;
            letter-spacing: 0;
        }

        .es-header {
            background-color: transparent;
            background-repeat: repeat;
            background-position: center top;
        }

        .es-header-body {
            background-color: #efefef;
        }

        .es-header-body p {
            color: #2d3142;
            font-size: 14px;
        }

        .es-header-body a {
            color: #2d3142;
            font-size: 14px;
        }

        .es-footer {
            background-color: transparent;
            background-repeat: repeat;
            background-position: center top;
        }

        .es-footer-body {
            background-color: #ffffff;
        }

        .es-footer-body p {
            color: #2d3142;
            font-size: 14px;
        }

        .es-footer-body a {
            color: #2d3142;
            font-size: 14px;
        }

        .es-content-body {
            background-color: #efefef;
        }

        .es-content-body p {
            color: #2d3142;
            font-size: 18px;
        }

        .es-content-body a {
            color: #2d3142;
            font-size: 18px;
        }

        .es-infoblock p {
            font-size: 12px;
            color: #cccccc;
        }

        .es-infoblock a {
            font-size: 12px;
            color: #cccccc;
        }

        h1 {
            font-size: 48px;
            font-style: normal;
            font-weight: bold;
            line-height: 120%;
            color: #2d3142;
        }

        .es-header-body h1 a,
        .es-content-body h1 a,
        .es-footer-body h1 a {
            font-size: 48px;
        }

        h2 {
            font-size: 36px;
            font-style: normal;
            font-weight: bold;
            line-height: 120%;
            color: #2d3142;
        }

        .es-header-body h2 a,
        .es-content-body h2 a,
        .es-footer-body h2 a {
            font-size: 36px;
        }

        h3 {
            font-size: 28px;
            font-style: normal;
            font-weight: bold;
            line-height: 120%;
            color: #2d3142;
        }

        .es-header-body h3 a,
        .es-content-body h3 a,
        .es-footer-body h3 a {
            font-size: 28px;
        }

        h4 {
            font-size: 24px;
            font-style: normal;
            font-weight: normal;
            line-height: 120%;
            color: #333333;
        }

        .es-header-body h4 a,
        .es-content-body h4 a,
        .es-footer-body h4 a {
            font-size: 24px;
        }

        h5 {
            font-size: 20px;
            font-style: normal;
            font-weight: normal;
            line-height: 120%;
            color: #333333;
        }

        .es-header-body h5 a,
        .es-content-body h5 a,
        .es-footer-body h5 a {
            font-size: 20px;
        }

        h6 {
            font-size: 16px;
            font-style: normal;
            font-weight: normal;
            line-height: 120%;
            color: #333333;
        }

        .es-header-body h6 a,
        .es-content-body h6 a,
        .es-footer-body h6 a {
            font-size: 16px;
        }

        a.es-button,
        button.es-button {
            padding: 15px 20px 15px 20px;
            display: inline-block;
            background: #4114F7;
            border-radius: 30px 30px 30px 30px;
            font-size: 22px;
            font-family: Imprima, Arial, sans-serif;
            font-weight: bold;
            font-style: normal;
            line-height: 120%;
            color: #ffffff;
            text-decoration: none !important;
            width: auto;
            text-align: center;
            letter-spacing: 0;
        }

        @media only screen and (max-width: 600px) {

            a.es-button,
            button.es-button {
                border-top-width: 15px !important;
                border-bottom-width: 15px !important;
            }
        }
    </style>
</head>

<body class="body">
    <div class="container" style="text-align: center;"> <!-- Added style for center alignment -->
        <div dir="ltr" class="es-wrapper-color">
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td class="esd-email-paddings" valign="top">

                            <table cellpadding="0" cellspacing="0" class="es-content">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe">
                                            <table class="es-content-body" cellpadding="0" cellspacing="0" width="600"
                                                style="border-radius: 20px 20px 0 0 ">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p40t es-p40r es-p40l">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="520" class="esd-container-frame"
                                                                            valign="top">
                                                                            <table cellpadding="0" cellspacing="0"
                                                                                width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-image es-m-txt-c"
                                                                                            style="font-size: 0px;"><a
                                                                                                target="_blank"
                                                                                                href="https://www.wechirka.com"><img
                                                                                                    src="https://res.cloudinary.com/dciy3u6un/image/upload/v1701947849/service/paanrsds5krezvpreog0.webp"
                                                                                                    alt="Підтвердження E-mail"
                                                                                                    style="display:block;border-radius:100px"
                                                                                                    width="100"
                                                                                                    title="Підтвердження E-mail"
                                                                                                    class="adapt-img"></a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="es-p20t es-p40r es-p40l esd-structure">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="520" class="esd-container-frame"
                                                                            valign="top">
                                                                            <table cellpadding="0" cellspacing="0"
                                                                                width="100%"
                                                                                style="background-color: #fafafa; border-radius: 10px; border-collapse: separate;">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td
                                                                                            class="esd-block-text es-p20">
                                                                                            <h3>WECHIRKA.COM</h3>
                                                                                            <p>​</p>
                                                                                            <h3><span
                                                                                                    style="font-family:courier new, courier, lucida sans typewriter, lucida typewriter, monospace">Вітаємо
                                                                                                    з
                                                                                                    реєстрацією</span>&nbsp;
                                                                                            </h3>
                                                                                            <p><br></p>
                                                                                            <p>Дякуємо за реєстрацію на
                                                                                                нашій платформі для
                                                                                                пошуку
                                                                                                артистів.<br><br>Підтвердьте
                                                                                                свою електронну адресу,
                                                                                                натиснувши кнопку нижче.
                                                                                                Цей
                                                                                                крок додає додатковий
                                                                                                захист
                                                                                                вашому профілю,
                                                                                                підтверджуючи, що ви
                                                                                                володієте цією
                                                                                                електронною
                                                                                                адресою.</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" class="es-content">
                                <tbody>
                                    <tr>
                                        <td class="esd-stripe">
                                            <table class="es-content-body" cellpadding="0" cellspacing="0" width="600">
                                                <tbody>
                                                    <tr>
                                                        <td class="esd-structure es-p30t es-p40b es-p40r es-p40l">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="520" class="esd-container-frame"
                                                                            valign="top">
                                                                            <table cellpadding="0" cellspacing="0"
                                                                                width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-button">
                                                                                            <span
                                                                                                class="es-button-border"><a
                                                                                                    href="${process.env.FRONT_LINK}verify-email/${id}"
                                                                                                    class="es-button msohide"
                                                                                                    target="_blank">Підтвердити
                                                                                                    E-mail</a></span>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="esd-structure es-p40r es-p40l">
                                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td width="520" class="esd-container-frame"
                                                                            valign="top">
                                                                            <table cellpadding="0" cellspacing="0"
                                                                                width="100%">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td class="esd-block-text">
                                                                                            <p>З найкращими побажаннями,
                                                                                            </p>
                                                                                            <p>​<br>Команда wechirka.com
                                                                                            </p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td class="esd-block-spacer es-p40t es-p20b"
                                                                                            style="font-size:0">
                                                                                            <table width="100%"
                                                                                                height="100%"
                                                                                                cellpadding="0"
                                                                                                cellspacing="0">
                                                                                                <tbody>
                                                                                                    <tr>
                                                                                                        <td
                                                                                                            style="background: unset; height: 20px; width: 100%; margin: 0px;">
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>


                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</body>

</html>`;
}
