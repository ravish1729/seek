import { NextFunction, Response, Request } from 'express'

import responseParser from '../../utils/responseParser.js'
import { search } from '../../db/sqlite/search/search.js'

export const search_content = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.query.query)
    const response = await search(req.query.query as string)
    res.status(200).json(responseParser(response))
  } catch (error) {
    next(error)
  }
}
