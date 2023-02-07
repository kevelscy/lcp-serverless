import jwt from 'jsonwebtoken'

import { IUserSchema } from 'lib/types/users'
import { UserTokenModel } from 'lib/db/models/UserToken'

import { config } from 'config'

export const generateTokens = async (user: IUserSchema) => {
  try {
    const payload = { id: user.id, roles: user.roles }
    const accessToken = jwt.sign(
      payload,
      config.JWT.ACCESS_SECRET,
      { expiresIn: 60000 } // 1m
    )

    const refreshToken = jwt.sign(
      payload,
      config.JWT.REFRESH_SECRET,
      { expiresIn: 18_000_000 }
    )

    const userToken = await UserTokenModel.findOne({ userId: user.id })
    if (userToken) await userToken.remove()

    await new UserTokenModel({ userId: user.id, token: refreshToken }).save()

    return Promise.resolve({ accessToken, refreshToken })
  } catch (err) {
    return Promise.reject(err)
  }
}
