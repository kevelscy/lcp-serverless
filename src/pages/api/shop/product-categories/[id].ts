import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onNoMatch, onError } from 'lib/api-controllers/common'
import { getProductCategoryById, updateProductCategoryById, deleteProductCategoryById } from 'lib/api-controllers/shop/productCategories'

const handler = nextConnect({ onNoMatch, onError })
  .get(getProductCategoryById)
  .put(updateProductCategoryById)
  .delete(deleteProductCategoryById)

export default connectDB(handler)
