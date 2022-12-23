import { Schema, model, models, Model } from 'mongoose'
import { IPostCategorySchema } from 'lib/types/posts'

const postCategorySchema = new Schema<IPostCategorySchema>({
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

postCategorySchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const PostCategoryModel: Model<IPostCategorySchema> = models.PostCategory || model<IPostCategorySchema>('PostCategory', postCategorySchema)
