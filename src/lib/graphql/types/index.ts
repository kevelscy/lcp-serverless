import { bannerTypeDef } from './banner'
import { commonTypeDefs } from './common'
import { userTypeDef } from './users'

const queryTypeDefs = `
  scalar File

  type Query {
    users: [User]
    userById(userId: String!): User
    banners: [Banner]
    bannerById(bannerId: String!): Banner
  }

  type Mutation {
    signIn(email: String!, password: String!): UserAuthenticated
    createUser(picture: File!): Boolean
  }
`


// mutation SignIn($email:String, $password:String,){
//   signIn(email: $email, password: $password){
//     firstName
//   }
// }

// signIn(email: String, password: String): UserAuthenticated

// ${productTypeDef}
// ${orderTypeDef}
export const allTypeDefs = `
  ${commonTypeDefs}
  ${bannerTypeDef}
  ${userTypeDef}
  ${queryTypeDefs}
`