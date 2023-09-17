
import Role from '../models/Role.js'
import { pagination } from '../utils/index.js';
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'



// Load environment variables
import dotenv from 'dotenv'
dotenv.config()

// Create Role
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

// Get All Roles
const getAllRoles = async(req,res) =>{
    const allRoles = await Role.find({ })
    console.log(allRoles)

    const {meta, start,last} = await pagination(req,allRoles.length)
   // Pagination 
    // const meta = {}
    // meta.total = allRoles.length
    // meta.pages = Math.ceil(meta.total / 10)
    // meta.page = req.query.page || 1
    // const start = (meta.page -1) * 10
    // const last = (meta.page ) * 10 

  console.log(meta,start,last)
return res
  .status(StatusCodes.CREATED)
  .json({ status: true, content: { meta, data: allRoles.slice(start,last) } })

}

export {createRole,getAllRoles}
// module.exports = {createRole,getAllRoles}