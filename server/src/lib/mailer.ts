import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await transporter.sendMail({
    from: '"SquadUp" <no-reply@squadup.app>',
    to,
    subject: 'Recuperação de password — SquadUp',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Recuperação de password</h2>
        <p>Recebemos um pedido para repor a tua password no SquadUp.</p>
        <p><a href="${resetUrl}" style="background:#000;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Repor password</a></p>
        <p>Este link expira em 1 hora. Se não pediste isto, ignora este email.</p>
      </div>
    `,
  })
}