import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { getAuthors } from 'lib/api-controllers/authors'
import { onError, onNoMatch } from 'lib/api-controllers/common'

const handler = nextConnect({ onError, onNoMatch })
  .get(getAuthors)

export default connectDB(handler)
