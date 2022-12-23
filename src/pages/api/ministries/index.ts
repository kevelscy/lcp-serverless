import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onError, onNoMatch } from 'lib/api-controllers/common'
import { getAllMinistries, createMinistry } from 'lib/api-controllers/ministries'

const handler = nextConnect({ onError, onNoMatch })
  .get(getAllMinistries)
  .post(createMinistry)

export default connectDB(handler)
