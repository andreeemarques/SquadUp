import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import usersRoutes from './routes/users'
import squadsRoutes from './routes/squads'
import { errorHandler } from './middleware/errorHandler'
import notificationsRoutes from './routes/notifications'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/squads', squadsRoutes)

app.use('/api/notifications', notificationsRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API a correr em http://localhost:${PORT}`))