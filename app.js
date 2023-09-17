import dotenv from 'dotenv'
// Load environment variables
dotenv.config()
import 'express-async-errors'

//Database
import connectDB from './db/connect.js'
import cookieParser from 'cookie-parser'
import express, { json } from 'express'


// Security package 
import helmet from 'helmet'
import rateLimiter from 'express-rate-limit'
import cors from 'cors'
import xss from 'xss-clean'

// Swagger 
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

const swaggerDocument = YAML.load('./swagger.yaml')

const app = express()

// Packages

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
)
app.use(json())
app.use(cookieParser())
app.use(helmet())
app.use(cors())
app.use(xss())

// Routes
import authRouter from './routes/auth.js'
import roleRouter from './routes/role.js'
import communityRouter from './routes/community.js'
import memberRouter from './routes/member.js'

// Middleware
import authentication from './middleware/authentication.js'
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'

app.get('/', (req, res) => {
  res.status(200).send('<h1>Hello Vishal</h1> <h2>TIF - Community API</h2><a href="/api-docs">Documentation</a>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))


app.use('/v1/auth', authRouter)
app.use('/v1/role', authentication, roleRouter)
app.use('/v1/community', authentication, communityRouter)
app.use('/v1/member', authentication, memberRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)





const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log('database is connected')
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
