import express from 'express'
import router from './routes'
import dotenv from 'dotenv'

const app = express()

dotenv.config()

app.use(express.json())

app.use('/api', router)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
