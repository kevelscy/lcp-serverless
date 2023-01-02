import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import { hash } from 'bcryptjs'

import { deleteResourceByPublicId, uploadResource } from 'lib/services/cloudinary'
import { UserModel } from 'lib/db/models/User'
import { RoleModel } from 'lib/db/models/Role'
import { ERole } from 'lib/types/roles'

import { config } from 'config'

const { HTTP: { STATUS_CODE } } = config

export const getAllUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const allUsers = await UserModel.find()

  return res.status(200).json({
    data: allUsers,
    error: null
  })
}

export const getUserById = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.query.id
  const userFinded = await UserModel.findById(userId).exec()

  if (!userFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  return res.status(200).json({
    data: userFinded,
    error: null
  })
}

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userCreated = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) return res.status(500).json({
          data: null,
          error: 'CREATE_PRODUCT_FORMIDABLE_PARSE'
        })

        const {
          roles,
          firstName,
          lastName,
          email,
          password,
          phone,
          address,
          birthDate,
          profesion,
          // ministries,
          // orders,
          isDeleted
        } = fields

        if (!email || !password || !roles) {
          return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
            .json({ data: null, error: 'FIELDS_REQUIRED' })
        }

        const picture = files.picture as any || null
        const pictureUploaded = picture ? await uploadResource({ filePath: picture?.filepath, folderPath: 'users' }) : null

        // remove temp local image file
        // pictureUploaded && await fs.unlink(picture?.tempFilePath)

        const passwordHashed = await hash(password as string, 10)
        const roleUserFinded = await RoleModel.findOne({ title: ERole.USER })

        const pictureFormated = pictureUploaded
          ? {
            publicId: pictureUploaded.public_id,
            url: pictureUploaded.secure_url,
            width: pictureUploaded.width,
            height: pictureUploaded.height
          }
          : null

        console.log('pictureFormated', pictureFormated)

        const userCreated = await UserModel.create({
          email,
          password: passwordHashed,
          roles: [roleUserFinded.id],
          firstName: firstName || null,
          lastName: lastName || null,
          phone: phone || null,
          address: address || null,
          birthDate: birthDate || null,
          profesion: profesion || null,
          isDeleted: isDeleted || null,
          picture: pictureFormated,
          ministries: [],
          orders: []
        })

        if (!userCreated) {
          return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_CREATE_THIS_RESOURCE'
          })
        }

        const roleUserUpdated = await roleUserFinded.updateOne({ $push: { users: userCreated.id } })

        if (!roleUserUpdated) {
          return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_UPDATE_THIS_RESOURCE'
          })
        }

        return resolve(userCreated)
      })
    })

    return res.status(200).json({
      data: userCreated,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `CREATE_USER - ${err}`
    })
  }
}

export const updateUserById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userUpdated = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()
  
      form.parse(req, async (formError, fields, files) => {
        if (formError) {
          console.error('formError', formError)

          res.json({
            data: null,
            error: 'ERROR_FORM_PARSE_ERROR'
          })
        }

        const userId = req.query.id
        const {
          roles,
          firstName,
          lastName,
          email,
          password,
          phone,
          address,
          birthDate,
          profesion,
          ministries,
          orders,
          isDeleted
        } = fields
      
        const userFinded = await UserModel.findById(userId).exec()
      
        if (!userFinded) {
          return res.status(STATUS_CODE.NOT_FOUND).json({
            data: null,
            error: 'NOT_FOUND'
          })
        }

        const picture = files.picture as any || null
        const pictureUploaded = picture ? await uploadResource({ filePath: picture?.tempFilePath, folderPath: 'users' }) : null
      

        // remove temp local image file
        // pictureUploaded && await fs.unlink(picture?.tempFilePath)
        const passwordHashed = password ? await hash(password as string, 10) : null
      
        const userUpdated = await UserModel.findByIdAndUpdate(userFinded.id, {
          email: email || userFinded.email,
          password: passwordHashed || userFinded.password,
          roles: roles || userFinded.roles,
          firstName: firstName || userFinded.firstName,
          lastName: lastName || userFinded.lastName,
          phone: phone || userFinded.phone,
          address: address || userFinded.address,
          birthDate: birthDate || userFinded.birthDate,
          profesion: profesion || userFinded.profesion,
          isDeleted: isDeleted || userFinded.isDeleted,
          picture: pictureUploaded
            ? {
              publicId: pictureUploaded.public_id,
              url: pictureUploaded.secure_url,
              width: pictureUploaded.width,
              height: pictureUploaded.height
            }
            : userFinded.picture,
          ministries: ministries || [],
          orders: orders || []
        }, { new: true })

        // remove old user picture
        const { result } = await deleteResourceByPublicId(userUpdated.picture.publicId)

        if (result !== 'ok') {
          console.error('old user picture failed to delete')    
        }
      
        return resolve(userUpdated)
      })
    })

    return res.status(200).json({
      data: userUpdated,
      error: null
    })
  
  } catch (error) {
    
  }
}

export const deleteUserById = async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.query.id
  const userDeleted = await UserModel.findByIdAndDelete(userId).exec()

  if (!userDeleted) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  const { result } = await deleteResourceByPublicId(userDeleted.picture.publicId)

  if (result !== 'ok') {
    console.error('user picture failed to delete')    
  }

  return res.status(200).json({
    data: userDeleted,
    error: null
  })
}
