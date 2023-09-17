import { Router } from 'express'
// const app = express()
const router = Router()
import { signUp, signIn, me } from '../controllers/auth.js'
import { createComm, getAllComm, getAllMembers, getMyOwnedComm, getMyJoinedComm } from '../controllers/community.js'
import authentication from '../middleware/authentication.js'

router.route('/').post(createComm).get(getAllComm)
router.route('/:id/members').get(getAllMembers)
router.route('/me/owner').get(getMyOwnedComm)
router.route('/me/member').get(getMyJoinedComm)

// const notFoundMiddleware = require('../middleware/not-found')
// app.use(notFoundMiddleware)


export default router
