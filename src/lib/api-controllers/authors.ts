import { NextApiRequest, NextApiResponse } from 'next'

import { AuthorModel } from 'lib/db/models/Author'
import { UserModel } from 'lib/db/models/User'

import { config } from 'config'

const { HTTP: { STATUS_CODE } } = config

export const getAuthors = async (req: NextApiRequest, res: NextApiResponse) => {
  const allAuthors = await AuthorModel.find().populate('user')

  return res.status(200).json({
    data: allAuthors,
    error: null
  })
}

export const getAuthorById = async (req: NextApiRequest, res: NextApiResponse) => {
  const authorId = req.query.id as string
  const authorFinded = await AuthorModel.findById(authorId).exec()

  if (!authorFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  return res.status(200).json({
    data: authorFinded,
    error: null
  })
}

export const upgradeToAuthor = async (req: NextApiRequest, res: NextApiResponse) => {
  const authorId = req.query.id as string

  if (!authorId) {
    return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
      .json({ data: null, error: 'FIELDS_REQUIRED' })
  }

  const userFinded = await UserModel.findById(authorId).exec()

  if (!userFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'USER_NOT_FOUND'
    })
  }

  const authorCreated = await AuthorModel.create({
    devotionals: [],
    posts: [],
    user: userFinded.id
  })

  if (!authorCreated) {
    return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
      data: null,
      error: 'CONFLICT_TO_CREATE_THIS_RESOURCE'
    })
  }
  return res.status(200).json({
    data: authorCreated,
    error: null
  })
}

export const deleteAuthorById = async (req: NextApiRequest, res: NextApiResponse) => {
  const authorId = req.query.id as string
  const authorDeleted = await AuthorModel.findByIdAndDelete(authorId).exec()

  if (!authorDeleted) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  return res.status(200).json({
    data: authorDeleted,
    error: null
  })
}
