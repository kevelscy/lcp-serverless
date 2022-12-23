/* eslint-disable n/handle-callback-err */
/* eslint-disable prefer-promise-reject-errors */
import { verify } from 'jsonwebtoken'

import { UserTokenModel } from 'lib/db/models/UserToken'
import { config } from 'config'

export const verifyRefreshToken = async (refreshToken: string): Promise<{ data: any, error: any }> => {
  const privateKey = config.JWT.REFRESH_SECRET

  const userTokenFinded = await UserTokenModel.findOne({ token: refreshToken })

  if (!userTokenFinded) return { data: null as null, error: 'TOKEN_NOT_EXIST' }

  return new Promise((resolve, reject) => {
    verify(refreshToken, privateKey, (err, tokenDetails) => {
      if (err) {
        return reject({
          data: null,
          error: `jwt verify error: ${err}`
        })
      }

      return resolve({ data: tokenDetails, error: null })
    })
  })
}
