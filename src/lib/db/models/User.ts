import { Schema, model, models, Model } from 'mongoose'
import { IUserSchema } from 'lib/types/users'

const userSchema = new Schema<IUserSchema>({
  email: {
    type: String,
    required: true,
    maxlength: [60, 'email cannot be grater than 60 characters'],
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  birthDate: {
    type: String,
    required: false,
    maxlength: [50, 'birthDate cannot be grater than 50 characters']
  },
  profesion: {
    type: String,
    required: false,
    maxlength: [150, 'profesion cannot be grater than 150 characters']
  },
  picture: {
    required: false,
    publicId: {
      type: String,
      maxlength: [250, 'image publicId cannot be grater than 250 characters'],
      default: null
    },
    url: {
      type: String,
      trim: true,
      maxlength: [250, 'image url cannot be grater than 250 characters'],
      default: null
    },
    width: {
      type: Number,
      maxlength: [5, 'image width cannot be grater than 5 characters'],
      default: null
    },
    height: {
      type: Number,
      maxlength: [5, 'image height cannot be grater than 5 characters'],
      default: null
    }
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  },
  phone: {
    type: String,
    required: false,
    maxlength: [50, 'phone cannot be grater than 50 characters']
    // unique: true,
    // index: true,
    // sparse: true
  },
  firstName: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'firstName cannot be grater than 100 characters']
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'lastName cannot be grater than 100 characters']
  },
  address: {
    type: String,
    required: false,
    trim: true,
    maxlength: [300, 'address cannot be grater than 300 characters']
  },
  ministries: [{ type: Schema.Types.ObjectId, ref: 'Ministry', required: false }],
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role', required: true }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order', required: false }]
}, {
  timestamps: true,
  versionKey: false
})

userSchema.methods.userExistByPhone = function (phone: string) {
  return this.model('User').find({ phone })
}

userSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const UserModel: Model<IUserSchema> = models.User || model<IUserSchema>('User', userSchema)
