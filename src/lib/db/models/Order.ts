import { Schema, model, models, Model } from 'mongoose'
import { IOrderSchema } from 'lib/types/shop'

const orderSchema = new Schema<IOrderSchema>({
  status: {
    type: String,
    default: 'PENDING',
    maxlength: [11, 'status cannot be grater than 11 characters'],
    enum: ['PENDING', 'DISPATCHED']
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  versionKey: false
})

orderSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const OrderModel: Model<IOrderSchema> = models.Order || model<IOrderSchema>('Order', orderSchema)
