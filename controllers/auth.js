
import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js' 
import { BadRequestError, UnauthenticatedError } from '../errors/index.js' 
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const signUp = async (req, res) => {
  const {name,email,password} =  req.body

  // const salt = await bcrypt.genSalt(10)  // more the gensalt number, more randome bytes mores secure but more processing time
  // const hashPassword = await bcrypt.hash(password,salt)
  // const tempUser = {name,email,password:hashPassword}
  // ------------ all bcrypt code goes in model - userschema
  console.log('Inside sigup')

  //  Validation 
  if(!name || !email || !password)  // here we are checking it in controller but we have also checked it in mongoose as well [by require ]
  {
      throw new BadRequestError('Please provide name, email and password')
  }

  const user = await User.create({ ...req.body })

  //   const token = jwt.sign({ userID: user._id, name: user.name }, 'jwtsecret', {
  //     expiresIn: '30d',
  //   }) // [payload(can be id or name or anything you want to share),secret(),expiresin]

  const token = await user.createJWT()  // this function can be only be called by user[the returned instance of model] not User[model]
  //   const {password, ...responseUser} = user // can't use this since password is already declared
// console.log(user.createdAt)
// console.log(user)
 const responseUser = {
   id: user._id,
   name: user.name,
   email: user.email,
   createdAt: user.createdAt,
 }

 res
   .status(StatusCodes.CREATED)
   .json({
     status: true,
     content: { data: responseUser, meta: { access_token: token } },
   })
}

// SignIn
const signIn = async (req, res) => {
  const { email, password } = req.body
  // Validation 
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  // here we have to check email and password in controllers
  //  beacuse it is not checked in mongoose model (we are not creating instance of model so mongoose validation does not work )
  // if we do not check here  then the error will be thrown by findOne

  const user = await User.findOne({ email: email })
  if (!user) {
    throw new UnauthenticatedError('Email is not registerd in application')
  }

  console.log(user)
  const isPasswordCorrect = await user.comparePassword(password)
  console.log(isPasswordCorrect)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // console.log('yaha tak')
  // compare password
  const token = await user.createJWT()
  const responseUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
    // const oneDay = 1000 * 60 * 60 * 24
    // res.cookie('token', token, {
    //   httpOnly: true,
    //   expires: new Date(Date.now() + oneDay),
    //   secure: process.env.NODE_ENV === 'production',
    // })

  res.status(StatusCodes.OK).json({ status: true, content: { data: responseUser , meta:{access_token:token }}})
}

// GET me 
const me = async(req,res) => {
    console.log(req.user)
    if(!req.user)
    {   throw new UnauthenticatedError('UnAuthenticated  error')

    }
    res.status(StatusCodes.OK).json({status: true,content:{data:req.user}})
}

// module.exports = { signUp, signIn, me }
export { signUp, signIn, me }
