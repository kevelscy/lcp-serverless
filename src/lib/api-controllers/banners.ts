import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'

import { uploadResource, deleteResourceByPublicId } from 'lib/services/cloudinary'
import { BannerModel } from 'lib/db/models/Banner'

import { config } from 'config'
import { slugify } from 'lib/utils/slugify'
import { UploadApiResponse } from 'cloudinary'

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

        const { title } = fields

        if (!title) {
          return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
            .json({ data: null, error: 'FIELDS_REQUIRED' })
        }

        const bannerCreated = await BannerModel.create({
          title,
          image: {
            mobile: {
              publicId: null,
              url: null,
              width: null,
              height: null
            },
            desktop: {
              publicId: null,
              url: null,
              width: null,
              height: null
            }
          }
        })

        if (!bannerCreated) {
          return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_CREATE_THIS_RESOURCE'
          })
        }

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

export const uploadImageOfBannerById = async (req: NextApiRequest, res: NextApiResponse) => {
  const bannerId = req.query.id as string

  try {
    const bannerCreated = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) return res.status(500).json({
          data: null,
          error: 'UPLOAD_IMAGE_BANNER_FORMIDABLE_PARSE'
        })

        const { type } = fields as { type: 'mobile' | 'desktop' }
        const image = files?.image as any || null
        let imageUploaded: UploadApiResponse

        if (!type || !image) {
          return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
            .json({ data: null, error: 'FIELDS_REQUIRED' })
        }

        const bannerFinded = await BannerModel.findById(bannerId)
        console.log('bannerFinded', bannerFinded)

        if (!bannerFinded) {
          return res.status(STATUS_CODE.NOT_FOUND).json({
            data: null,
            error: 'BANNER_NOT_FOUND'
          })
        }

        if (type === 'mobile') {
          console.log('upload mobile')
          const publicId = slugify(`${bannerFinded.title}-mobile`)

          console.log('publicId', publicId)

          imageUploaded = await uploadResource({
            publicId,
            filePath: image?.filepath,
            folderPath: 'banners'
          })
        }

        if (type === 'desktop') {
          console.log('upload desktop')
          const publicId = slugify(`${bannerFinded.title}-mobile`)

          imageUploaded = await uploadResource({
            publicId,
            filePath: image?.filepath,
            folderPath: 'banners',
          })
        }

        const bannerToUpdate = {
          title: bannerFinded.title,
          image: {
            mobile: {
              publicId: type === 'mobile' ? imageUploaded.public_id : bannerFinded.image.mobile.publicId,
              url: type === 'mobile' ? imageUploaded.secure_url : bannerFinded.image.mobile.url,
              width: type === 'mobile' ? imageUploaded.width : bannerFinded.image.mobile.width,
              height: type === 'mobile' ? imageUploaded.height : bannerFinded.image.mobile.height
            },
            desktop: {
              publicId: type === 'desktop' ? imageUploaded.public_id : bannerFinded.image.desktop.publicId,
              url: type === 'desktop' ? imageUploaded.secure_url : bannerFinded.image.desktop.url,
              width: type === 'desktop' ? imageUploaded.width : bannerFinded.image.desktop.width,
              height: type === 'desktop' ? imageUploaded.height : bannerFinded.image.desktop.height
            }
          }
        }

        const bannerUpdated = await bannerFinded.updateOne(bannerToUpdate)
      
        if (!bannerUpdated.modifiedCount) {
          return res.status(STATUS_CODE.CONFLICT_TO_EDIT_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_EDIT_THIS_RESOURCE'
          })
        }

        if (type === 'mobile') {
          const { result: resultMobile } = await deleteResourceByPublicId(bannerFinded.image.mobile.publicId)
  
          if (resultMobile !== 'ok') {
            console.error('banner mobile failed to delete')    
          }
        }

        if (type === 'mobile') {
          const { result: resultDesktop } = await deleteResourceByPublicId(bannerFinded.image.desktop.publicId)
  
          if (resultDesktop !== 'ok') {
            console.error('banner desktop failed to delete')    
          }
        }

        return resolve(bannerUpdated)
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
    const { title } = req.body

    if (!title) {
      return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
        .json({ data: null, error: 'FIELDS_REQUIRED' })
    }

    const bannerId = req.query.id
    const bannerFinded = await BannerModel.findById(bannerId)
  
    if (!bannerFinded) {
      return res.status(STATUS_CODE.NOT_FOUND).json({
        data: null,
        error: 'NOT_FOUND'
      })
    }

    const bannerUpdated = await bannerFinded.updateOne({ title })
  
    if (!bannerUpdated.modifiedCount) {
      return res.status(STATUS_CODE.CONFLICT_TO_EDIT_THIS_RESOURCE).json({
        data: null,
        error: 'CONFLICT_TO_EDIT_THIS_RESOURCE'
      })
    }

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

  const { result: resultMobile } = await deleteResourceByPublicId(bannerDeleted.image.mobile.publicId)
  const { result: resultDesktop } = await deleteResourceByPublicId(bannerDeleted.image.desktop.publicId)

  if (resultMobile !== 'ok') {
    console.error('banner mobile failed to delete')    
  }

  if (resultDesktop !== 'ok') {
    console.error('banner desktop failed to delete')    
  }

  return res.status(200).json({
    data: bannerDeleted,
    error: null
  })
}
