import nextConnect from 'next-connect'

import { connectDB } from 'lib/db/connection'
import { onError, onNoMatch } from 'lib/api-controllers/common'
import { getMinistryById, updateMinistryById, pushMemberToMinistry, removeMemberToMinistry, deleteMinistryById } from 'lib/api-controllers/ministries'

const handler = nextConnect({ onNoMatch, onError })
  .get(getMinistryById)
  .put(updateMinistryById)
  .post(pushMemberToMinistry)
  .post(removeMemberToMinistry)
  .delete(deleteMinistryById)

export default connectDB(handler)
