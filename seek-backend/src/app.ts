import express, { Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import expressWinston from 'express-winston'

import { sqliteTableSetup, cleanAllTables } from './db/connect/sqliteTableSetup.js'
import AuthRouter from './routes/auth.js'
import UserRouter from './routes/user.js'
import ContentRouter from './routes/content.js'
import SearchRouter from './routes/search.js'
import errorHandler from './middlewares/error/index.js'
import logger from './utils/logger.js'

const app = express()
app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  logger.info(req.originalUrl)
  next()
})
app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
  }),
)

app.use(cors())

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK')
})

app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/user', UserRouter)
app.use('/api/v1/content', ContentRouter)
app.use('/api/v1/search', SearchRouter)

app.use(errorHandler)

// Uncomment the next line to clean all tables before starting
// await cleanAllTables()

await sqliteTableSetup()

export default app
