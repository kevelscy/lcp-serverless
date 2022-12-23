import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { signIn } from 'lib/api-controllers/auth/signin'
import { onError, onNoMatch } from 'lib/api-controllers/common'

const handler = nextConnect({ onError, onNoMatch })
  .post(signIn)

export default connectDB(handler)
