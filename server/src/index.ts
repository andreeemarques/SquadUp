import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth'
import usersRoutes from './routes/users'
import squadsRoutes from './routes/squads'
import notificationsRoutes from './routes/notifications'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/squads', squadsRoutes)
app.use('/api/notifications', notificationsRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API a correr em http://localhost:${PORT}`))