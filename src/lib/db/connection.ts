import { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'

import type { THandler } from 'lib/types/api'
import { config } from 'config'

export const connectDB = (handler: THandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res)
  }

  mongoose.set('strictQuery', false)
  // Use new db connection
  await mongoose.connect(config.DB.URI)
  return handler(req, res)
}
