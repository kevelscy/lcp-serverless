import { Schema, model, models, Model } from 'mongoose'
import { IUserToken } from 'lib/types/users'

const userTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 30 * 86400 } // 30 days
})

userTokenSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const UserTokenModel: Model<IUserToken> = models.UserToken || model<IUserToken>('UserToken', userTokenSchema)
