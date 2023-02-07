import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

import { config } from 'config'
import { UserModel } from 'lib/db/models/User'
import 'lib/db/models/Role'

const { JWT, HTTP: { STATUS_CODE } } = config

interface IUserAuthVerified {
  id: string
  roles: string[]
  iat: number
  exp: number
}

export const getAuthMe = async (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization
  const accessToken = authHeader && authHeader.split(' ')[1]

  if (!accessToken) {
    return res.status(406).json({
      data: null,
      error: 'AUTHORIZATION_REQUIRED'
    })
  }

  jwt.verify(accessToken, JWT.ACCESS_SECRET, async (err, user: IUserAuthVerified) => {
    if (err) {
      return res.status(403).json({
        data: null,
        error: 'TOKEN_NOT_VALIDATED'
      })
    }

    const userFounded = await UserModel.findById(user.id).populate('roles')

    if (!userFounded) {
      return res.status(STATUS_CODE.NOT_FOUND).json({
        data: null,
        error: 'USER_NOT_FOUND'
      })
    }

    return res.status(200).json({
      data: userFounded,
      error: null
    })
  })
}
