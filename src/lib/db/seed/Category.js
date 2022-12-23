const { Schema, model, models } = require('mongoose')

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'title cannot be grater than 100 characters'],
    unique: true
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [300, 'description cannot be grater than 300 characters']
  },
  published: {
    type: Boolean,
    required: true,
    default: false
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, {
  timestamps: true,
  versionKey: false
})

categorySchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = models.Category || model('Category', categorySchema)
