import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onError, onNoMatch } from 'lib/api-controllers/common'
import { getAllProductCategories, createProductCategory } from 'lib/api-controllers/shop/productCategories'

const handler = nextConnect({ onError, onNoMatch })
  .get(getAllProductCategories)
  .post(createProductCategory)

export default connectDB(handler)
