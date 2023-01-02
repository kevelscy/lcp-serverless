import { signIn } from './auth'
import { getAllBanners } from './banners'
import { createUser, getAllUsers, getUserById } from './user'

// export const allResolvers = {
//   Query: {
//     posts: () => posts,
//     author: (xd, obj) => {
//       console.log('xd', xd)
//       console.log('obj', obj)


//       return authors.find(author => author.id === obj?.id)
//     }
//   },
 
//   Mutation: {
//     upvotePost(_, { postId }) {
//       const post = posts.find((post) => post.id === postId )

//       if (!post)
//         throw new Error(`Couldn't find post with id ${postId}`)

//       post.votes += 1

//       return post
//     }
//   },
 
//   Author: {
//     posts: author => posts.filter((post) => post.authorId === author.id)
//   },
 
//   Post: {
//     author: post => authors.find((author) => author.id === post.authorId)
//   }
// }

export const allResolvers = {
  Query: {
    users: getAllUsers,
    userById: getUserById,
    banners: getAllBanners
  },

  Mutation: {
    signIn: signIn,
    createUser: createUser
  }
}
