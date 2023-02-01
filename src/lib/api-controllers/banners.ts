import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'

import { uploadResource, deleteResourceByPublicId } from 'lib/services/cloudinary'
import { BannerModel } from 'lib/db/models/Banner'

import { config } from 'config'

const { HTTP: { STATUS_CODE } } = config

export const getAllBanners = async (req: NextApiRequest, res: NextApiResponse) => {
  const allBanners = await BannerModel.find()

  return res.status(200).json({
    data: allBanners,
    error: null
  })
}

export const getBannerById = async (req: NextApiRequest, res: NextApiResponse) => {
  const bannerId = req.query.id as string
  const bannerFinded = await BannerModel.findById(bannerId).exec()

  if (!bannerFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  return res.status(200).json({
    data: bannerFinded,
    error: null
  })
}

export const createBanner = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const bannerCreated = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) return res.status(500).json({
          data: null,
          error: 'CREATE_BANNER_FORMIDABLE_PARSE'
        })

        const { title, type } = fields
        const image = files?.image as any || null
      
        if (!title || !image || !type) {
          return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
            .json({ data: null, error: 'FIELDS_REQUIRED' })
        }
      
        const imageUploaded = await uploadResource({ filePath: image?.tempFilePath, folderPath: 'banners' })
      
        const bannerCreated = await BannerModel.create({
          title,
          type,
          image: {
            publicId: imageUploaded.public_id,
            url: imageUploaded.secure_url,
            width: imageUploaded.width,
            height: imageUploaded.height
          }
        })
      
        if (!bannerCreated) {
          return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_CREATE_THIS_RESOURCE'
          })
        }
      
        // remove temp local image file
        // await fs.unlink(image?.tempFilePath)
        return resolve(bannerCreated)
      })
    })
  
    return res.status(200).json({
      data: bannerCreated,
      error: null
    })
    
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `CREATE_BANNER - ${err}`
    })
  }
}

export const updateBannerById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const bannerUpdated = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) return res.status(500).json({
          data: null,
          error: 'CREATE_BANNER_FORMIDABLE_PARSE'
        })

        const { title } = fields
        const bannerId = req.query.id
        const image = files?.image as any || null
      
        const bannerFinded = await BannerModel.findById(bannerId).exec()
      
        if (!bannerFinded) {
          return res.status(STATUS_CODE.NOT_FOUND).json({
            data: null,
            error: 'NOT_FOUND'
          })
        }
      
        const imageUploaded = image ? await uploadResource({ filePath: image?.tempFilePath, folderPath: 'banners' }) : null

        // remove temp local image file
        // imageUploaded && await fs.unlink(image?.tempFilePath)
      
        const bannerToUpdate = {
          title: title || bannerFinded.title,
          image: {
            publicId: imageUploaded ? imageUploaded.public_id : bannerFinded.image.publicId,
            url: imageUploaded ? imageUploaded.secure_url : bannerFinded.image.url,
            width: imageUploaded ? imageUploaded.width : bannerFinded.image.width,
            height: imageUploaded ? imageUploaded.height : bannerFinded.image.height
          }
        }
      
        const bannerUpdated = await bannerFinded.updateOne(bannerToUpdate)
      
        if (!bannerUpdated.modifiedCount) {
          return res.status(STATUS_CODE.CONFLICT_TO_EDIT_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_EDIT_THIS_RESOURCE'
          })
        }
      
        if (imageUploaded) {
          // Delete old image banner
          const { result } = await deleteResourceByPublicId(bannerFinded.image.publicId)
      
          if (result !== 'ok') {
      
            return res.status(500).json({
              data: null,
              error: 'ERROR_TO_DELETE_AFTER_IMAGE_OF_BANNER'
            })
      
          }
        }

        return resolve({ id: bannerFinded.id, ...bannerToUpdate })
      })
    })

    return res.status(200).json({
      data: bannerUpdated,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `UPDATE_BANNER - ${JSON.stringify(err)}`
    })
  }
}

export const deleteBannerById = async (req: NextApiRequest, res: NextApiResponse) => {
  const bannerId = req.query.id as string
  const bannerDeleted = await BannerModel.findByIdAndDelete(bannerId).exec()

  if (!bannerDeleted) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  const { result } = await deleteResourceByPublicId(bannerDeleted.image.publicId)

  if (result !== 'ok') {
    console.error('user picture failed to delete')    
  }

  return res.status(200).json({
    data: bannerDeleted,
    error: null
  })
}
