import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { getNewToken } from 'lib/api-controllers/auth/refreshToken'
import { onError, onNoMatch } from 'lib/api-controllers/common'

const handler = nextConnect({ onError, onNoMatch })
  .get(getNewToken)

export default connectDB(handler)
