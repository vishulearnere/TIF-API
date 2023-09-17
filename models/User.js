// const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// require('dotenv').config()
// const  { Snowflake } = require('@theinternetfolks/snowflake')

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Snowflake } from '@theinternetfolks/snowflake'

// Load environment variables
dotenv.config()
// const {normalize} = require('normalize-mongoose')
const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(), // Generate a UUID v4 as the default value
    },
    name: {
      type: String,
      minLength: [2, 'Name can not be less than 2 characters'],
      trim: true,
      required: [true, 'Please enter the name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please Provide Valid Email',
      ],
      unique: true,
    },
    password: {
      type: String,
      minLength: [6, 'Password can not be less than 6 characters'],
      required: [true, 'Please Provide Password'],
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  // always use function keyword here not arrow function, by doing so you can acess 'this' instance keyboard
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = async function () {
  // while giving async keyword to above function it gives error
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

UserSchema.methods.comparePassword = async function (userPassword) {
  // if async keyword is used here (in mongoose instance) then make sure you use 'await' keyword while calling this function
  const isMatch = await bcrypt.compare(userPassword, this.password)
  return isMatch
}

// UserSchema.plugin(normalize)
// module.exports = mongoose.model('User', UserSchema)
export default mongoose.model('User', UserSchema)
