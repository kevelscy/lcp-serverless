import { NextApiRequest, NextApiResponse } from 'next'
import { compare } from 'bcryptjs'

import { config } from 'config'
import { UserModel } from 'lib/db/models/User'
import 'lib/db/models/Role'
import { generateTokens } from 'lib/utils/generateTokens'

const { HTTP: { STATUS_CODE } } = config

export const signIn = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
      .json({ data: null, error: 'FIELDS_REQUIRED' })
  }

  const userFounded = await UserModel.findOne({ email })

  if (!userFounded) {
    return res.status(config.HTTP.STATUS_CODE.INCORRECT_CREDENTIALS)
      .json({ data: null, error: 'INCORRECT_CREDENTIALS' })
  }

  const isVerified = await compare(password, userFounded.password)

  if (!isVerified) {

    return res.status(STATUS_CODE.INCORRECT_CREDENTIALS)
      .json({ data: null, error: 'INCORRECT_CREDENTIALS' })

  } else {

    const { accessToken, refreshToken } = await generateTokens(userFounded)
    const userPopulated = await userFounded.populate('roles')

    return res.status(200).json({
      data: {
        ...userPopulated.toJSON(),
        accessToken,
        refreshToken
      },
      error: null
    })
  }
}
