import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectDB } from './config/database'
import authRoutes from './routes/auth'

dotenv.config()

const app = express()
const PORT = process.env.PORT

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/auth', authRoutes)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`)
  })
}

start()

export default app
