// @ts-nocheck
import { v2 as cloudinary } from 'cloudinary'
import { config } from './index'

cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUD_NAME,
  api_key: config.CLOUDINARY.API_KEY,
  api_secret: config.CLOUDINARY.API_SECRET,
  secure: true
})

export { cloudinary }
