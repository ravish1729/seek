import { getTagByName } from '../../../db/sqlite/tag/getTagByName.js'
import { createTag } from '../../../db/sqlite/tag/createTag.js'
import { removeTags } from '../../../db/sqlite/tag/removeTags.js'
import { createContent } from '../../../db/sqlite/content/createContent.js'
import { updateContent } from '../../../db/sqlite/content/updateContent.js'
import { addContentDescription } from '../../../db/sqlite/content/addContentDescription.js'
import { tagContent } from '../../../db/sqlite/tag/tagContent.js'
import { hashInfo } from '../../../db/sqlite/content/hashInfo.js'
import { uploadThumbnailToIPFS, uploadContentJSONToIPFS } from '../../../utils/ipfs.js'

export const create_tag = async (tag: string) => {
  try {
    // check if tag already exists
    const tagExists = await getTagByName(tag) as { id: number } | undefined
    if (tagExists) {
      return tagExists.id
    }
    const tagId = await createTag(tag)
    return tagId
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const addContent = async (data: any): Promise<string> => {  
  const existingContent = await hashInfo(data.hash)
  if (existingContent) {
    throw new Error('Content with this hash already exists')
  }

  let thumbnailCID = null
  if(data.thumbnail){
    // Add thumbnail to ipfs
    thumbnailCID = await uploadThumbnailToIPFS(data.thumbnail)
  }
  const contentJSON = {
    hash: data.hash,
    title: data.title,
    fileType: data.fileType,
    fileCategory: data.fileCategory,
    fileSize: data.fileSize,
    thumbnail: thumbnailCID,
    network: data.network,
    license: data.license,
    description: data.description
  }
  console.log(contentJSON)
  const metadataCID = await uploadContentJSONToIPFS(contentJSON)
  console.log(metadataCID)
  const contentId = await createContent(data.user.userId, data.hash, data.fileSize, data.network, metadataCID, thumbnailCID, data.title, data.fileType, data.fileCategory)
  await addContentDescription(contentId, data.description)
  const tags = data.tags as string[]
  for(const tag of tags){
    const tagId = await create_tag(tag)
    await tagContent(contentId, tagId)
  }
  return 'Content added successfully'
}

export const editContent = async (data: any): Promise<string> => {
  const existingContent = await hashInfo(data.hash) as { id: number; user_id: number; thumbnail: string } | null
  console.log(existingContent)
  console.log(data)
  
  if (!existingContent) {
    throw new Error('Content not found')
  }
  
  if(existingContent.user_id !== data.user.userId) {
    throw new Error('Forbidden')
  }

  let thumbnailCID = existingContent.thumbnail
  if(data.thumbnail){
    // Upload new thumbnail to IPFS
    thumbnailCID = await uploadThumbnailToIPFS(data.thumbnail)
  }
  await updateContent(existingContent.id, data.fileSize, data.net, thumbnailCID)
  await addContentDescription(existingContent.id, data.description)
  const tags = data.tags as string[]
  await removeTags(existingContent.id)
  for(const tag of tags){
    const tagId = await create_tag(tag)
    await tagContent(existingContent.id, tagId)
  }
  return 'Content added successfully'
}
