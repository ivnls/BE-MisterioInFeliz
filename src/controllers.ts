import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from './database'
import validator from 'validator'
import { sendVerificationEmail } from './mailer'

const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@aluno\.feliz\.ifrs\.edu\.br$/

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Login inválido!' })
    } else if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Login inválido' })
    }
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
      const user = result.rows[0]

      const isPasswordValid = await bcrypt.compare(password, user.passwd_hash)
      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
        return res.status(200).json({ message: 'Login bem-sucedido! Tenha uma boa jogatina!', token })
      } else {
        return res.status(400).json({ error: 'Credenciais inválidas' })
      }
    } catch (error) {
      console.error('Error during login:', error)
      res.status(500).json({ error: 'Erro ao fazer login' })
    }
}

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const minPasswdLen = 8
  const passwordStrengthRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email inválido!' })
  } else if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email deve estar no formato da instituição: nome.sobrenome@aluno.feliz.ifrs.edu.br' })
  }

  if (password === "") {
    return res.status(400).json({ error: 'A senha não pode estar em branco!' })
  } else if (password.length < minPasswdLen) {
    return res.status(400).json({ error: 'A senha deve ter mais de 8 caracteres!' })
  } else if (!passwordStrengthRegex.test(password)) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos um número, uma letra maiúscula, uma minúscula e um caractere especial!' })
  }

  try {
    const userExists = await pool.query('SELECT * FROM temp_users WHERE email = $1', [email])

    if (userExists.rowCount! > 0) {
      return res.status(400).json({ error: 'Este email já está registrado' })
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' })
    sendVerificationEmail(email, token)

    const hashedPassword = await bcrypt.hash(password, 12)
    await pool.query('INSERT INTO temp_users (email, passwd_hash) VALUES ($1, $2)', [email, hashedPassword])

    return res.status(200).json({ message: 'Registro bem-sucedido! Verifique seu email para ativar sua conta!' })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro ao registrar o usuário' })
  }
}


export const verifyEmail = async (req: Request, res: Response) => {
  const token = req.query.token as string

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string }

    const tempUser = await pool.query('SELECT * FROM temp_users WHERE email = $1', [decoded.email])

    if (tempUser.rowCount === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado.' })
    }

    const { passwd_hash } = tempUser.rows[0]

    await pool.query('INSERT INTO users (email, passwd_hash) VALUES ($1, $2)', [decoded.email, passwd_hash])

    await pool.query('DELETE FROM temp_users WHERE email = $1', [decoded.email])

    res.send('E-mail verificado com sucesso! Sua conta foi ativada.')

  } catch (error) {
    console.error('Erro ao verificar e-mail:', error)
    res.status(400).json({ error: 'Token inválido ou expirado.' })
  }
}

