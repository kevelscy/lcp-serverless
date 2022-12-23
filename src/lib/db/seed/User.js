const { Schema, model, models } = require('mongoose')

const userSchema = new Schema({
  phone: {
    type: String,
    required: true,
    maxlength: [30, 'phone cannot be grater than 30 characters'],
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'name cannot be grater than 100 characters']
  },
  lastname: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'lastname cannot be grater than 100 characters']
  },
  address: {
    type: String,
    required: false,
    trim: true,
    maxlength: [300, 'lastname cannot be grater than 300 characters']
  },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
}, {
  timestamps: true,
  versionKey: false
})

userSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = models.User || model('User', userSchema)
