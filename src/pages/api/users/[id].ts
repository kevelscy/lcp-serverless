import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onNoMatch, onError } from 'lib/api-controllers/common'
import { getUserById, updateUserById, deleteUserById } from 'lib/api-controllers/users'

export const config = {
  api: { bodyParser: false }
}

const handler = nextConnect({ onNoMatch, onError })
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById)

export default connectDB(handler)
