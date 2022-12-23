import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onError, onNoMatch } from 'lib/api-controllers/common'
import { deleteOrderById, getOrderById, updateOrderById } from 'lib/api-controllers/shop/orders'

const handler = nextConnect({ onNoMatch, onError })
  .get(getOrderById)
  .put(updateOrderById)
  .delete(deleteOrderById)

export default connectDB(handler)
