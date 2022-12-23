import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { getAuthMe } from 'lib/api-controllers/auth/me'
import { onError, onNoMatch } from 'lib/api-controllers/common'

const handler = nextConnect({ onError, onNoMatch })
  .get(getAuthMe)

export default connectDB(handler)
