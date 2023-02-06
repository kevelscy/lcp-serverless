import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'

import { uploadResource, deleteResourceByPublicId } from 'lib/services/cloudinary'
import { BannerModel } from 'lib/db/models/Banner'

import { config } from 'config'
import { slugify } from 'lib/utils/slugify'

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
        const imageMobile = files?.imageMobile as any || null
        const imageDesktop = files?.imageDesktop as any || null
      
        if (!title || !imageMobile || !imageDesktop) {
          return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
            .json({ data: null, error: 'FIELDS_REQUIRED' })
        }

        const imageMobileUploaded = await uploadResource({
          publicId: slugify(`${title}-mobile`),
          filePath: imageMobile?.filepath,
          folderPath: 'banners'
        })

        const imageDesktopUploaded = await uploadResource({
          publicId: slugify(`${title}-desktop`),
          filePath: imageDesktop?.filepath,
          folderPath: 'banners',
        })
      
        const bannerCreated = await BannerModel.create({
          title,
          image: {
            mobile: {
              publicId: imageMobileUploaded.public_id,
              url: imageMobileUploaded.secure_url,
              width: imageMobileUploaded.width,
              height: imageMobileUploaded.height
            },
            desktop: {
              publicId: imageDesktopUploaded.public_id,
              url: imageDesktopUploaded.secure_url,
              width: imageDesktopUploaded.width,
              height: imageDesktopUploaded.height
            }
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
        const imageMobile = files?.imageMobile as any || null
        const imageDesktop = files?.imageDesktop as any || null
      
        const bannerFinded = await BannerModel.findById(bannerId).exec()
      
        if (!bannerFinded) {
          return res.status(STATUS_CODE.NOT_FOUND).json({
            data: null,
            error: 'NOT_FOUND'
          })
        }

        const imageMobileUploaded = imageMobile ? await uploadResource({ filePath: imageMobile?.tempFilePath, folderPath: 'banners' }) : null
        const imageDesktopUploaded = imageDesktop ? await uploadResource({ filePath: imageDesktop?.tempFilePath, folderPath: 'banners' }) : null

        // remove temp local image file
        // imageMobileUploaded && await fs.unlink(image?.tempFilePath)
      
        const bannerToUpdate = {
          title: title || bannerFinded.title,
          image: {
            mobile: {
              publicId: imageMobileUploaded ? imageMobileUploaded.public_id : bannerFinded.image.mobile.publicId,
              url: imageMobileUploaded ? imageMobileUploaded.secure_url : bannerFinded.image.mobile.url,
              width: imageMobileUploaded ? imageMobileUploaded.width : bannerFinded.image.mobile.width,
              height: imageMobileUploaded ? imageMobileUploaded.height : bannerFinded.image.mobile.height
            },
            desktop: {
              publicId: imageDesktopUploaded ? imageDesktopUploaded.public_id : bannerFinded.image.desktop.publicId,
              url: imageDesktopUploaded ? imageDesktopUploaded.secure_url : bannerFinded.image.desktop.url,
              width: imageDesktopUploaded ? imageDesktopUploaded.width : bannerFinded.image.desktop.width,
              height: imageDesktopUploaded ? imageDesktopUploaded.height : bannerFinded.image.desktop.height
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
      
        if (imageMobileUploaded) {
          // Delete old image mobile banner from cloudinary
          const { result } = await deleteResourceByPublicId(bannerFinded.image.mobile.publicId)
      
          if (result !== 'ok') {
      
            return res.status(500).json({
              data: null,
              error: 'ERROR_TO_DELETE_AFTER_IMAGE_MOBILE_OF_BANNER'
            })
      
          }
        }

        if (imageDesktopUploaded) {
          // Delete old image desktop banner from cloudinary
          const { result } = await deleteResourceByPublicId(bannerFinded.image.desktop.publicId)
      
          if (result !== 'ok') {
      
            return res.status(500).json({
              data: null,
              error: 'ERROR_TO_DELETE_AFTER_IMAGE_DESKTOP_OF_BANNER'
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
