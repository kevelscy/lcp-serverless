import { NextApiRequest, NextApiResponse } from 'next'

import { RoleModel } from 'lib/db/models/Role'
import { UserModel } from 'lib/db/models/User'

import { config } from 'config'

const { HTTP: { STATUS_CODE } } = config

export const getAllRoles = async (req: NextApiRequest, res: NextApiResponse) => {
  const allRoles = await RoleModel.find()

  return res.status(200).json({
    data: allRoles,
    error: null
  })
}

export const getRoleById = async (req: NextApiRequest, res: NextApiResponse) => {
  const roleId = req.query.id as string
  const roleFinded = await RoleModel.findById(roleId).exec()

  if (!roleFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  return res.status(200).json({
    data: roleFinded,
    error: null
  })
}

export const upgradeUserRole = async (req: NextApiRequest, res: NextApiResponse) => {
  const roleId = req.query.id as string
  const { userId } = req.body

  if (!roleId || !userId) {
    return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
      .json({ data: null, error: 'FIELDS_REQUIRED' })
  }

  const roleFinded = await RoleModel.findById(roleId)

  if (!roleFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'ROLE_NOT_FOUND'
    })
  }

  const userFinded = await UserModel.findById(userId)

  if (!userFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'USER_NOT_FOUND'
    })
  }

  //  the user already has this role
  const isUserWithSameRole = userFinded.roles.some(role => role.id === roleFinded.id)

  if (isUserWithSameRole) {
    return res.status(STATUS_CODE.RESOURCE_ALREADY_EXIST).json({
      data: null,
      error: 'USER_ALREADY_HAS_THIS_ROLE'
    })
  }

  const userUpgraded = await userFinded.updateOne({ $push: { roles: roleFinded.id } })

  if (!userUpgraded) {
    return res.status(STATUS_CODE.CONFLICT_TO_UPDATE_THIS_RESOURCE).json({
      data: null,
      error: 'CONFLICT_TO_UPDATE_THIS_USER'
    })
  }

  const roleUpgrated = await roleFinded.updateOne({ $push: { users: userFinded.id } })

  if (!roleUpgrated) {
    return res.status(STATUS_CODE.CONFLICT_TO_UPDATE_THIS_RESOURCE).json({
      data: null,
      error: 'CONFLICT_TO_UPDATE_THIS_ROLE'
    })
  }

  return res.status(200).json({
    data: userUpgraded,
    error: null
  })
}

export const removeUserRole = async (req: NextApiRequest, res: NextApiResponse) => {
  const roleId = req.query.id as string
  const { userId } = req.body

  if (!roleId || !userId) {
    return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
      .json({ data: null, error: 'FIELDS_REQUIRED' })
  }

  const roleFinded = await RoleModel.findById(roleId)

  if (!roleFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'ROLE_NOT_FOUND'
    })
  }

  const userFinded = await UserModel.findById(userId)

  if (!userFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'USER_NOT_FOUND'
    })
  }

  //  the user already has'nt this role
  const isUserWithSameRole = userFinded.roles.some(role => role.id === roleFinded.id)

  if (!isUserWithSameRole) {
    return res.status(STATUS_CODE.RESOURCE_ALREADY_EXIST).json({
      data: null,
      error: 'USER_ALREADY_HAS_NOT_THIS_ROLE'
    })
  }

  const userUpgraded = await userFinded.updateOne({ $pull: { roles: roleFinded.id } })

  if (!userUpgraded) {
    return res.status(STATUS_CODE.CONFLICT_TO_UPDATE_THIS_RESOURCE).json({
      data: null,
      error: 'CONFLICT_TO_UPDATE_THIS_USER'
    })
  }

  const roleUpgrated = await roleFinded.updateOne({ $pull: { users: userFinded.id } })

  if (!roleUpgrated) {
    return res.status(STATUS_CODE.CONFLICT_TO_UPDATE_THIS_RESOURCE).json({
      data: null,
      error: 'CONFLICT_TO_UPDATE_THIS_ROLE'
    })
  }

  return res.status(200).json({
    data: userUpgraded,
    error: null
  })
}
