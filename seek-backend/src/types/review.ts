export type Collection = {
  collectionID: string
  userID: string
  collectionName: string
  contractAddress: string
  chainID: string
  blockchainNet: string
  tokenCount: number
  createdAt: number
  updatedAt: number
}

export type Token = {
  id: string
  tokenID: string
  cid: string
  fileSize: number
  dealStatus: string
  collectionID: string
  userID: string
  createdAt: number
  updatedAt: number
}

export type TokenObject = {
  tokenID: string
  cid: string
}
