import { Types } from 'mongoose'

export interface IProductCategorySchema {
  id?: Types.ObjectId | string
  _id?: Types.ObjectId | string
  title: string
  slug: string
  description?: string
  products: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface IProductSchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  title: string
  price: number
  slug: string
  published: boolean
  image: {
    publicId: string
    url: string
    width: number
    height: number
  }
  description?: string
  category: IProductCategorySchema
  createdAt: Date
  updatedAt: Date
}

export type TOrderStatus = 'PENDING' | 'DISPATCHED'

export interface IOrderSchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  user: Types.ObjectId
  products: Types.ObjectId[]
  status: TOrderStatus
  createdAt: Date
  updatedAt: Date
}
