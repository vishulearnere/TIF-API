// const { CustomAPIError } = require('../errors')
// const { StatusCodes } = require('http-status-codes')

import { CustomAPIError } from '../errors/index.js' // Adjust the path to match your project structure
import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || `Something Went Wrong, try again later`,
  }
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, Please choose another value`
    customError.statusCode = 400
  }
  if (err.name === 'ValidationError') {
    // console.log(err)
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ')
    customError.statusCode = 400
  }
  // console.log(err);
  if (err.name === 'CastError') {
    customError.msg = `No item found with id ${err.value}`
    customError.statusCode = 404
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err: err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

export default errorHandlerMiddleware
// module.exports = errorHandlerMiddleware
