import joi from 'joi'

export const ContentSchema = joi.object({
  hash: joi.string().max(1000).custom((value, helpers) => {
    // IPFS CIDv0 starts with "Qm" and is 46 characters long
    // IPFS CIDv1 starts with "b" and is base32 encoded
    const ipfsCidPattern = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58,})$/;
    
    // Common hash patterns (MD5, SHA-1, SHA-256, etc.)
    const hashPattern = /^[A-Fa-f0-9]{32,128}$/;

    if (!ipfsCidPattern.test(value) && !hashPattern.test(value)) {
      return helpers.error('string.pattern.base', { value });
    }
    return value;
  }).required(),
  title: joi.string().max(100).required(),
  fileSize: joi.string().max(100).allow(null, '').empty('').default(null),
  network: joi.string().max(100).allow(null, '').empty('').default(null),
  thumbnail: joi.string().max(4000000).allow(null, '').empty('').default(null),
  description: joi.string().max(1000).allow(null, '').empty('').default(null),
  fileType: joi.string().max(100).allow(null, '').empty('').default(null),
  fileCategory: joi.string().max(100).allow(null, '').empty('').default(null),
  tags: joi.array().items(joi.string()).min(1).max(5).required(),
})

export const ExploreFilterSchema = joi.object({
  by: joi.string().max(100).default('popularity'),
})

export const CommentSchema = joi.object({
  content_id: joi.number().required(),
  comment: joi.string().max(1000).required(),
})

export const RemoveCommentSchema = joi.object({
  comment_id: joi.number().integer().positive().required(),
})

export const ContentIdSchema = joi.object({
  content_id: joi.string().max(100).required(),
})

export const ContentMetadataSchema = joi.object({
  metadata_cid: joi.string().max(100).required(),
})
