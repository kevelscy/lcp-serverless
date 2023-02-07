import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onError, onNoMatch } from 'lib/api-controllers/common'
import { uploadImageOfBannerById } from 'lib/api-controllers/banners'

export const config = {
  api: { bodyParser: false}
}

const handler = nextConnect({ onError, onNoMatch })
  .put(uploadImageOfBannerById)

export default connectDB(handler)
