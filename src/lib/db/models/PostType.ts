import { Schema, model, models, Model } from 'mongoose'
import { IPostTypeSchema } from 'lib/types/posts'

const postTypeSchema = new Schema<IPostTypeSchema>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'title cannot be grater than 50 characters'],
    unique: true
  },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
}, {
  timestamps: true,
  versionKey: false
})

postTypeSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const PostTypeModel: Model<IPostTypeSchema> = models.PostType || model<IPostTypeSchema>('PostType', postTypeSchema)
