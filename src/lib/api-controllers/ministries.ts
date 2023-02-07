import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'

import { deleteResourceByPublicId, uploadResource } from 'lib/services/cloudinary'
import { MinistryModel } from 'lib/db/models/Minsitry'
import { UserModel } from 'lib/db/models/User'

import { config } from 'config'

const { HTTP: { STATUS_CODE } } = config

export const getAllMinistries = async (req: NextApiRequest, res: NextApiResponse) => {
  const allMinistries = await MinistryModel.find()

  return res.status(200).json({
    data: allMinistries,
    error: null
  })
}

export const getMinistryById = async (req: NextApiRequest, res: NextApiResponse) => {
  const ministryId = req.query.id as string
  const ministryFinded = await MinistryModel.findById(ministryId).exec()

  if (!ministryFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  return res.status(200).json({
    data: ministryFinded,
    error: null
  })
}

export const createMinistry = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const ministryCreated = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) {
          return res.status(500).json({
            data: null,
            error: 'CREATE_MINISTRY_FORMIDABLE_PARSE'
          })
        }

        const coverImage = files?.coverImage as any || null
        const { title, label, slug, description, leaderId, membersId } = fields

        if (!title || !label || !description || !leaderId || !membersId || !slug || !coverImage) {
          return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
            .json({ data: null, error: 'FIELDS_REQUIRED' })
        }

        const coverImageUploaded = await uploadResource({ filePath: coverImage?.tempFilePath, folderPath: 'ministries' })

        // remove temp local image file
        // await fs.unlink(coverImage?.tempFilePath)

        const ministryCreated = await MinistryModel.create({
          title,
          label,
          description,
          slug,
          leader: leaderId,
          members: [],
          coverImage: {
            publicId: coverImageUploaded.public_id,
            url: coverImageUploaded.secure_url,
            width: coverImageUploaded.width,
            height: coverImageUploaded.height
          }
        })

        if (!ministryCreated) {
          return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_CREATE_THIS_RESOURCE'
          })
        }

        return resolve(ministryCreated)
      })
    })

    return res.status(200).json({
      data: ministryCreated,
      error: null
    })
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `CREATE_MINISTRY - ${JSON.stringify(err)}`
    })
  }
}

export const updateMinistryById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const ministryUpdated = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) {
          return res.status(500).json({
            data: null,
            error: 'CREATE_MINISTRY_FORMIDABLE_PARSE'
          })
        }

        const ministryId = req.query.id as string
        const { title, label, slug, description, leaderId, membersId } = req.body
        const coverImage = files?.coverImage as any || null

        const ministryFinded = await MinistryModel.findById(ministryId).exec()

        if (!ministryFinded) {
          return res.status(STATUS_CODE.NOT_FOUND).json({
            data: null,
            error: 'NOT_FOUND'
          })
        }

        const coverImageUploaded = coverImage ? await uploadResource({ filePath: coverImage?.tempFilePath, folderPath: 'ministries' }) : null

        // remove temp local image file
        // coverImageUploaded && await fs.unlink(coverImage?.tempFilePath)

        const ministryUpdated = await MinistryModel.findByIdAndUpdate(ministryFinded.id, {
          title: title || ministryFinded.title,
          label: label || ministryFinded.label,
          description: description || ministryFinded.description,
          leader: leaderId || ministryFinded.leader,
          members: membersId || ministryFinded.members,
          slug: slug || ministryFinded.slug,
          coverImage: {
            publicId: coverImageUploaded ? coverImageUploaded.public_id : ministryFinded.coverImage.publicId,
            url: coverImageUploaded ? coverImageUploaded.secure_url : ministryFinded.coverImage.url,
            width: coverImageUploaded ? coverImageUploaded.width : ministryFinded.coverImage.width,
            height: coverImageUploaded ? coverImageUploaded.height : ministryFinded.coverImage.height
          }
        }, { new: true })

        return resolve(ministryUpdated)
      })
    })

    return res.status(200).json({
      data: ministryUpdated,
      error: null
    })
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `UPDATE_MINISTRY - ${JSON.stringify(err)}`
    })
  }
}

export const pushMemberToMinistry = async (req: NextApiRequest, res: NextApiResponse) => {
  const ministryId = req.query.id as string
  const { memberId } = req.body

  const ministryFinded = await MinistryModel.findById(ministryId).exec()

  if (!ministryFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  const userUpdated = await UserModel.findByIdAndUpdate(memberId, { $push: { ministries: ministryFinded.id } }, { new: true })

  if (!userUpdated) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'MEMBER_NOT_EXIST'
    })
  }

  const userFindedPopulated = await userUpdated.populate('roles')

  const userIsMember = userFindedPopulated.roles.some((role: any) => role.title === 'MEMBER_OF_CHURCH')

  if (!userIsMember) {
    return res.status(STATUS_CODE.NOT_EXIST).json({
      data: null,
      error: 'THIS_USER_IS_NOT_MEMBER'
    })
  }

  const ministryUpdated = await MinistryModel.findByIdAndUpdate(ministryFinded.id, { $push: { members: memberId } }, { new: true })

  return res.status(200).json({
    data: ministryUpdated,
    error: null
  })
}

export const removeMemberToMinistry = async (req: NextApiRequest, res: NextApiResponse) => {
  const ministryId = req.query.id as string
  const { memberId } = req.body

  const ministryFinded = await MinistryModel.findById(ministryId).exec()

  if (!ministryFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  const userUpdated = await UserModel.findByIdAndUpdate(memberId, { $pull: { ministries: ministryFinded.id } }, { new: true })

  if (!userUpdated) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'MEMBER_NOT_EXIST'
    })
  }

  const ministryUpdated = await MinistryModel.findByIdAndUpdate(ministryFinded.id, { $pull: { members: memberId } }, { new: true })

  return res.status(200).json({
    data: ministryUpdated,
    error: null
  })
}

export const deleteMinistryById = async (req: NextApiRequest, res: NextApiResponse) => {
  const ministryId = req.query.id as string
  const ministryDeleted = await MinistryModel.findByIdAndDelete(ministryId).exec()

  if (!ministryDeleted) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  const usersUpdated = await UserModel.updateMany({}, { $pull: { ministries: ministryDeleted.id } })

  if (!usersUpdated) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'MEMBER_NOT_EXIST'
    })
  }

  const { result } = await deleteResourceByPublicId(ministryDeleted.coverImage.publicId)

  if (result !== 'ok') {
    console.error('ministry picture failed to delete')
  }

  return res.status(200).json({
    data: ministryDeleted,
    error: null
  })
}
