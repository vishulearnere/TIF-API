// const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const User = require('./User')
// const Community = require('./Community')
// const Role = require('./Role')
// const { Snowflake } = require('@theinternetfolks/snowflake')
// // const normalize = require('normalize-mongoose')
// require('dotenv').config()

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from './User.js' // Adjust the path to match your project structure
import Community from './Community.js' // Adjust the path to match your project structure
import Role from './Role.js' // Adjust the path to match your project structure
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
