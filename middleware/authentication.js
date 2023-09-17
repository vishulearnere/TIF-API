

// Import required modules using ES6 import statements
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust the path to match your project structure
import { UnauthenticatedError } from '../errors/index.js'; // Adjust the path to match your project structure

// Load environment variables
dotenv.config();

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // attach the user to the job routes
    // req.user = { userId: payload.userId, name: payload.name }
    console.log(payload)
    // const tempUser = await User.findById(payload.userId)
    // console.log(tempUser)
      req.user = await User.findById(payload.userId).select('-password')
    next()
  } catch (error) {
    throw new UnauthenticatedError('the route is unauthorized')
  }
}

export default auth
// module.exports = auth
