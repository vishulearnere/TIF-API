// const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const { Snowflake } = require('@theinternetfolks/snowflake')
// // const normalize = require('normalize-mongoose')
// require('dotenv').config()
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Snowflake } from '@theinternetfolks/snowflake'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const RoleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(), // Generate a UUID v4 as the default value
    },
    name: {
      type: String,
      trim: true,
      minLength: [2, 'Name can not be less than 2 characters'],
      required: [true, 'Please enter the Role Name'],
      enum: {
        values: ['Community Admin', 'Community Member', 'Community Moderator'],
        message: 'Role Name {VALUE} is not supported', //change Value to VALUE
      },
      unique: true,
    },
    scopes: {
      type: [String],
      enum: {
        values: ['member-get', 'member-add', 'member-remove'],
        mesaage: '{VALUE} is not supported', //change Value to VALUE
      },
    },
  },
  { timestamps: true }
)

RoleSchema.pre('save', async function (next) {
  // always use function keyword here not arrow function, by doing so you can acess 'this' instance keyboard
  if (this.name === 'Community Admin') {
    this.scopes = ['member-get', 'member-add', 'member-remove']
  }
  else if(this.name === 'Community Moderator')
  {
     this.scopes = ['member-get', 'member-remove']
  }
  else if (this.name === 'Community Member')
  {
    this.scopes = ['member-get']
  }
})

RoleSchema.methods.createJWT = async function () {
  // while giving async keyword to above function it gives error
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

RoleSchema.methods.comparePassword = async function (userPassword) {
  // if async keyword is used here (in mongoose instance) then make sure you use 'await' keyword while calling this function
  const isMatch = await bcrypt.compare(userPassword, this.password)
  return isMatch
}
// RoleSchema.plugin(normalize)
export default mongoose.model('Role', RoleSchema)
// module.exports = mongoose.model('Role', RoleSchema)
