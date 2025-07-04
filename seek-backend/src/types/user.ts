export type User = {
  publicKey: string
  totalTags: number
  reported: number
  karma: number
  level: string
  createdAt: number
  updatedAt: number
}

export type APIKey = {
  keyID: string
  keyHash: string
  keyName: string
  userID: string
  userRole: string
  createdAt: number
  updatedAt: number
  lastUsed: number
}

export type JWTPayload = {
  userID: string
  restricted: boolean
}
