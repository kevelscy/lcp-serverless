import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onError, onNoMatch } from 'lib/api-controllers/common'
import { createOrder, getAllOrders } from 'lib/api-controllers/shop/orders'

const handler = nextConnect({ onError, onNoMatch })
  .get(getAllOrders)
  .post(createOrder)

export default connectDB(handler)
