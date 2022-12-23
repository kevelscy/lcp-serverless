import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onNoMatch, onError } from 'lib/api-controllers/common'
import { getAuthorById, upgradeToAuthor, deleteAuthorById } from 'lib/api-controllers/authors'

const handler = nextConnect({ onNoMatch, onError })
  .get(getAuthorById)
  .put(upgradeToAuthor)
  .delete(deleteAuthorById)

export default connectDB(handler)
