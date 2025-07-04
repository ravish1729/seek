import { NextFunction, Response, Request } from 'express'

import responseParser from '../../utils/responseParser.js'
import { getMessage, verifyUserSignature } from './helper/authHelper.js'

export const get_auth_message = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = await getMessage(req.query.publicKey as string)
    res.status(200).json(responseParser(message))
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const verify_signature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = await verifyUserSignature(req.query.publicKey as string, req.query.signature as string)
    res.status(200).json(responseParser({access_token: accessToken.accessToken}))
  } catch (error) {
    console.log(error)
    next(error)
  }
}
