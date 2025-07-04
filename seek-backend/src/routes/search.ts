import express from 'express'

import { search_content } from '../controller/search/index.js'
// import authenticator from '../middlewares/authenticator.js'

const router = express.Router()

router.get('/search_content', search_content)
// router.get('/karma_ranking', authenticator(), karma_ranking)
// router.get('/top_reviewers', authenticator(), top_reviewers)
// router.get('/top_reporters', authenticator(), top_reporters)
// router.get('/public_goods', authenticator(), public_goods)
// router.get('/top_rated_public_goods', authenticator(), top_rated_public_goods)

export default router
