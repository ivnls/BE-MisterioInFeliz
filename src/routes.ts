import express from 'express'
import { register, login, verifyEmail } from './controllers'

const router = express.Router()

router.post('/register', register as any)
router.post('/login', login as any)
router.get('/verify-email', verifyEmail as any)

export default router
