import { Schema, model, models, Model } from 'mongoose'
import { IProductCategorySchema } from 'lib/types/shop'

const productCategorySchema = new Schema<IProductCategorySchema>({
  title: {
    type: String,
    required: true,
    maxlength: [100, 'title cannot be grater than 100 characters']
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'slug cannot be grater than 200 characters'],
    unique: true
  },
  description: {
    type: String,
    required: false,
    maxlength: [350, 'description cannot be grater than 350 characters']
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, {
  timestamps: true,
  versionKey: false
})

productCategorySchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const ProductCategoryModel: Model<IProductCategorySchema> = models.ProductCategory || model<IProductCategorySchema>('ProductCategory', productCategorySchema)
