export const commonTypeDefs = `
  type Image {
    publicId: String
    url: String
    height: Int
    width: Int
  }

  type UserRole {
    id: String
    title: String
    users: [String]
    createdAt: String
    updatedAt: String
  }

  type UserAuthenticated {
    picture: String
    roles: [UserRole]
    firstName: String
    lastName: String
    email: String
    phone: String
    address: String
    birthDate: String
    profesion: String
    isDeleted: Boolean
    password: String
    id: String
    accessToken: String
    refreshToken: String
  }
`