import { Schema, model, models, Model } from 'mongoose'
import { IPostSchema } from 'lib/types/posts'

const postSchema = new Schema<IPostSchema>({
  title: {
    type: String,
    required: true,
    maxlength: [200, 'title cannot be grater than 200 characters']
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'slug cannot be grater than 200 characters'],
    unique: true
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
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['ESPIRITU', 'ALMA', 'CUERPO']
  },
  category: {
    type: String,
    required: true,
    enum: ['NUTRICION', 'PSICOLOGIA', 'REFLEXIONES', 'DEPORTES']
  },
  published: {
    type: Boolean,
    default: false
  },
  author: { type: Schema.Types.ObjectId, ref: 'Author' }
}, {
  timestamps: true,
  versionKey: false
})

postSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const PostModel: Model<IPostSchema> = models.Post || model<IPostSchema>('Post', postSchema)
