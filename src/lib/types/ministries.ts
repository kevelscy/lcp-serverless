/* eslint-disable no-unused-vars */
import { Types } from 'mongoose'
import { IUserSchema } from './users'

export enum MinistryName {
  DORADITOS = 'DORADITOS',
  JUNTA_DIRECTIVA = 'JUNTA_DIRECTIVA',
  ACCION_SOCIAL = 'ACCION_SOCIAL',
  ALABANZA = 'ALABANZA',
  DYC = 'DYC',
  DECORACION = 'DECORACION',
  DEPORTE = 'DEPORTE',
  DIACONADO = 'DIACONADO',
  DISCIPULADO = 'DISCIPULADO',
  EDUCACION_CRISTIANA = 'EDUCACION_CRISTIANA',
  EVANGELISMO = 'EVANGELISMO',
  FINANZAS = 'FINANZAS',
  GRUPOS_PEQUENOS = 'GRUPOS_PEQUENOS',
  INFANTIL = 'INFANTIL',
  INTERCESION = 'INTERCESION',
  JOVENES = 'JOVENES',
  MANTENIMIENTO = 'MANTENIMIENTO',
  PROTOCOLO = 'PROTOCOLO',
  EVENTOS_ESPECIALES = 'EVENTOS_ESPECIALES',
  MULTIMEDIA = 'MULTIMEDIA',
}

export interface IMinistrySchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  title: string
  label: string
  description?: string
  slug: string
  coverImage: {
    publicId: string
    url: string
    width: number
    height: number
  }
  leader: IUserSchema
  members: IUserSchema[]
  createdAt: Date
  updatedAt: Date
}
