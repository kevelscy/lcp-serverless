require('dotenv').config()
const mongoose = require('mongoose')
const { hashSync } = require('bcryptjs')
const User = require('./User.js')
const Role = require('./Role.js')
const Category = require('./Category.js')

const seedRolesData = [
  {
    name: 'ADMIN',
    users: []
  },
  {
    name: 'BASIC',
    users: []
  }
]

const seedCategoryData = [
  {
    title: 'none',
    description: 'none category',
    published: true,
    products: []
  }
]

const seedUserData = [
  {
    firstname: 'Gisselle',
    lastname: 'Ravelo',
    phone: process.env.USER_ADMIN_PHONE,
    password: hashSync(process.env.USER_ADMIN_PASSWORD, 10),
    roles: [],
    orders: [],
    address: 'Montalban'
  }
]

const seedDB = async () => {
  if (mongoose.connections[0].readyState) {
    return
  }

  console.log('Seeding Database...')
  await mongoose.connect(process.env.DATABASE_URL)
  await Role.deleteMany({})
  await User.deleteMany({})
  await Category.deleteMany({})

  await Category.insertMany(seedCategoryData)
  await Role.insertMany(seedRolesData)
  await User.insertMany(seedUserData)

  const userFounded = await User.findOne({ phone: seedUserData[0].phone })
  const rolesFounded = await Role.find({ name: { $in: ['BASIC', 'ADMIN'] } })
  await Role.updateMany({ name: { $in: ['BASIC', 'ADMIN'] } }, { users: [userFounded._id] }, { new: true, rawResult: true, returnDocument: true })

  userFounded.roles.push(rolesFounded[0]._id, rolesFounded[1]._id)
  await userFounded.save()

  console.log('Seeding Finished')
}

seedDB()
  .then(() => { console.log('Seed Database Success'); process.exit(1) })
  .catch(() => console.error('Seed Database Error'))
