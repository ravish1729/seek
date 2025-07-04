import config from '../config/index.js'
import { verifyJWT } from '../utils/verifyJWT.js'
import CustomError from './error/customError.js'
import { JWTPayload } from '../types/user.js'
import { type NextFunction, type Request, type Response } from 'express'

const verifyAccessToken = async (accessToken: string) => {
  return verifyJWT(accessToken, config.jwt_secret) as JWTPayload
}

export default (rules: string[] = [], clauses: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers
      const accessToken = authorization?.split(' ')[1]
      console.log(accessToken)

      if (!accessToken) {
        throw new CustomError(401, 'Unauthorized: Access token missing.')
      }

      const keyRecord = await verifyAccessToken(accessToken)
      if (!keyRecord) {
        throw new CustomError(401, 'Unauthorized: Invalid access token.')
      }

      req.body.user = keyRecord
      next()
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
