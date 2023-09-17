import dotenv from 'dotenv'

// Load environment variables
dotenv.config()
import 'express-async-errors'
import connectDB from './db/connect.js'

import express, { json } from 'express'
const app = express()

app.use(json())

app.get('/', (req, res) => {
  res.status(200).send('Hello Vishal')
})

import authRouter from './routes/auth.js'
app.use('/v1/auth', authRouter)
//hhffffyjbgfhg
import authentication from './middleware/authentication.js'
import roleRouter from './routes/role.js'
app.use('/v1/role', authentication, roleRouter)

import communityRouter from './routes/community.js'
app.use('/v1/community', authentication, communityRouter)

import memberRouter from './routes/member.js'
app.use('/v1/member', authentication, memberRouter)

console.log('33')
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'


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
