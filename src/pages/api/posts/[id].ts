import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onNoMatch, onError } from 'lib/api-controllers/common'
import { getRoleById, upgradeUserRole, removeUserRole } from 'lib/api-controllers/roles'

export const config = {
  api: { bodyParser: false }
}

const handler = nextConnect({ onNoMatch, onError })
  .get(getRoleById)
  .put(upgradeUserRole)
  .delete(removeUserRole)

export default connectDB(handler)
