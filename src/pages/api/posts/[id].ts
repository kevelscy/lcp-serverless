import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onNoMatch, onError } from 'lib/api-controllers/common'
import { getPostById, updatePostById, deletePostById } from 'lib/api-controllers/posts'

export const config = {
  api: { bodyParser: false }
}

const handler = nextConnect({ onNoMatch, onError })
  .get(getPostById)
  .put(updatePostById)
  .delete(deletePostById)

export default connectDB(handler)
