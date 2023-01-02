import { GraphQLError } from 'graphql'
import { compare } from 'bcryptjs'

import { UserModel } from 'lib/db/models/User'
import 'lib/db/models/Role'

import { generateTokens } from 'lib/utils/generateTokens'

export const signIn = async (_, { email, password }: { email: string, password: string }) => {
  try {

    if (!email || !password) {
      console.log('FIELDS_REQUIRED')

      return new GraphQLError('SIGN_IN_ERROR: FIELDS_REQUIRED', {
        extensions: {
          code: 'FIELDS_REQUIRED',
          http: { status: 400 }
        }
      })
    }
  
    const userFounded = await UserModel.findOne({ email })
  
    if (!userFounded) {
      console.log('INCORRECT_CREDENTIALS email incorrect')

      return new GraphQLError('SIGN_IN_ERROR: INCORRECT_CREDENTIALS', {
        extensions: {
          code: 'INCORRECT_CREDENTIALS',
          http: { status: 401 }
        }
      })
    }
  
    const isVerified = await compare(password, userFounded.password)
  
    if (!isVerified) {
      console.log('INCORRECT_CREDENTIALS password incorrect')

      return new GraphQLError('SIGN_IN_ERROR: INCORRECT_CREDENTIALS', {
        extensions: {
          code: 'INCORRECT_CREDENTIALS',
          http: { status: 401 } 
        }
      })
    } else {
  
      const { accessToken, refreshToken } = await generateTokens(userFounded)
      const userPopulated = await userFounded.populate('roles')
  
      return { ...userPopulated.toJSON(), accessToken, refreshToken }
    }

  } catch (err) {

    console.error('signIn Error', err)

    return new GraphQLError('SIGN_IN_ERROR: SERVER_ERROR', {
      extensions: {
        code: 'SERVER_ERROR',
        http: { status: 500 }
      }
    })

  }
}