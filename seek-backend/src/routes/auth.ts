import express from 'express'

import {
  get_auth_message,
  verify_signature,
} from '../controller/authentication/index.js'
import validator from '../middlewares/validators/index.js'
import validate from '../middlewares/validate.js'

const router = express.Router()

router.get('/get_auth_message', validate(validator.AuthMessageSchema, { query: true }), get_auth_message)
router.get(
  '/verify_signature',
  validate(validator.VerifySignatureSchema, { query: true }),
  verify_signature,
)

export default router
