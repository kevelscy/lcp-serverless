import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'

import { uploadResource, deleteResourceByPublicId } from 'lib/services/cloudinary'
import { ProductCategoryModel } from 'lib/db/models/ProductCategory'
import { ProductModel } from 'lib/db/models/Product'

import { config } from 'config'

const { HTTP: { STATUS_CODE } } = config

export const getAllProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  try {

    let filter: { published?: boolean } | {} = {}

    if (req.query.published === 'true') {
      filter = { published: true }
    } else if (req.query.published === 'false') {
      filter = { published: false }
    }

    const allProductsPopulated = await ProductModel.find(filter).populate('category')

    return res.status(200).json({
      data: allProductsPopulated,
      error: null
    })

  } catch (err) {

    console.log('getAllProducts err', err)

    return res.status(STATUS_CODE.SERVER_ERROR).json({
      data: null,
      error: `SERVER_ERROR - ${err.message}`
    })

  }
}

export const getProductById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {

    const productId = req.query.id
    const productFinded = await ProductModel.findById(productId).populate('category')

    if (!productFinded) {
      return res.status(STATUS_CODE.NOT_FOUND).json({
        data: null,
        error: 'NOT_FOUND'
      })
    }

    return res.status(200).json({
      data: productFinded,
      error: null
    })

  } catch (err) {

    console.log('getProductById err', err)

    return res.status(STATUS_CODE.SERVER_ERROR).json({
      data: null,
      error: `SERVER_ERROR - ${err.message}`
    })

  }
}

export const createProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const productCreated = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) return res.status(500).json({
          data: null,
          error: 'CREATE_PRODUCT_FORMIDABLE_PARSE'
        })

        const { title, price, description, categoryId, slug, published } = fields
        const image = files?.image as any || null
    
        if (!title || !price || !description || !image || !categoryId || !slug) {
          return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
            .json({ data: null, error: 'FIELDS_REQUIRED' })
        }
    
        const imageUploaded = await uploadResource({ filePath: image?.tempFilePath, folderPath: 'products' })
    
        const productCreated = await ProductModel.create({
          title,
          price,
          description,
          category: categoryId,
          slug,
          published: published || false,
          image: {
            publicId: imageUploaded.public_id,
            url: imageUploaded.secure_url,
            width: imageUploaded.width,
            height: imageUploaded.height
          }
        })
    
        if (!productCreated) {
          return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_CREATE_THIS_RESOURCE'
          })
        }
    
        // remove temp local image file
        // await fs.unlink(image?.tempFilePath)
    
        // Push product to categories
        await ProductCategoryModel.findByIdAndUpdate(productCreated.category, { $push: { products: productCreated.id } })

        return resolve(productCreated)
      })
    })

    return res.status(200).json({
      data: productCreated,
      error: null
    })

  } catch (err) {
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      data: null,
      error: `SERVER_ERROR - ${err.message}`
    })
  }
}

export const updateProductById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const productUpdated = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) return res.status(500).json({
          data: null,
          error: 'UPDATE_PRODUCT_FORMIDABLE_PARSE'
        })

        const productId = req.query.id
        const image = files?.image as any || null
        const { title, price, description, categoryId, slug, published } = fields
    
        const productFinded = await ProductModel.findById(productId).exec()
    
        if (!productFinded) {
          return res.status(STATUS_CODE.NOT_FOUND).json({
            data: null,
            error: 'NOT_FOUND'
          })
        }
    
        const imageUploaded = image ? await uploadResource({ filePath: image?.tempFilePath, folderPath: 'products' }) : null
    
        // remove temp local image file
        // imageUploaded && await fs.unlink(image?.tempFilePath)
    
        const productToUpdate = {
          title: title || productFinded.title,
          price: price || productFinded.price,
          description: description || productFinded.description,
          category: categoryId || productFinded.category,
          slug: slug || productFinded.slug,
          published: published || productFinded.published,
          image: {
            publicId: imageUploaded ? imageUploaded.public_id : productFinded.image.publicId,
            url: imageUploaded ? imageUploaded.secure_url : productFinded.image.url,
            width: imageUploaded ? imageUploaded.width : productFinded.image.width,
            height: imageUploaded ? imageUploaded.height : productFinded.image.height
          }
        }

        if (categoryId !== productFinded.category.id) {
          // Si la categoria del producto se actualizo, entonces se elimina el producto relacionado a la anterior categoria
          // Luego añadimos a la nueva categoria asociada nuestro producto
          await ProductCategoryModel.findByIdAndUpdate(productFinded.category, {
            $pull: { products: productFinded.id }
          })
    
          await ProductCategoryModel.findByIdAndUpdate(categoryId, {
            $push: { products: productFinded.id }
          })
        }
    
        const productUpdated = await productFinded.updateOne(productToUpdate)
    
        if (!productUpdated) {
          return res.status(STATUS_CODE.CONFLICT_TO_EDIT_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_EDIT_THIS_RESOURCE'
          })
        }

        return resolve(productUpdated)
      })
    })

    return res.status(200).json({
      data: productUpdated,
      error: null
    })

  } catch (err) {
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      data: null,
      error: `SERVER_ERROR - ${err.message}`
    })

  }
}

export const deleteProductById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {

    const productId = req.query.id
    const productDeleted = await ProductModel.findByIdAndDelete(productId).exec()

    if (!productDeleted) {
      return res.status(STATUS_CODE.NOT_FOUND).json({
        data: null,
        error: 'NOT_FOUND'
      })
    }

    await ProductCategoryModel.findByIdAndUpdate(productDeleted.category, { $pull: { products: { $in: [productDeleted.id] } } })
    const { result } = await deleteResourceByPublicId(productDeleted.image.publicId)

    if (result !== 'ok') {
      console.error('product image failed to delete')    
    }

    return res.status(200).json({
      data: productDeleted,
      error: null
    })

  } catch (err) {

    console.log('deleteProductById err', err)

    return res.status(STATUS_CODE.SERVER_ERROR).json({
      data: null,
      error: `SERVER_ERROR - ${err.message}`
    })

  }
}
