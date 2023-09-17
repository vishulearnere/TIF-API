// const mongoose = require('mongoose')
import mongoose from 'mongoose'
const mongoDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
}
// module.exports = mongoDB
export default mongoDB
