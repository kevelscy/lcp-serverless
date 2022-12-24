import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { signUp } from 'lib/api-controllers/auth/signup'
import { onError, onNoMatch } from 'lib/api-controllers/common'

const handler = nextConnect({ onError, onNoMatch })
  .post(signUp)

export default connectDB(handler)
