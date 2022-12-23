import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onError, onNoMatch } from 'lib/api-controllers/common'
import { getAllUsers, createUser } from 'lib/api-controllers/users'

export const config = {
  api: { bodyParser: false }
}

const handler = nextConnect({ onError, onNoMatch })
  .get(getAllUsers)
  .post(createUser)

export default connectDB(handler)
