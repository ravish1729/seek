import { messageString } from '../../../config/constants.js'
import { setExCache, getCache, removeCache } from '../../../db/connect/redisConn.js'
import getNetwork from '../../../middlewares/getNetwork.js'
import verifySignature from '../../../utils/verifySignature.js'
import CustomError from '../../../middlewares/error/customError.js'
import { getAccessToken } from './jwt.js'
import { AccessToken } from '../../../types/accessToken.js'
import { getUserByPublicKey } from '../../../db/sqlite/user/getUserByPublicKey.js'
import { createUser } from '../../../db/sqlite/user/createUser.js'
import jwt from 'jsonwebtoken'
import config from '../../../config/index.js'

export const getMessage = async (publicKey: string): Promise<string> => {
  const timestamp = Date.now()
  const message = messageString + timestamp

  const network = getNetwork(publicKey)
  if (network === 'evm') {
    publicKey = publicKey.trim().toLowerCase()
  }
  setExCache(`message-${publicKey}`, 300, timestamp)

  const user = await getUserByPublicKey(publicKey) as { id: number } | null
  if(!user) {
    const saved = await createUser(publicKey)
  }
  return message
}

export const verifyUserSignature = async(publicKey: string, signature: string): Promise<AccessToken> => {
  const network = getNetwork(publicKey)
  network === 'evm' ? (publicKey = publicKey.trim().toLowerCase()) : publicKey = publicKey.trim()
  const message = await getCache(`message-${publicKey}`)
  console.log(message)
  const authentic = verifySignature(publicKey.trim(), messageString + message, signature, network)
  console.log(authentic)
  if (!authentic) {
    throw new CustomError(401, 'Authentication Failed.')
  }
  removeCache(`message-${publicKey}`)
  const user = await getUserByPublicKey(publicKey) as { id: number } | null
  console.log(user)
  if (!user) {
    throw new CustomError(404, 'User not found.')
  }
  return getAccessToken(publicKey, user.id)
}
