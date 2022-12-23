import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onNoMatch, onError } from 'lib/api-controllers/common'
import { getProductById, updateProductById, deleteProductById } from 'lib/api-controllers/shop/products'

export const config = {
  api: { bodyParser: false }
}

const handler = nextConnect({ onNoMatch, onError })
  .get(getProductById)
  .put(updateProductById)
  .delete(deleteProductById)

export default connectDB(handler)
