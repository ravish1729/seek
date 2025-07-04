import axios from 'axios'
import FormData from 'form-data'
import config from '../config/index.js'

export const uploadToIPFS = async (data: Buffer | string, filename?: string): Promise<string> => {
  try {
    const formData = new FormData()
    
    if (typeof data === 'string') {
      // If data is a string, treat it as JSON content
      const buffer = Buffer.from(data, 'utf-8')
      formData.append('file', buffer, {
        filename: filename || 'content.json',
        contentType: 'application/json'
      })
    } else {
      // If data is already a Buffer
      formData.append('file', data, {
        filename: filename || 'file',
        contentType: 'application/octet-stream'
      })
    }

    const response = await axios.post(config.ipfs_api_url, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000, // 30 second timeout
    })

    if (response.data && response.data.Hash) {
      return response.data.Hash
    } else {
      throw new Error('Invalid response from IPFS API')
    }
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw new Error(`Failed to upload to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const uploadThumbnailToIPFS = async (thumbnailData: string): Promise<string> => {
  try {
    // Convert base64 string to buffer
    const buffer = Buffer.from(thumbnailData, 'base64')
    return await uploadToIPFS(buffer, 'thumbnail.jpg')
  } catch (error) {
    console.error('Error uploading thumbnail to IPFS:', error)
    throw error
  }
}

export const uploadContentJSONToIPFS = async (contentJSON: any): Promise<string> => {
  try {
    const jsonString = JSON.stringify(contentJSON, null, 2)
    return await uploadToIPFS(jsonString, 'content.json')
  } catch (error) {
    console.error('Error uploading content JSON to IPFS:', error)
    throw error
  }
} 