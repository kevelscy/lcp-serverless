import { Types } from 'mongoose'

export interface IBannerSchema {
  id: Types.ObjectId
  title?: string
  image: {
    mobile: {
      publicId: string | null
      url: string | null
      height: number | null
      width: number | null
    }
    desktop: {
      publicId: string | null
      url: string | null
      height: number | null
      width: number | null
    }
  }
  createdAt: Date
  updatedAt: Date
}
