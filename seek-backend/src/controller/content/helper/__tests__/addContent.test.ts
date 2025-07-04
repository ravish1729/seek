import { addContent, create_tag } from '../addContent.js'
import { getTagByName } from '../../../../db/sqlite/tag/getTagByName.js'
import { createTag } from '../../../../db/sqlite/tag/createTag.js'
import { createContent } from '../../../../db/sqlite/content/createContent.js'
import { addContentDescription } from '../../../../db/sqlite/content/addContentDescription.js'
import { tagContent } from '../../../../db/sqlite/tag/tagContent.js'
import { hashInfo } from '../../../../db/sqlite/content/hashInfo.js'
import { uploadThumbnailToIPFS, uploadContentJSONToIPFS } from '../../../../utils/ipfs.js'

// Mock all the imported functions
jest.mock('../../../../db/sqlite/tag/getTagByName')
jest.mock('../../../../db/sqlite/tag/createTag')
jest.mock('../../../../db/sqlite/content/createContent')
jest.mock('../../../../db/sqlite/content/addContentDescription')
jest.mock('../../../../db/sqlite/tag/tagContent')
jest.mock('../../../../db/sqlite/content/hashInfo')
jest.mock('../../../../utils/ipfs.js')

describe('create_tag', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return existing tag id if tag exists', async () => {
    const mockTag = { id: '123', name: 'test-tag' }
    ;(getTagByName as jest.Mock).mockResolvedValue(mockTag)

    const result = await create_tag('test-tag')
    expect(result).toBe('123')
    expect(getTagByName).toHaveBeenCalledWith('test-tag')
    expect(createTag).not.toHaveBeenCalled()
  })

  it('should create new tag if tag does not exist', async () => {
    ;(getTagByName as jest.Mock).mockResolvedValue(null)
    ;(createTag as jest.Mock).mockResolvedValue('456')

    const result = await create_tag('new-tag')
    expect(result).toBe('456')
    expect(getTagByName).toHaveBeenCalledWith('new-tag')
    expect(createTag).toHaveBeenCalledWith('new-tag')
  })
})

describe('addContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockData = {
    hash: 'test-hash',
    user: { userId: 'user123' },
    fileSize: 1000,
    network: 'test-net',
    title: 'Test Content',
    fileType: 'image/jpeg',
    fileCategory: 'image',
    description: 'test description',
    tags: ['tag1', 'tag2'],
    thumbnail: 'base64-encoded-thumbnail',
    license: 'MIT'
  }

  it('should throw error if content with hash already exists', async () => {
    ;(hashInfo as jest.Mock).mockResolvedValue({ id: 'existing-content' })

    await expect(addContent(mockData)).rejects.toThrow('Content with this hash already exists')
    expect(createContent).not.toHaveBeenCalled()
  })

  it('should successfully add content with thumbnail', async () => {
    ;(hashInfo as jest.Mock).mockResolvedValue(null)
    ;(createContent as jest.Mock).mockResolvedValue('content123')
    jest.spyOn(require('../addContent'), 'create_tag').mockImplementation(async (tag) => `${tag}-id`)
    ;(uploadThumbnailToIPFS as jest.Mock).mockResolvedValue('QmThumbnailCID')
    ;(uploadContentJSONToIPFS as jest.Mock).mockResolvedValue('QmMetadataCID')

    const result = await addContent(mockData)

    expect(result).toBe('Content added successfully')
    expect(uploadThumbnailToIPFS).toHaveBeenCalledWith('base64-encoded-thumbnail')
    expect(uploadContentJSONToIPFS).toHaveBeenCalledWith(expect.objectContaining({
      hash: 'test-hash',
      title: 'Test Content',
      thumbnail: 'QmThumbnailCID'
    }))
    expect(createContent).toHaveBeenCalledWith(
      'user123',
      'test-hash',
      1000,
      'test-net',
      'QmMetadataCID',
      'QmThumbnailCID',
      'Test Content',
      'image/jpeg',
      'image'
    )
    expect(addContentDescription).toHaveBeenCalledWith('content123', 'test description')
    expect(tagContent).toHaveBeenCalledTimes(2)
  })

  it('should successfully add content without thumbnail', async () => {
    const dataWithoutThumbnail = { ...mockData, thumbnail: null }
    ;(hashInfo as jest.Mock).mockResolvedValue(null)
    ;(createContent as jest.Mock).mockResolvedValue('content123')
    jest.spyOn(require('../addContent'), 'create_tag').mockImplementation(async (tag) => `${tag}-id`)
    ;(uploadContentJSONToIPFS as jest.Mock).mockResolvedValue('QmMetadataCID')

    const result = await addContent(dataWithoutThumbnail)

    expect(result).toBe('Content added successfully')
    expect(uploadThumbnailToIPFS).not.toHaveBeenCalled()
    expect(uploadContentJSONToIPFS).toHaveBeenCalledWith(expect.objectContaining({
      hash: 'test-hash',
      title: 'Test Content',
      thumbnail: null
    }))
    expect(createContent).toHaveBeenCalledWith(
      'user123',
      'test-hash',
      1000,
      'test-net',
      'QmMetadataCID',
      null,
      'Test Content',
      'image/jpeg',
      'image'
    )
  })
})
