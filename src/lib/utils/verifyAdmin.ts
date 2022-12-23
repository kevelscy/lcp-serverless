import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export const verifyAdmin = (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(406).json({
      data: null,
      error: 'AUTHORIZATION_REQUIRED'
    })
  }

  const tokenDecoded = jwt.decode(token, { json: true })

  if (!tokenDecoded) {
    return res.status(405).json({
      data: null,
      error: 'ERROR_AUTHORIZATION'
    })
  }

  if (!tokenDecoded.isAdmin) {
    return res.status(403).json({
      data: null,
      error: 'USER_FORBIDDEN'
    })

  }

  return tokenDecoded.isAdmin 
}
