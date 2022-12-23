import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onError, onNoMatch } from 'lib/api-controllers/common'
import { getAllDevotionals, createDevotional } from 'lib/api-controllers/devotionals'

export const config = {
  api: { bodyParser: false }
}

const handler = nextConnect({ onError, onNoMatch })
  .get(getAllDevotionals)
  .post(createDevotional)

export default connectDB(handler)
