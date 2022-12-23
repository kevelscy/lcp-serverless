import { Schema, model, models, Model } from 'mongoose'
import { IDevotionalSchema } from 'lib/types/posts'

const devotionalSchema = new Schema<IDevotionalSchema>({
  title: {
    type: String,
    required: true,
    maxlength: [150, 'title cannot be grater than 150 characters']
  },
  file: {
    publicId: {
      type: String,
      required: true,
      trim: true,
      maxlength: [250, 'file publicId cannot be grater than 250 characters']
    },
    url: {
      type: String,
      required: true,
      trim: true,
      maxlength: [250, 'file url cannot be grater than 250 characters']
    }
  },
  author: { type: Schema.Types.ObjectId, ref: 'Author' }
}, {
  timestamps: true,
  versionKey: false
})

devotionalSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const DevotionalModel: Model<IDevotionalSchema> = models.Devotional || model<IDevotionalSchema>('Devotional', devotionalSchema)
