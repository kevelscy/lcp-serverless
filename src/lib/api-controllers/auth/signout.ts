import { NextApiRequest, NextApiResponse } from 'next'

import { config } from 'config'
import { UserTokenModel } from 'lib/db/models/UserToken'

const { HTTP: { STATUS_CODE } } = config

export const signOut = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const authHeader = req.headers.authorization
    const accessToken = authHeader && authHeader.split(' ')[1]

    if (!accessToken) {
      return res.status(STATUS_CODE.REFRESH_TOKEN_REQUIRED).json({
        data: null,
        error: 'REFRESH_TOKEN_REQUIRED'
      })
    }

    const userToken = await UserTokenModel.findOne({ token: accessToken })

    if (!userToken) {
      return res.status(200).json({
        data: 'LOGGED_OUT',
        error: null
      })
    }

    await userToken.remove()
    return res.status(200).json({
      data: 'LOGGED_OUT',
      error: null
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ data: null, error: 'Internal Server Error' })
  }
}
