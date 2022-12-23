import { Schema, model, models, Model } from 'mongoose'
import { IProductSchema } from 'lib/types/shop'

const productSchema = new Schema<IProductSchema>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'title cannot be grater than 100 characters']
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'slug cannot be grater than 200 characters'],
    unique: true
  },
  price: {
    type: Number,
    required: true,
    maxlength: [4, 'price cannot be grater than 4 characters']
  },
  published: {
    type: Boolean,
    default: false
  },
  image: {
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
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [350, 'description cannot be grater than 350 characters']
  },
  category: { type: Schema.Types.ObjectId, ref: 'ProductCategory' }
}, {
  timestamps: true,
  versionKey: false
})

productSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const ProductModel: Model<IProductSchema> = models.Product || model<IProductSchema>('Product', productSchema)
