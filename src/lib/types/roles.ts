/* eslint-disable no-unused-vars */
import { Types } from 'mongoose'

export enum ERole {
  USER = 'USER',
  MEMBER_OF_CHURCH = 'MEMBER_OF_CHURCH',
  MEMBER_OF_MINISTRY = 'MEMBER_OF_MINISTRY',
  LEADER_OF_MINISTRY = 'LEADER_OF_MINISTRY',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export interface IRoleSchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  title: ERole
  users: Types.ObjectId[]
}

export interface IRoleReturnedDB {
  id: string
  _id?: Types.ObjectId
  title: ERole
  createdAt: string
  updatedAt: string
}

export type TRoles = { name: ERole, _id?: string }[]
