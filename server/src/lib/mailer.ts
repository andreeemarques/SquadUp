import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // necessário na porta 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const PRIMARY_COLOR = '#1489e7'
const BACKGROUND_COLOR = '#0a0f18'
const CARD_COLOR = '#10141d'
const BORDER_COLOR = '#23262e'
const TEXT_COLOR = '#f2f3f5'
const MUTED_COLOR = '#9099a4'
const ACCENT_COLOR = '#f6722b'

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = `
<!DOCTYPE html>
<html lang="pt" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>Recuperação de password</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: ${BACKGROUND_COLOR}; }
  a { color: ${PRIMARY_COLOR}; }
</style>
</head>
<body style="margin:0; padding:0; background-color:${BACKGROUND_COLOR};">
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    Recebemos um pedido para repor a tua password no SquadUp. Este link expira em 1 hora.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BACKGROUND_COLOR};">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%;">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:${PRIMARY_COLOR}; width:32px; height:32px; border-radius:8px; text-align:center; vertical-align:middle;">
                    <span style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px; font-weight:bold; line-height:32px;">+</span>
                  </td>
                  <td style="padding-left:10px; font-family:Arial, sans-serif; font-size:20px; font-weight:bold; letter-spacing:1px; color:${TEXT_COLOR};">
                    SQUAD<span style="color:${PRIMARY_COLOR};">UP</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:${CARD_COLOR}; border:1px solid ${BORDER_COLOR}; border-radius:16px; padding:32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:Arial, sans-serif; font-size:20px; font-weight:bold; color:${TEXT_COLOR}; padding-bottom:12px;">
                    Reset your password
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Arial, sans-serif; font-size:14px; line-height:22px; color:${MUTED_COLOR}; padding-bottom:24px;">
                    Recebemos um pedido para repor a password da tua conta SquadUp. Clica no botão abaixo para escolheres uma nova password. Este link expira em <strong style="color:${TEXT_COLOR};">1 hora</strong>.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${resetUrl}" style="height:44px;v-text-anchor:middle;width:220px;" arcsize="18%" fillcolor="${PRIMARY_COLOR}" strokecolor="${PRIMARY_COLOR}">
                    <w:anchorlock/>
                    <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">Reset Password</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${resetUrl}" target="_blank" style="background-color:${PRIMARY_COLOR}; color:#ffffff; font-family:Arial, sans-serif; font-size:14px; font-weight:bold; text-decoration:none; padding:13px 28px; border-radius:8px; display:inline-block;">
                      Reset Password
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
                <tr>
                  <td style="font-family:Arial, sans-serif; font-size:12px; line-height:18px; color:${MUTED_COLOR}; word-break:break-all;">
                    Ou copia este link para o browser:<br>
                    <a href="${resetUrl}" style="color:${PRIMARY_COLOR}; text-decoration:underline;">${resetUrl}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px; font-family:Arial, sans-serif; font-size:12px; line-height:18px; color:${MUTED_COLOR};">
              Se não pediste esta alteração, podes ignorar este email com segurança — a tua password não vai ser alterada.
              <br><br>
              &copy; ${new Date().getFullYear()} SquadUp
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()

  const text = `Recuperação de password — SquadUp

Recebemos um pedido para repor a password da tua conta.
Abre este link para escolheres uma nova password (expira em 1 hora):

${resetUrl}

Se não pediste esta alteração, ignora este email.`

  await transporter.sendMail({
    from: `"SquadUp" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Recuperação de password — SquadUp',
    html,
    text,
  })
}