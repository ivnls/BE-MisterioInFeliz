import express from 'express';
import { registerPassword, login } from './controllers';

const router = express.Router();

router.post('/register', registerPassword as any);

router.post('/login', login as any);

export default router;
