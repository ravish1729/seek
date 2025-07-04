import express from 'express'

import { get_profile, get_tagged_content } from '../controller/user/index.js'
import authenticator from '../middlewares/authenticator.js'

const router = express.Router()

router.get('/get_tagged_content', authenticator(), get_tagged_content)
router.get('/get_profile', authenticator(), get_profile)
// router.get('/reviewed_cids', authenticator(), reviewed_cids)
// router.get('/reported_cids', authenticator(), reported_cids)

export default router
