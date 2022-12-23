import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onError, onNoMatch } from 'lib/api-controllers/common'
import { getAllProducts, createProduct } from 'lib/api-controllers/shop/products'

export const config = {
  api: { bodyParser: false }
}

const handler = nextConnect({ onError, onNoMatch })
  .get(getAllProducts)
  .post(createProduct)

export default connectDB(handler)
