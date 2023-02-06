import { Schema, model, models, Model } from 'mongoose'
import { IBannerSchema } from 'lib/types/banner'

const bannerSchema = new Schema<IBannerSchema>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [150, 'title cannot be grater than 150 characters'],
    unique: true
  },
  image: {
    mobile: {
      publicId: {
        type: String,
        required: true,
        maxlength: [250, 'image publicId cannot be grater than 250 characters']
      },
      url: {
        type: String,
        required: true,
        trim: true,
        maxlength: [250, 'image url cannot be grater than 250 characters']
      },
      width: {
        type: Number,
        required: true,
        maxlength: [5, 'image width cannot be grater than 5 characters']
      },
      height: {
        type: Number,
        required: true,
        maxlength: [5, 'image height cannot be grater than 5 characters']
      }
    },
    desktop: {
      publicId: {
        type: String,
        required: true,
        maxlength: [250, 'image publicId cannot be grater than 250 characters']
      },
      url: {
        type: String,
        required: true,
        trim: true,
        maxlength: [250, 'image url cannot be grater than 250 characters']
      },
      width: {
        type: Number,
        required: true,
        maxlength: [5, 'image width cannot be grater than 5 characters']
      },
      height: {
        type: Number,
        required: true,
        maxlength: [5, 'image height cannot be grater than 5 characters']
      }
    }
  }
}, {
  timestamps: true,
  versionKey: false
})

bannerSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const BannerModel: Model<IBannerSchema> = models.Banner || model<IBannerSchema>('Banner', bannerSchema)
