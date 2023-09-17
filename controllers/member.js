// const { StatusCodes } = require('http-status-codes')
// const mongoose = require('mongoose')
// const Community = require('../models/Community')
// const Role = require('../models/Role')
// const User = require('../models/User')
// const { BadRequestError, UnauthenticatedError } = require('../errors')
// const bcrypt = require('bcryptjs')
// require('dotenv').config()
// const jwt = require('jsonwebtoken')
// const Member = require('../models/Member')

// Import required modules using ES6 import statements
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import your custom models (adjust the paths accordingly)
import Community from '../models/Community.js';
import Role from '../models/Role.js';
import User from '../models/User.js';
import Member from '../models/Member.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();



const addMemeber = async(req,res)=>{
    const {community,user,role} = req.body
    if(!community || !user || ! role)
    {
        throw new BadRequestError('Please Provide Community , user and role ')
    }
   // validate the Input
    const validUser = await User.find({_id: user })
    if(!validUser.length)
    {
        throw new BadRequestError('Please Provide Valid UserId')
    }
    const validCommunity = await Community.find({_id: community })
    if (!validCommunity.length) {
      throw new BadRequestError('Please Provide Valid CommunityId')
    }
    const validRole = await Role.find({_id: role })
    if (!validRole.length) {
      throw new BadRequestError('Please Provide Valid RoleId')
    }
    

    // this will ensure a user does have unique role in community not the two roles simultaneously means user is not a part of particular community before.
    const temp0 = await Member.find({community:community,user:user})
    console.log(temp0)
    if(temp0.length)
    {
      return   res.status(StatusCodes.METHOD_NOT_ALLOWED).json({msg:`The user with user ID ${user} is alreay a member of community`})
    }
    // whether the logged_in user is community admin or not
    const temp = await Community.find({_id:community,owner:req.user._id})
    if(!temp.length)
    {
        throw new BadRequestError('NOT_ALLOWED_ACCESS')
    }
    const newMember = await  Member.create({...req.body})

   return  res.status(StatusCodes.CREATED).json({status: true, content:{ data:newMember}})

}

const removeMember = async(req,res)=>{

    // find member row from  member table by id and get community id
    const temp = await Member.findOne({_id:req.params.id})
    console.log(temp)
    if(!temp){
        return   res.status(StatusCodes.METHOD_NOT_ALLOWED).json({msg:`There is no Memeber Associated with Member ID ${req.params.id}`})
    }
    // find whrther LoggedIn user  has same community  by communityId and and userId 
    // Note:- temp is an array, since we are finding by id , we can asssume there would be only one member with that id in array  at index 0 
    // or we used findOne
    const temp1 = await Member.findOne({user:req.user._id, community:temp.community }).populate('role' , '_id name')
    // const temp2 = await Member.find({user:req.user._id })
    // if the logged in user is modertaor or admin of that specific community
    console.log(temp,req.user, temp1,"i am in removemember")
    if(temp1?.role?.name ==='Community Admin' || temp1?.role?.name ==='Community Moderator' )
    {    console.log('i am inside')
        const removedMember = await Member.findByIdAndDelete(req.params.id)
        console.log(removedMember)
        return  res.status(StatusCodes.OK).json({staus:true,data:removedMember})
    }
    
    throw new BadRequestError('NOT_ALLOWED_ACCESS')

}



export {addMemeber,removeMember}
// module.exports = {addMemeber,removeMember}