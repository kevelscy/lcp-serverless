import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onError, onNoMatch } from 'lib/api-controllers/common'
import { getAllRoles } from 'lib/api-controllers/roles'

export const config = {
  api: { bodyParser: false }
}

const handler = nextConnect({ onError, onNoMatch })
  .get(getAllRoles)

export default connectDB(handler)
