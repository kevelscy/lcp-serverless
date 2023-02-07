import { NextApiRequest, NextApiResponse } from 'next'

import { ProductCategoryModel } from 'lib/db/models/ProductCategory'
import { ProductModel } from 'lib/db/models/Product'

import { config } from 'config'

const { HTTP: { STATUS_CODE } } = config

export const getAllProductCategories = async (req: NextApiRequest, res: NextApiResponse) => {
  const allProductCategories = await ProductCategoryModel.find({ slug: { $ne: 'default' } }).populate('products') // exclude category default

  return res.status(200).json({
    data: allProductCategories,
    error: null
  })
}

export const getProductCategoryById = async (req: NextApiRequest, res: NextApiResponse) => {
  const productCategoryId = req.query.id
  const productCategoryFinded = await ProductCategoryModel.findById(productCategoryId).populate('products')

  if (!productCategoryFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  return res.status(200).json({
    data: productCategoryFinded,
    error: null
  })
}

export const createProductCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, description, slug } = req.body

  if (!title || !description || !slug) {
    return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
      .json({ data: null, error: 'FIELDS_REQUIRED' })
  }

  const productCategoryCreated = await ProductCategoryModel.create({
    title,
    description: description || '',
    slug,
    products: []
  })

  if (!productCategoryCreated) {
    return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
      data: null,
      error: 'CONFLICT_TO_CREATE_THIS_RESOURCE'
    })
  }

  return res.status(200).json({
    data: productCategoryCreated,
    error: null
  })
}

export const updateProductCategoryById = async (req: NextApiRequest, res: NextApiResponse) => {
  const productCategoryId = req.query.id
  const { title, description, slug } = req.body

  const productCategoryFinded = await ProductCategoryModel.findById(productCategoryId).exec()

  if (!productCategoryFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  const productToUpdate = {
    title: title || productCategoryFinded.title,
    description: description || productCategoryFinded.description,
    slug: slug || productCategoryFinded.slug
  }

  const productUpdated = await productCategoryFinded.updateOne(productToUpdate)

  if (!productUpdated) {
    return res.status(STATUS_CODE.CONFLICT_TO_EDIT_THIS_RESOURCE).json({
      data: null,
      error: 'CONFLICT_TO_EDIT_THIS_RESOURCE'
    })
  }

  return res.status(200).json({
    data: productToUpdate,
    error: null
  })
}

export const pushProductToCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const productCategoryId = req.query.id
    const { productId } = req.body

    const productCategoryFinded = await ProductCategoryModel.findById(productCategoryId).exec()

    if (!productCategoryFinded) {
      return res.status(STATUS_CODE.NOT_FOUND).json({
        data: null,
        error: 'PRODUCT_CATEGORY_NOT_FOUND'
      })
    }

    const productUpdated = await ProductModel.findByIdAndUpdate(
      productId, { $set: { category: productCategoryFinded.id } },
      { new: true }
    )

    if (!productUpdated) {
      return res.status(STATUS_CODE.CONFLICT_TO_EDIT_THIS_RESOURCE).json({
        data: null,
        error: 'PRODUCT_CONFLICT_TO_EDIT_THIS_RESOURCE'
      })
    }

    const productCategoryUpdated = await ProductCategoryModel.findByIdAndUpdate(
      productCategoryFinded.id,
      { $push: { products: productUpdated.id } },
      { new: true }
    )

    if (!productCategoryUpdated) {
      return res.status(STATUS_CODE.CONFLICT_TO_EDIT_THIS_RESOURCE).json({
        data: null,
        error: 'PRODUCT_CATEGORY_CONFLICT_TO_EDIT_THIS_RESOURCE'
      })
    }

    return res.status(200).json({
      data: productCategoryUpdated,
      error: null
    })
  } catch (err) {
    console.log('pushProductToCategory err', err)

    return res.status(STATUS_CODE.SERVER_ERROR).json({
      data: null,
      error: `SERVER_ERROR - ${err.message}`
    })
  }
}

export const removeProductOfCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const productCategoryId = req.query.id
    const { productId } = req.body

    const productCategoryFinded = await ProductCategoryModel.findById(productCategoryId).exec()

    if (!productCategoryFinded) {
      return res.status(STATUS_CODE.NOT_FOUND).json({
        data: null,
        error: 'PRODUCT_CATEGORY_NOT_FOUND'
      })
    }

    const productCategoryDefaultFinded = await ProductCategoryModel.findOne({ slug: 'default' })

    const productUpdated = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: { category: productCategoryDefaultFinded.id } },
      { new: true }
    )

    if (!productUpdated) {
      return res.status(STATUS_CODE.CONFLICT_TO_EDIT_THIS_RESOURCE).json({
        data: null,
        error: 'PRODUCT_CONFLICT_TO_EDIT_THIS_RESOURCE'
      })
    }

    const productCategoryUpdated = await ProductCategoryModel.findByIdAndUpdate(
      productCategoryFinded.id,
      { $pull: { products: productUpdated.id } },
      { new: true }
    )

    if (!productUpdated) {
      return res.status(STATUS_CODE.CONFLICT_TO_EDIT_THIS_RESOURCE).json({
        data: null,
        error: 'PRODUCT_CATEGORY_CONFLICT_TO_EDIT_THIS_RESOURCE'
      })
    }

    return res.status(200).json({
      data: productCategoryUpdated,
      error: null
    })
  } catch (err) {
    console.log('pushProductToCategory err', err)

    return res.status(STATUS_CODE.SERVER_ERROR).json({
      data: null,
      error: `SERVER_ERROR - ${err.message}`
    })
  }
}

export const deleteProductCategoryById = async (req: NextApiRequest, res: NextApiResponse) => {
  const productCategoryId = req.query.id
  const productCategoryDeleted = await ProductCategoryModel.findByIdAndDelete(productCategoryId).exec()

  if (!productCategoryDeleted) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  const productCategoryDefaultFinded = await ProductCategoryModel.findOne({ slug: 'default' })

  const productsUpdated = await ProductModel.updateMany(
    { category: productCategoryDeleted.id },
    { $set: { category: productCategoryDefaultFinded.id } }
  )

  if (!productsUpdated) {
    return res.status(STATUS_CODE.CONFLICT_TO_EDIT_THIS_RESOURCE).json({
      data: null,
      error: 'PRODUCTS_CONFLICT_TO_EDIT_THIS_RESOURCES'
    })
  }

  return res.status(200).json({
    data: productCategoryDeleted,
    error: null
  })
}
