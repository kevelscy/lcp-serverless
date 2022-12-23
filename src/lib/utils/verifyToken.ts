import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export const verifyToken = (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(406).json({
      data: null,
      error: 'AUTHORIZATION_REQUIRED'
    })
  }

  let tokenVerified = false

  if (!token) { tokenVerified = false }

  const tokenVerify = jwt.verify(token, process.env.JWT_KEY_SECRET, (err, user) => {
    if (err) {
      tokenVerified = null

      return res.status(405).json({
        data: null,
        error: 'TOKEN_EXPIRED'
      })
    }

    tokenVerified = true
    return true
  })

  console.log('tokenVerify', tokenVerify)

  return tokenVerified
}
