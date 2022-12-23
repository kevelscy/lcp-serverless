import jwtDecode, { JwtPayload } from 'jwt-decode'

interface IDecodedToken extends JwtPayload {
  id: number
  isAdmin: boolean
  iat: number
}

interface IDecodedTokenReturn {
  isAdmin: boolean
  id: number
}

export const decodeAccessToken = (token: string): IDecodedTokenReturn => {
  const decodedToken = jwtDecode<IDecodedToken>(token)

  return { id: decodedToken.id, isAdmin: decodedToken.isAdmin }
}
