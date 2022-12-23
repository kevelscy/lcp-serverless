import { Schema, model, models, Model } from 'mongoose'
import { IMinistrySchema } from 'lib/types/ministries'

const ministrySchema = new Schema<IMinistrySchema>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [150, 'title cannot be grater than 150 characters'],
    unique: true
  },
  label: {
    type: String,
    required: true,
    maxlength: [100, 'description cannot be grater than 100 characters']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [350, 'description cannot be grater than 350 characters']
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'slug cannot be grater than 200 characters'],
    unique: true
  },
  coverImage: {
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
  leader: { type: Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true,
  versionKey: false
})

ministrySchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const MinistryModel: Model<IMinistrySchema> = models.Ministry || model<IMinistrySchema>('Ministry', ministrySchema)
