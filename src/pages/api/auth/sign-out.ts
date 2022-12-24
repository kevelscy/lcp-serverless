import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { signOut } from 'lib/api-controllers/auth/signout'
import { onError, onNoMatch } from 'lib/api-controllers/common'

const handler = nextConnect({ onError, onNoMatch })
  .post(signOut)

export default connectDB(handler)
