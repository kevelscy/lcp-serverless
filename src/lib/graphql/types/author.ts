import { Types } from 'mongoose'

export interface IAuthorSchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  posts: Types.ObjectId[]
  devotionals: Types.ObjectId[]
  user: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
