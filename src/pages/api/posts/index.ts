import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onError, onNoMatch } from 'lib/api-controllers/common'
import { getAllPosts, createPost } from 'lib/api-controllers/posts'

export const config = {
  api: { bodyParser: false }
}

const handler = nextConnect({ onError, onNoMatch })
  .get(getAllPosts)
  .post(createPost)

export default connectDB(handler)
