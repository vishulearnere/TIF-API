import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from './User.js' 
import Community from './Community.js'
import Role from './Role.js' 
import { Snowflake } from '@theinternetfolks/snowflake'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()
const MemberSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(), // Generate a UUID v4 as the default value
    },
    community: {
      type: String,
      ref: 'Community ',
      required: [true, 'Please Provide Community ID'],
    },
    user: {
      type: String,
      ref: 'User',
      required: [true, 'Please Provide User ID'],
    },
    role: {
      type: String,
      ref: 'Role',
      required: [true, 'Please Provide Role ID'],
    },
  },
  { timestamps: true }
)

// MemberSchema.plugin(normalize)

export default  mongoose.model('Member', MemberSchema)
// module.exports = mongoose.model('Member', MemberSchema)
