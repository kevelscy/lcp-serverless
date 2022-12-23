const { Schema, model, models } = require('mongoose')

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [30, 'description cannot be grater than 30 characters'],
    unique: true
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

module.exports = models.Role || model('Role', roleSchema)
