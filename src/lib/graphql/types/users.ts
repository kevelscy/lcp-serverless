export const userTypeDef = `
  type PictureUser {
    publicId: String
    url: String
    width: Int
    height: Int
  }

  type User {
    id: String
    roles: [String]
    firstName: String
    lastName: String
    email: String
    password: String
    phone: String
    address: String
    birthDate: String
    profesion: String
    picture: PictureUser
    ministries: [String]
    orders: [String]
    isDeleted: Boolean
    createdAt: String
    updatedAt: String
  }
`