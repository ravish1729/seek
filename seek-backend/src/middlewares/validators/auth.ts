import joi from 'joi'

export const AuthMessageSchema = joi.object({
  publicKey: joi.string().max(100).required().messages({
    'any.required': 'public key not found.',
  }),
})

export const VerifySignatureSchema = joi.object({
  publicKey: joi.string().max(100).required().messages({
    'any.required': `publicKey not found`,
  }),
  signature: joi.string().max(300).required().messages({
    'any.required': `signature not found`,
  }),
})
