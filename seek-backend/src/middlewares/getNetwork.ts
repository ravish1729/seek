import { ethers } from 'ethers'
import { PublicKey } from '@solana/web3.js'
import CustomError from './error/customError.js'

export default (value: string) => {
  try {
    if (ethers.isAddress(value?.toLowerCase())) {
      return 'evm'
    }

    const pub = new PublicKey(value)
    if (PublicKey.isOnCurve(pub)) {
      return 'solana'
    }

    throw new CustomError(400, 'Invalid Address')
  } catch (error) {
    throw new CustomError(400, 'Invalid Address')
  }
}
