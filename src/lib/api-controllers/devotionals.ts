import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'

import { deleteFileById, uploadFile } from 'lib/services/firebase/uploadFile'
import { DevotionalModel } from 'lib/db/models/Devotional'
import { AuthorModel } from 'lib/db/models/Author'

import { config } from 'config'

const { HTTP: { STATUS_CODE } } = config

export const getAllDevotionals = async (req: NextApiRequest, res: NextApiResponse) => {
  const allDevotionals = await DevotionalModel.find().populate({
    path: 'author',
    populate: {
      path: 'user',
      model: 'User'
    }
  })

  return res.status(200).json({
    data: allDevotionals,
    error: null
  })
}

export const getDevotionalById = async (req: NextApiRequest, res: NextApiResponse) => {
  const devotionalId = req.query.id
  const devotionalFinded = await DevotionalModel.findById(devotionalId).populate({
    path: 'author',
    populate: {
      path: 'user',
      model: 'User'
    }
  })

  if (!devotionalFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  return res.status(200).json({
    data: devotionalFinded,
    error: null
  })
}

export const createDevotional = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const devotionalCreated = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) return res.status(500).json({
          data: null,
          error: 'CREATE_DEVOTIONAL_FORMIDABLE_PARSE'
        })

        const { title, authorId } = fields
        const file = files?.file as any || null
    
        if (!title || !file || !authorId) {
          return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
            .json({ data: null, error: 'FIELDS_REQUIRED' })
        }
    
        const devotionalFinded = await DevotionalModel.findOne({ title })
    
        if (devotionalFinded) {
          return res.status(STATUS_CODE.RESOURCE_ALREADY_EXIST).json({
            data: null,
            error: 'RESOURCE_ALREADY_EXIST'
          })
        }
    
        const authorFinded = await AuthorModel.findById(authorId).exec()
    
        if (!authorFinded) {
          return res.status(STATUS_CODE.NOT_FOUND).json({
            data: null,
            error: 'AUTHOR_NOT_EXISTS'
          })
        }
    
        const { data: fileUploaded, error: fileError } = await uploadFile({
          pathFile: file?.tempFilePath,
          root: 'devotionals',
          ext: '.pdf',
          title: title as string
        })
    
        if (fileError) {
          return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_UPLOAD_THIS_FILE'
          })
        }

        console.log('fileUploaded', fileUploaded)

        const devotionalCreated = await DevotionalModel.create({
          title,
          author: authorId,
          file: {
            publicId: fileUploaded.id,
            url: fileUploaded.url
          }
        })
    
        if (!devotionalCreated) {
          return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_CREATE_THIS_RESOURCE'
          })
        }
    
        await authorFinded.updateOne({ $push: { devotionals: devotionalCreated.id } })
    
        // remove temp local image file
        // await fs.unlink(file?.tempFilePath)

        const devotionalCreatedPopulated = await devotionalCreated.populate({
          path: 'author',
          populate: {
            path: 'user',
            model: 'User'
          }
        })

        return resolve(devotionalCreatedPopulated)
      })
    })

    return res.status(200).json({
      data: devotionalCreated,
      error: null
    })

  } catch (err) {
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      data: null,
      error: `CREATE_DEVOTIONAL - ${JSON.stringify(err)}`
    })
  }
}

export const updateDevotionalById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const devotionalToUpdate = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) return res.status(500).json({
          data: null,
          error: 'CREATE_DEVOTIONAL_FORMIDABLE_PARSE'
        })

        const { title } = fields
        const devotionalId = req.query.id
        const file = files?.file as any || null
      
        const devotionalFinded = await DevotionalModel.findById(devotionalId).exec()
      
        if (!devotionalFinded) {
          return res.status(STATUS_CODE.NOT_FOUND).json({
            data: null,
            error: 'NOT_FOUND'
          })
        }

        // const fileUploaded = file ? await uploadResource({ filePath: file?.tempFilePath, folderPath: 'devotionals' }) : null

        const { data: fileUploaded, error: fileError } = file
          ? await uploadFile({
            pathFile: file?.tempFilePath,
            root: 'devotionals',
            ext: '.pdf',
            title: title as string
          })
          : null

        if (fileError) {
          return res.status(STATUS_CODE.CONFLICT_TO_UPDATE_THIS_RESOURCE).json({
            data: null,
            error: `CONFLICT_TO_UPDATE_THIS_RESOURCE - ${fileError}`
          })
        }

        // remove temp local image file
        // fileUploaded && await fs.unlink(file?.tempFilePath)

        const devotionalToUpdate = {
          title: title || devotionalFinded.title,
          file: {
            publicId: fileUploaded ? fileUploaded.id : devotionalFinded.file.publicId,
            url: fileUploaded ? fileUploaded.url : devotionalFinded.file.url
          }
        }

        const devotionalUpdated = await devotionalFinded.updateOne(devotionalToUpdate).populate({
          path: 'author',
          populate: {
            path: 'user',
            model: 'User'
          }
        })

        if (!devotionalUpdated) {
          return res.status(STATUS_CODE.CONFLICT_TO_EDIT_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_EDIT_THIS_RESOURCE'
          })
        }

        return resolve(devotionalToUpdate)
      })
    })

    return res.status(200).json({
      data: devotionalToUpdate,
      error: null
    })
    
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `UPDATE_DEVOTIONAL - ${JSON.stringify(err)}`
    })
  }
}

export const deleteDevotionalById = async (req: NextApiRequest, res: NextApiResponse) => {
  const devotionalId = req.query.id as string
  const devotionalDeleted = await DevotionalModel.findByIdAndDelete(devotionalId).exec()

  if (!devotionalDeleted) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  const { error: fileError } = await deleteFileById(devotionalDeleted.file.publicId)

  if (fileError) {
    return res.status(STATUS_CODE.CONFLICT_TO_DELETE_THIS_RESOURCE).json({
      data: null,
      error: `CONFLICT_TO_DELETE_THIS_RESOURCE - ${fileError}`
    })
  }

  const authorFinded = await AuthorModel.findById(devotionalDeleted.author).exec()

  if (!authorFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'AUTHOR_NOT_EXISTS'
    })
  }

  await authorFinded.updateOne({ $pull: { devotionals: devotionalDeleted.id } })

  return res.status(200).json({
    data: devotionalDeleted,
    error: null
  })
}
