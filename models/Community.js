// const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const User = require('./User')
// const { Snowflake } = require('@theinternetfolks/snowflake')
// // const normalize = require('normalize-mongoose')
// require('dotenv').config()

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from './User.js' // Adjust the path to match your project structure
import { Snowflake } from '@theinternetfolks/snowflake'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const CommunitySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => Snowflake.generate(), // Generate a UUID v4 as the default value
    },
    name: {
      type: String,
      trim: true,
      minLength: [2, 'Name can not be less than 2 characters'],
      required: [true, 'Please enter the Community Name'],
    },
    slug: {
      type: String,
      unique: true,
    },
    owner: {
      type: String,
      ref: 'User',
      required: [true, 'Please Provide user'],
    },
  },
  { timestamps: true }
)

CommunitySchema.pre('save', async function (next) {
  this.slug = slugify(this.name)
  // Check slug uniqueness before saving
  try {
    // const count = await Community.countDocuments({ slug: this.slug })
    const count = await mongoose
      .model('Community')
      .countDocuments({ slug: this.slug })
    if (count > 0) {
      // If a duplicate slug is found, add a unique identifier to the slug
      const uniqueIdentifier = Date.now().toString(36)
      this.slug = `${this.slug}-${uniqueIdentifier}`
    }
    next()
  } catch (err) {
    next(err)
  }
})


function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/[^a-zA-Z0-9-]/g, '') // Remove special characters
    .replace(/-{2,}/g, '-') // Replace consecutive hyphens with a single hyphen
}


// CommunitySchema.plugin(normalize)
// module.exports = mongoose.model('Community', CommunitySchema)
export default mongoose.model('Community', CommunitySchema)
