
// Import required modules using ES6 import statements
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import Community from '../models/Community.js';
import Role from '../models/Role.js';
import User from '../models/User.js';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
import dotenv from 'dotenv';
import Member from '../models/Member.js';
import { pagination } from '../utils/Pagination.js';

// Load environment variables
dotenv.config();


// Create Community 
const createComm = async (req, res) => {

  const { name } = req.body
  // we Don't need to validate name here, it is validated by mongoose
  const communityData = { name: req.body.name, owner: req.user._id }
  const community = await Community.create({ ...communityData })
  console.log(communityData, community)

  // after creating community, we need to
  // check whether we have Admin role in our Role Table if it is not there we need to create 'Community Role'
  let adminRoleId = ''
  const allRoles = await Role.find({})
  const adminRole = allRoles.filter((role) => role.name === 'Community Admin')
  console.log(allRoles, adminRole, adminRole.length, adminRole[0]?._id)

  // adminRole[0] because adminRole is an arrray with a single object of 'Community Admin'
  if (adminRole.length) {
    adminRoleId = adminRole[0]._id
    // need to conver object value to string  so it can be used as a filed in  creating instance of member table
  } else {
    const role = await Role.create({
      name: 'Community Admin',
      scopes: ['member-get', 'member-add', 'member-remove'],
    })
    console.log('role')
    adminRoleId = role._id
  }

  console.log(adminRoleId, typeof(adminRoleId))
  // Now, We have Admin Role Id, Let's create Our first member of Community with role Admin

  const member = await Member.create({
    community: community.id,
    user: req.user._id,
    role: adminRoleId,
  })
   console.log(member,'member')
  res.status(StatusCodes.CREATED).json({ status: true, content: { data: community }})
}

// GET all Community
const getAllComm = async (req, res) => {

  let allCommunities = await Community.find({}).populate('owner', 'name _id')
  // Pagination
  const { meta, start, last } = await pagination(req, allCommunities.length)
  // const meta = {}
  // meta.total = allCommunities.length
  // meta.pages = Math.ceil(meta.total / 10)
  // meta.page = req.query.page || 1
  // const start = (meta.page - 1) * 10
  // const last = meta.page * 10

  console.log(meta, start, last)
  // { status: true, content: { meta, data: allRoles.slice(start,last) } }
  res
    .status(StatusCodes.OK)
    .json({
      status: true,
      content: { meta, data: allCommunities.slice(start, last) },
    })
}

// Get All Members of Community
const getAllMembers = async (req, res) => {
  // Check Whether Community with provided Community Id  Exists or not 
    const communityId = req.params.id
    const validCommunity = await Community.find({ _id: communityId })
    if (!validCommunity.length) {
      throw new BadRequestError('Please Provide Valid CommunityId')
    }

  //here we hyave to check whether the Logged In user is member of Particular community of which all members we have to display
  // const temp = await Member.find({
  //   community: req.params.id,
  //   user: req.user._id,
  // })

  // // if Looged In user is not  a part of this community then return all the members of this community
  // if (!temp.length) {
  //   // else return this
  //   return res
  //     .status(StatusCodes.OK)
  //     .json({
  //       content:
  //         "Since You are  Not a Memeber of Community, Yo can't see their Members",
  //     })
  // }
  // console.log(temp)

  const allMembers = await Member.find({
    community: req.params.id,
  })
    .populate('user', 'name _id')
    .populate('role', 'name _id')

  // Pagination
   const {meta,start,last} = await pagination(req, allMembers.length)
  // const meta = {}
  // meta.total = allMembers.length
  // meta.pages = Math.ceil(meta.total / 10)
  // meta.page = req.query.page || 1
  // const start = (meta.page - 1) * 10
  // const last = meta.page * 10

  return res
    .status(StatusCodes.OK)
    .json({
      status: true,
      content: { meta, data: allMembers.slice(start, last) },
    })
}

// My Owned Community
const getMyOwnedComm = async (req, res) => {

  const ownComm = await Community.find({ owner: req.user._id })

  // Pagination
   const { meta, start, last } = await pagination(req, ownComm.length)
  // const meta = {}
  // meta.total = ownComm.length
  // meta.pages = Math.ceil(meta.total / 10)
  // meta.page = req.query.page || 1
  // const start = (meta.page - 1) * 10
  // const last = meta.page * 10

  return res.status(StatusCodes.OK).json({
    status: true,
    content: { meta, data: ownComm.slice(start, last) },
  })
}

// GET My Joined Community
const getMyJoinedComm = async (req, res) => {
  //  const ownComm = await Community.find({ user: req.user._id })
  //  return res.status(StatusCodes.OK).json({ content: ownComm })
  console.log(req.user, req.user._id)

  // find in Memebr Table with looged in user id get distinct commmunity with user id as logged In user ID
  // Now, Get All communities Detail from  those Distinct CommunityId (fetched from member table)
  // const temp = await Member.distinct('Community', { user: req.user._id })

  const JoinedCommunities = await Community.find({
    _id: { $in: await Member.distinct('community', { user: req.user._id }) },
  }).populate('owner', 'name _id')

  // Pagination
   const { meta, start, last } = await pagination(req, JoinedCommunities.length)
  // const meta = {}
  // meta.total = JoinedCommunities.length
  // meta.pages = Math.ceil(meta.total / 10)
  // meta.page = req.query.page || 1
  // const start = (meta.page - 1) * 10
  // const last = meta.page * 10

  return res.status(StatusCodes.OK).json({
    status: true,
    content: { meta, data: JoinedCommunities.slice(start, last) },
  })

}

export {
  createComm,
  getAllComm,
  getAllMembers,
  getMyOwnedComm,
  getMyJoinedComm,
}
