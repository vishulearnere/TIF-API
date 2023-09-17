
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';

import Community from '../models/Community.js';
import Role from '../models/Role.js';
import User from '../models/User.js';
import Member from '../models/Member.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();


// Add Member
const addMemeber = async(req,res)=>{
    const {community,user,role} = req.body
    
    // validate the Input
    if(!community || !user || ! role)
    {
        throw new BadRequestError('Please Provide Community , user and role ')
    }
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
    const isAlreadyMember = await Member.find({community:community,user:user})
    console.log(isAlreadyMember)
    if(isAlreadyMember.length)
    {
      return   res.status(StatusCodes.METHOD_NOT_ALLOWED).json({msg:`The user with user ID ${user} is alreay a member of community`})
    }

    // whether the logged_in user is community admin or not
    const isLoggedinAdmin = await Community.find({_id:community,owner:req.user._id})
    if(!isLoggedinAdmin.length)
    {
        throw new BadRequestError('NOT_ALLOWED_ACCESS')
    }
    // If Logged In user is admin then create a member of that community
    const newMember = await  Member.create({...req.body})
   return  res.status(StatusCodes.CREATED).json({status: true, content:{ data:newMember}})

}

// Remove Member
const removeMember = async(req,res)=>{
  // Validation
  // find member row from  member table by id and get community id
  const memberExists = await Member.findOne({ _id: req.params.id }).populate('role', '_id name')
  console.log(memberExists)
  if (!memberExists) {
    return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      msg: `There is no Memeber Associated with Member ID ${req.params.id}`,
    })
  }
  // find whrther LoggedIn user  has same community  by communityId and and userId
  // Note:- memberExists is an array, since we are finding by id , we can asssume there would be only one member with that id in array  at index 0
  // or we used findOne
  const loggedUser = await Member.findOne({
    user: req.user._id,
    community: memberExists.community,
  }).populate('role', '_id name')
  // const temp2 = await Member.find({user:req.user._id })
  // if the logged in user is modertaor or admin of that specific community
  console.log(memberExists, req.user, loggedUser, 'i am in removemember')
  if (
    loggedUser?.role?.name === 'Community Admin' ||
    (loggedUser?.role?.name === 'Community Moderator' &&
      memberExists?.role?.name !== 'Community Admin')
  ) {
    console.log('i am inside')
    const removedMember = await Member.findByIdAndDelete(req.params.id)
    console.log(removedMember)
    return res.status(StatusCodes.OK).json({ staus: true })
  }

  throw new BadRequestError('NOT_ALLOWED_ACCESS')
}



export {addMemeber,removeMember}
// module.exports = {addMemeber,removeMember}