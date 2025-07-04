export enum ReviewResult {
  Correct = 'correct',
  Incorrect = 'incorrect'
}

export enum ReportedStatus {
  Spam = 'pending',
  Pornographic = 'approved',
  Phishing = 'phishing',
}

export enum TagStatus {
  Ongoing = 'ongoing',
  Completed = 'completed',
  NotStarted = 'not-started',
}

type Review = {
  reviewer: string
  result: ReviewResult
}

export type Tag = {
  publicKey: string
  cid: number
  tags: string[]
  review: Review[]
  flagged: ReportedStatus
  flaggedBy: string
  flagRewiew: ReviewResult
  searchCount: string
  status: TagStatus
  createdAt: number
  updatedAt: number
}
