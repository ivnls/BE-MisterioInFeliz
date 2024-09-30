import express from 'express';
import router from './routes';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(express.json());

app.use('/api', router);

// roda na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
