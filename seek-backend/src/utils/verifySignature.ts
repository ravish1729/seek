import bs58 from 'bs58'
import { ethers } from 'ethers'
import nacl from 'tweetnacl'

export default (usersPublicKey: string, originalMessage: string, signedMessage: string, network: string): boolean => {
  try {
    if (network === 'evm') {
      const publicKeyToVerify = ethers.verifyMessage(originalMessage, signedMessage).toLowerCase()
      if (usersPublicKey.toLowerCase() === publicKeyToVerify) {
        return true
      }
      return false
    }
    const verified = nacl.sign.detached.verify(
      new TextEncoder().encode(originalMessage),
      bs58.decode(signedMessage),
      bs58.decode(usersPublicKey),
    )
    
    return verified
  } catch {
    return false
  }
}
