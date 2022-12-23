import type { Types } from 'mongoose'
import { IOrderSchema } from './shop'

export interface IUserSchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  roles: Types.ObjectId[]
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  address?: string
  birthDate?: string
  profesion?: string
  picture?: {
    publicId: string
    url: string
    width: number
    height: number
  }
  ministries?: string[]
  orders: IOrderSchema[]
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IUserToSignUp {
  email: string
  password: string
  lastName: string
  firstName: string
}

export interface IUserToCreate extends IUserToSignUp {
  phone: null
  address: null
  birthDate: null
  profesion: null
  picture: null
  ministries: []
  orders: []
  isDeleted: boolean
  roles: Types.ObjectId[]
}

export interface IUserToSignIn {
  email: string
  password: string
}

export interface IUserToken {
  userId: Types.ObjectId
  token: string
  createdAt: Date
}
