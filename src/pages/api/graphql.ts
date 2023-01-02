import type { NextApiRequest, NextApiResponse } from 'next'
import { createYoga, createSchema } from 'graphql-yoga'

import { allResolvers } from 'lib/graphql/resolvers'
import { allTypeDefs } from 'lib/graphql/types'
import { connectDB } from 'lib/db/connection'

export const config = {
  api: { bodyParser: false }
}
const handleYogaGraphql = createYoga<{ req: NextApiRequest, res: NextApiResponse }>({
  graphqlEndpoint: '/api/graphql',
  schema: createSchema({
    typeDefs: allTypeDefs,
    resolvers: allResolvers
  })
})

export default connectDB(handleYogaGraphql)
