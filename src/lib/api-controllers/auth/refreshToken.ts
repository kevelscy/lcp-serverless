import { NextApiRequest, NextApiResponse } from 'next'
import { sign } from 'jsonwebtoken'

import { config } from 'config'
import { verifyRefreshToken } from 'lib/utils/verifyRefreshToken'

const { HTTP: { STATUS_CODE } } = config

export const getNewToken = async (req: NextApiRequest, res: NextApiResponse) => {
  const clientRefreshToken = req.headers.authorization

  if (!clientRefreshToken) {
    return res.status(STATUS_CODE.REFRESH_TOKEN_REQUIRED).json({
      data: null,
      error: 'REFRESH_TOKEN_REQUIRED'
    })
  }

  const { data: tokenDetails, error } = await verifyRefreshToken(clientRefreshToken)

  if (error) {
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      data: null,
      error: 'SERVER_ERROR'
    })
  }

  const payload = { id: tokenDetails.id, roles: tokenDetails.roles }
  const accessToken = sign(payload, config.JWT.ACCESS_SECRET, { expiresIn: 6000 } /* 1m */)

  return res.status(200).json({
    data: accessToken,
    error: null
  })
}

// export const createToken = async (req: Request, res: Response) => {
//   const { id } = req.body

//   if (!id) {
//     return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
//       .json({ data: null, error: 'ID_FIELD_REQUIRED' })
//   }

//   // const token = sign(id, config.JWT.SECRET, { expiresIn: 60 })

//   return res.status(200).json({
//     data: 'token',
//     error: null
//   })
// }
