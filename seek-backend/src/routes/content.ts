import express from 'express'

import {
  add_content,
  get_content_description,
  edit_content,
  explore_content,
  get_content_information,
  post_comment,
  get_comments,
  delete_comment,
  upvote_content,
  downvote_content,
//   submit_review,
} from '../controller/content/index.js'
import validator from '../middlewares/validators/index.js'
import validate from '../middlewares/validate.js'
import authenticator from '../middlewares/authenticator.js'

const router = express.Router()

router.post(
  '/add_content',
  validate(validator.ContentSchema, { body: true }),
  authenticator(),
  add_content,
)

router.get(
  '/get_content_information',
  validate(validator.ContentMetadataSchema, { query: true }),
  get_content_information,
)

router.get(
  '/get_content_description',
  validate(validator.ContentIdSchema, { query: true }),
  get_content_description,
)

router.post(
  '/edit_content',
  validate(validator.ContentSchema, { body: true }),
  authenticator(),
  edit_content,
)

router.get(
  '/explore_content',
  validate(validator.ExploreFilterSchema, { query: true }),
  explore_content,
)

router.post(
  '/post_comment',
  validate(validator.CommentSchema, { body: true }),
  authenticator(),
  post_comment,
)

router.get(
  '/get_comments',
  validate(validator.ContentIdSchema, { query: true }),
  get_comments,
)

router.delete(
  '/remove_comment',
  // validate(validator.RemoveCommentSchema, { body: true }),
  authenticator(),
  delete_comment,
)

router.get(
  '/upvote_content',
  validate(validator.ContentIdSchema, { query: true }),
  authenticator(),
  upvote_content,
)

router.get(
  '/downvote_content',
  validate(validator.ContentIdSchema, { query: true }),
  authenticator(),
  downvote_content,
)

// router.get(
//   '/bounty_cid_list',
//   bounty_cid_list,
// )

// router.post(
//   '/report_cid',
//   validate(validator.CreateCollectionSchema, { body: true }),
//   authenticator(),
//   report_cid,
// )

// router.get(
//   '/add_website',
//   validate(validator.collectionIdSchema, { query: true }),
//   authenticator(),
//   add_website,
// )

// router.get(
//   '/submit_review',
//   validate(validator.collectionIdSchema, { query: true }),
//   authenticator(),
//   submit_review,
// )

export default router
