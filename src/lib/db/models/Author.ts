import { Schema, model, models, Model } from 'mongoose'
import { IAuthorSchema } from 'lib/types/author'

const authorSchema = new Schema<IAuthorSchema>({
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  devotionals: [{ type: Schema.Types.ObjectId, ref: 'Devotional' }],
  user: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  versionKey: false
})

authorSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const AuthorModel: Model<IAuthorSchema> = models.Author || model<IAuthorSchema>('Author', authorSchema)
