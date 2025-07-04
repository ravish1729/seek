import { NextFunction, Response, Request } from 'express'

import responseParser from '../../utils/responseParser.js'
import { getUserByPublicKey } from '../../db/sqlite/user/getUserByPublicKey.js'
import { getTaggedContent } from '../../db/sqlite/user/getTaggedContent.js'

export const get_profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInfo = await getUserByPublicKey(req.body.user.publicKey)
    res.status(200).json(responseParser(userInfo))
  } catch (error) {
    next(error)
  }
}

export const get_tagged_content = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body.user)
    const tags = await getTaggedContent(req.body.user.userId)
    console.log(tags)
    res.status(200).json(responseParser(tags))
  } catch (error) {
    next(error)
  }
}
