import { NextApiRequest, NextApiResponse } from 'next'

import { OrderModel } from 'lib/db/models/Order'
import { config } from 'config'

const { HTTP: { STATUS_CODE } } = config

export const getAllOrders = async (req: NextApiRequest, res: NextApiResponse) => {
  const allOrders = await OrderModel.find()

  return res.status(200).json({
    data: allOrders,
    error: null
  })
}

export const getOrderById = async (req: NextApiRequest, res: NextApiResponse) => {
  const orderId = req.query.id as string
  const orderFinded = await OrderModel.findById(orderId).exec()

  if (!orderFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  return res.status(200).json({
    data: orderFinded,
    error: null
  })
}

export const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { status, productsId, userId } = req.body

  if (!status || !productsId || !userId) {
    return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
      .json({ data: null, error: 'FIELDS_REQUIRED' })
  }

  const orderCreated = await OrderModel.create({
    status,
    products: productsId,
    user: userId
  })

  if (!orderCreated) {
    return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
      data: null,
      error: 'CONFLICT_TO_CREATE_THIS_RESOURCE'
    })
  }

  return res.status(200).json({
    data: orderCreated,
    error: null
  })
}

export const updateOrderById = async (req: NextApiRequest, res: NextApiResponse) => {
  const orderId = req.query.id as string
  const { status, productsId, userId } = req.body

  const orderFinded = await OrderModel.findById(orderId).exec()

  if (!orderFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  const orderUpdated = await OrderModel.findByIdAndUpdate(orderFinded.id, {
    status: status || orderFinded.status,
    user: userId || orderFinded.user,
    products: productsId?.lenght ? productsId : orderFinded.products
  }, { new: true })

  return res.status(200).json({
    data: orderUpdated,
    error: null
  })
}

export const pushProductToOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const orderId = req.query.id as string
  const { productId } = req.body

  console.log('productId', productId)
  console.log('orderId', orderId)

  const orderFinded = await OrderModel.findById(orderId).exec()
  console.log('orderFinded', orderFinded)

  if (!orderFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  const orderUpdated = await OrderModel.findByIdAndUpdate(orderFinded.id, {
    status: orderFinded.status,
    user: orderFinded.user,
    $push: { products: productId }
  }, { new: true })

  return res.status(200).json({
    data: orderUpdated,
    error: null
  })
}

export const deleteOrderById = async (req: NextApiRequest, res: NextApiResponse) => {
  const orderId = req.query.id as string
  const productCategoryDeleted = await OrderModel.findByIdAndDelete(orderId).exec()

  if (!productCategoryDeleted) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  return res.status(200).json({
    data: productCategoryDeleted,
    error: null
  })
}
