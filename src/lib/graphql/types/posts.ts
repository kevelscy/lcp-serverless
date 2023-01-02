/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { Types } from 'mongoose'
import { IUserSchema } from './users'

export enum EPostType {
  ESPIRITU = 'ESPIRITU',
  ALMA = 'ALMA',
  CUERPO = 'CUERPO'
}

export enum EPostCategory {
  NUTRICION = 'NUTRICION',
  PSICOLOGIA = 'PSICOLOGIA',
  REFLEXIONES = 'REFLEXIONES',
  DEPORTES = 'DEPORTES'
}

export interface IPostTypeSchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  title: EPostType
  posts: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface IPostCategorySchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  title: EPostCategory
  posts: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface IDevotionalSchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  title: string
  author: Types.ObjectId
  file: {
    publicId: string
    url: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface IPostSchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  slug: string
  image: {
    publicId: string
    url: string
    width: number
    height: number
  }
  title: string
  content: string
  author: IAuthorSchema
  type: EPostType
  category: EPostCategory
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IAuthorSchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  posts: IPostSchema[]
  devotionals: IDevotionalSchema[]
  user: IUserSchema
  createdAt: Date
  updatedAt: Date
}
