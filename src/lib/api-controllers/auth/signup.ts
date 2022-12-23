import { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcryptjs'

import { generateTokens } from 'lib/utils/generateTokens'
import { IUserToCreate } from 'lib/types/users'
import { UserModel } from 'lib/db/models/User'
import { RoleModel } from 'lib/db/models/Role'
import { ERole } from 'lib/types/roles'

import { config } from 'config'

const { HTTP: { STATUS_CODE } } = config

export const signUp = async (req: NextApiRequest, res: NextApiResponse) => {
  const { firstName, lastName, email, password } = req.body

  if (!email || !password) {
    return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
      .json({ data: null, error: 'FIELDS_REQUIRED' })
  }

  // const emailHashed = await hash(email, 10)
  const passwordHashed = await hash(password, 10)

  const roleUser = await RoleModel.findOne({ title: ERole.USER })

  if (!roleUser) {
    return res.status(STATUS_CODE.NOT_EXIST).json({
      data: null,
      error: 'ROLE_NOT_EXIST'
    })
  }

  const userToCreate: IUserToCreate = {
    firstName,
    lastName,
    email,
    password: passwordHashed,
    roles: roleUser.id || roleUser._id,
    phone: null,
    address: null,
    birthDate: null,
    profesion: null,
    picture: null,
    ministries: [],
    orders: [],
    isDeleted: false
  }

  const userCreated = await UserModel.create(userToCreate)
  const userPopulated = await userCreated.populate({ path: 'roles', select: 'title' })

  if (!userCreated) {
    return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE)
      .json({ data: null, error: 'CONFLICT_TO_CREATE_USER' })
  }

  // Sign In
  const { accessToken, refreshToken } = await generateTokens(userCreated)

  return res.status(200).json({
    data: {
      user: userPopulated,
      accessToken,
      refreshToken
    },
    error: null
  })
}
