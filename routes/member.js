
import { Router } from 'express'
const router = Router()
import { addMemeber, removeMember } from '../controllers/member.js'
router.route('/').post(addMemeber)
router.route('/:id').delete(removeMember)

export default router
