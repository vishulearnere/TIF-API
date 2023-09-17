// const { StatusCodes } = require('http-status-codes')
// const mongoose = require('mongoose')
// const Role = require('../models/Role')
// const { BadRequestError, UnauthenticatedError } = require('../errors')
// const bcrypt = require('bcryptjs')
// require('dotenv').config()
// const jwt = require('jsonwebtoken')

import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Import your custom models and other dependencies (adjust the paths accordingly)
import Role from '../models/Role.js'

// Load environment variables
import dotenv from 'dotenv'
dotenv.config()


const createRole = async(req,res) =>{
    const rolesArray = ['Community Admin', 'Community Member', 'Community Moderator']
    const {name} = req.body
    if(!name)
    {
         throw new BadRequestError('Please provide Role name')
    } 
    if(!rolesArray.includes(name)){
        throw new BadRequestError(`Please provide Role name from : 'Community Admin', 'Community Member', 'Community Moderator' `)

    }
     
    const role = await Role.create({ ...req.body })
    return res.status(StatusCodes.CREATED).json({status:true,content:{data:role}})


}
const getAllRoles = async(req,res) =>{
    const allRoles = await Role.find({ })
    console.log(allRoles)


   // Pagination 
    const meta = {}
    meta.total = allRoles.length
    meta.pages = Math.ceil(meta.total / 10)
    meta.page = req.query.page || 1
    const start = (meta.page -1) * 10
    const last = (meta.page ) * 10 

  console.log(meta,start,last)
return res
  .status(StatusCodes.CREATED)
  .json({ status: true, content: { meta, data: allRoles.slice(start,last) } })

}

export {createRole,getAllRoles}
// module.exports = {createRole,getAllRoles}