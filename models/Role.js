
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

// RoleSchema.plugin(normalize)
export default mongoose.model('Role', RoleSchema)
// module.exports = mongoose.model('Role', RoleSchema)
