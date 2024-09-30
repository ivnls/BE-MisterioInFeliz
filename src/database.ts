import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres', // Usuário
  host: 'localhost', // IP
  database: 'postgres', // nome da database
  password: 'senha123', // senha do banco
  port: 5432, // porta
});
