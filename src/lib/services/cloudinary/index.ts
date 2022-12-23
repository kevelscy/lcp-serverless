import { cloudinary } from 'config/cloudinary'

export const uploadResource = async ({ filePath, folderPath }: { filePath: string, folderPath: string }) => {
  return await cloudinary.uploader.upload(filePath, { folder: folderPath })
}

export const deleteResourceByPublicId = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId)
}
