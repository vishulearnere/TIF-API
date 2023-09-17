import { Router } from 'express'
const router = Router()
import { createRole, getAllRoles } from '../controllers/role.js'
router.route('/').post(createRole).get(getAllRoles)

export default router