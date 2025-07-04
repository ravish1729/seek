import { NextFunction, Response, Request } from 'express'
import responseParser from '../../utils/responseParser.js'
import { addContent, editContent } from './helper/addContent.js'
import { exploreContentByUser, exploreContentLatest } from '../../db/sqlite/tag/exploreContent.js'
import { exploreContentTrending } from '../../db/sqlite/tag/exploreContent.js'
import { getUserByPublicKey } from '../../db/sqlite/user/getUserByPublicKey.js'
import { createComment } from '../../db/sqlite/content/createComment.js'
import { getComments } from '../../db/sqlite/content/getComments.js'
import { removeComment } from '../../db/sqlite/content/removeComment.js'
import { upvote } from '../../db/sqlite/content/upvote.js'
import { downvote } from '../../db/sqlite/content/downvote.js'
import { getDescription } from '../../db/sqlite/content/getDescription.js'
import { getInfoByMetadataCID } from '../../db/sqlite/content/getInfoByMetadataCID.js'
// import { bountyCIDList, addBountyCID } from './helper/bountyCID.js'

export const add_content = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await addContent(req.body)
    res.status(200).json(responseParser(response))
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const edit_content = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await editContent(req.body)
    res.status(200).json(responseParser(response))
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const get_content_information = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await getInfoByMetadataCID(req.query.metadata_cid as string)
    res.status(200).json(responseParser(response))
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const get_content_description = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await getDescription(parseInt(req.query.content_id as string))
    res.status(200).json(responseParser(response))
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const explore_content = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const by = req.query.by as string
    const response = await exploreContentLatest(1, 50)
    // let response: any[] = []
    // if (by === 'trending') {
    //   response = await exploreContentTrending()
    // } else if (by === 'latest') {
    //   response = await exploreContentLatest()
    // } else if (by === 'user') {
    //   const user = await getUserByPublicKey(req.body.user.publicKey) as { id: number } | null
    //   if (user) {
    //     response = await exploreContentByUser(user.id)
    //   }
    // }
    res.status(200).json(responseParser(response))
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const post_comment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await createComment(req.body.user.userId, req.body.content_id, req.body.comment)
    res.status(200).json(responseParser(response))
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const get_comments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await getComments(req.query.content_id as string)
    res.status(200).json(responseParser(response))
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const delete_comment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await removeComment(req.body.data.comment_id, req.body.user.userId)
    res.status(200).json(responseParser(response))
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const upvote_content = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await upvote(parseInt(req.query.content_id as string), req.body.user.userId)
    res.status(200).json(responseParser(response))
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const downvote_content = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await downvote(parseInt(req.query.content_id as string), req.body.user.userId)
    res.status(200).json(responseParser(response))
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// export const bounty_cid_list = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const response = await bountyCIDList()
//     res.status(200).json(responseParser(response))
//   } catch (error) {
//     console.log(error)
//     next(error)
//   }
// }

// export const add_bounty_cid = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const response = await addBountyCID(req.query.cid as string)
//     res.status(200).json(responseParser(response))
//   } catch (error) {
//     console.log(error)
//     next(error)
//   }
// }
