import { UserModel } from 'lib/db/models/User'
import 'lib/db/models/Role'

export const getAllUsers = async () => {
  try {

    const allUsers = await UserModel.find()
    return allUsers

  } catch (err) {

    console.error('getAllUsers Error', err)
    return []

  }
}

export const getUserById = async (_, { userId }) => {
  try {

    const userFinded = await UserModel.findById(userId).exec()
    return userFinded

  } catch (err) {

    console.error('getUserById Error', err)
    return []

  }
}

export const createUser = async (_, { picture }: { picture: File }) => {
  console.log('picture', picture)

  return true

  // try {
  //   const userCreated = await new Promise<any>((resolve, reject) => {
  //     const form = new IncomingForm()

  //     form.parse(req, async (formError, fields, files) => {
  //       if (formError) return res.status(500).json({
  //         data: null,
  //         error: 'CREATE_PRODUCT_FORMIDABLE_PARSE'
  //       })

  //       const {
  //         roles,
  //         firstName,
  //         lastName,
  //         email,
  //         password,
  //         phone,
  //         address,
  //         birthDate,
  //         profesion,
  //         // ministries,
  //         // orders,
  //         isDeleted
  //       } = fields

  //       if (!email || !password || !roles) {
  //         return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
  //           .json({ data: null, error: 'FIELDS_REQUIRED' })
  //       }

  //       const picture = files.picture as any || null
  //       const pictureUploaded = picture ? await uploadResource({ filePath: picture?.filepath, folderPath: 'users' }) : null

  //       // remove temp local image file
  //       // pictureUploaded && await fs.unlink(picture?.tempFilePath)

  //       const passwordHashed = await hash(password as string, 10)
  //       const roleUserFinded = await RoleModel.findOne({ title: ERole.USER })

  //       const pictureFormated = pictureUploaded
  //         ? {
  //           publicId: pictureUploaded.public_id,
  //           url: pictureUploaded.secure_url,
  //           width: pictureUploaded.width,
  //           height: pictureUploaded.height
  //         }
  //         : null

  //       console.log('pictureFormated', pictureFormated)

  //       const userCreated = await UserModel.create({
  //         email,
  //         password: passwordHashed,
  //         roles: [roleUserFinded.id],
  //         firstName: firstName || null,
  //         lastName: lastName || null,
  //         phone: phone || null,
  //         address: address || null,
  //         birthDate: birthDate || null,
  //         profesion: profesion || null,
  //         isDeleted: isDeleted || null,
  //         picture: pictureFormated,
  //         ministries: [],
  //         orders: []
  //       })

  //       if (!userCreated) {
  //         return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
  //           data: null,
  //           error: 'CONFLICT_TO_CREATE_THIS_RESOURCE'
  //         })
  //       }

  //       const roleUserUpdated = await roleUserFinded.updateOne({ $push: { users: userCreated.id } })

  //       if (!roleUserUpdated) {
  //         return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
  //           data: null,
  //           error: 'CONFLICT_TO_UPDATE_THIS_RESOURCE'
  //         })
  //       }

  //       return resolve(userCreated)
  //     })
  //   })

  //   return res.status(200).json({
  //     data: userCreated,
  //     error: null
  //   })

  // } catch (err) {

  //   console.error('createUser Error', err)
  //   return []

  // }
}