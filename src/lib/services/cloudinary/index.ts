import { cloudinary } from 'config/cloudinary'

export const uploadResource = async ({ filePath, folderPath, publicId }: { filePath: string, folderPath: string, publicId?: string }) => {
  if (publicId) {
    return await cloudinary.uploader.upload(filePath, { folder: folderPath, public_id: publicId })
  } else {
    return await cloudinary.uploader.upload(filePath, { folder: folderPath })
  }
}

export const deleteResourceByPublicId = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId)
}
