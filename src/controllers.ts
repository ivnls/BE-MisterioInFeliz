import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from './database';

// Este Regex serve para impedir login com outros domínios
const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@aluno\.feliz\.ifrs\.edu\.br$/;

// Aqui é feito o primeiro registro de senha do jogador
export const registerPassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email deve estar no formato nome.sobrenome@aluno.feliz.ifrs.edu.br' });
    }

    if (password == "") {
        return res.status(400).json({ error: 'A senha não pode estar em branco!' })
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }


        const user = result.rows[0];

        if (user.passwd_hash) {
            return res.status(200).json({ message: 'Você ja tem uma senha!, por favor faça login' });
        } else {
            
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query('UPDATE users SET passwd_hash = $1 WHERE email = $2', [hashedPassword, email]);
            
            return res.status(200).json({ message: 'A sua senha foi definida!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao verificar o usuário' });
    }
};

// Aqui é feito o login do jogador
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email deve estar no formato nome.sobrenome@aluno.feliz.ifrs.edu.br' });
    }

    if (password == "") {
        return res.status(400).json({ error: 'A senha não pode estar em branco!' })
    }
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      if (!user.passwd_hash) {
        return res.status(400).json({ error: 'Usuário não possui uma senha cadastrada' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.passwd_hash);
      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default', { expiresIn: '1h' });
        res.json({ token });
      } else {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  };
  
