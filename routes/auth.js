import { Router } from 'express'
const router = Router()
import { signUp, signIn, me } from '../controllers/auth.js'
import authentication from '../middleware/authentication.js'
router.post('/signup', signUp)
router.post('/signin', signIn)
router.get('/me',authentication, me)


export default router

// const express = require('express')
// const Router = express.Router()
