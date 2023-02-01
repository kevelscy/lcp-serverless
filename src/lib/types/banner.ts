import { Types } from 'mongoose'

export interface IBannerSchema {
  id: Types.ObjectId
  title?: string
  type: 'MOBILE' | 'DESKTOP'
  image: {
    publicId: string
    url: string
    height: number
    width: number
  }
  createdAt: Date
  updatedAt: Date
}
