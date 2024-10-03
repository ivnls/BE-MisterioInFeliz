import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendVerificationEmail = (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verificação de E-mail',
    text: `Clique no link para verificar seu e-mail: http://localhost:3000/api/verify-email?token=${token}`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('E-mail enviado')
    }
  })
}
