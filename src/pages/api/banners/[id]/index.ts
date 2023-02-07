import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onNoMatch, onError } from 'lib/api-controllers/common'
import { getBannerById, updateBannerById, deleteBannerById } from 'lib/api-controllers/banners'

const handler = nextConnect({ onNoMatch, onError })
  .get(getBannerById)
  .put(updateBannerById)
  .delete(deleteBannerById)

export default connectDB(handler)
