import { Schema, model, models, Model } from 'mongoose'
import { IRoleSchema } from 'lib/types/roles'

const roleSchema = new Schema<IRoleSchema>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Role title cannot be grater than 50 characters'],
    unique: true,
    enum: [
      'USER',
      'MEMBER_OF_CHURCH',
      'MEMBER_OF_MINISTRY',
      'LEADER_OF_MINISTRY',
      'MODERATOR',
      'ADMIN'
    ]
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true,
  versionKey: false
})

roleSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const RoleModel: Model<IRoleSchema> = models.Role || model<IRoleSchema>('Role', roleSchema)
