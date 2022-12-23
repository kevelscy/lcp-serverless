import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onNoMatch, onError } from 'lib/api-controllers/common'
import { getDevotionalById, updateDevotionalById, deleteDevotionalById } from 'lib/api-controllers/devotionals'

export const config = {
  api: { bodyParser: false }
}

const handler = nextConnect({ onNoMatch, onError })
  .get(getDevotionalById)
  .put(updateDevotionalById)
  .delete(deleteDevotionalById)

export default connectDB(handler)
