import { BannerModel } from 'lib/db/models/Banner'

export const getAllBanners = async () => {
  try {

    const allUsers = await BannerModel.find()
    return allUsers

  } catch (err) {

    console.error('getAllUsers Error', err)
    return []

  }
}

export const getBannerById = async (_, { bannerId }) => {
  try {

    const userFinded = await BannerModel.findById(bannerId).exec()
    return userFinded

  } catch (err) {

    console.error('getUserById Error', err)
    return []

  }
}