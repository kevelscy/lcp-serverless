import { slugify } from 'lib/utils/slugify'
import { firebaseBucket } from '.'

type TUploadFile = Promise<{
  data: {
    url: string,
    id: string
  },
  error: null | string
}>

interface IUploadFile {
  pathFile: string
  title: string
  root: string
  ext: string
}

export const uploadFile = async ({ pathFile, title, ext, root }: IUploadFile): TUploadFile => {
  try {

    const resBucket = await firebaseBucket.upload(
      pathFile,
      {
        public: true,
        destination: `${root}/${slugify(title)}${ext}`
      }
    )

    console.log('resBucket', resBucket)

    return {
      data: {
        url: resBucket[1].mediaLink,
        id: resBucket[0].id.replaceAll('%2F', '/')
      },
      error: null
    }

  } catch (err) {

    console.error('uploadFile err', err)

    return {
      data: null,
      error: `uploadFile Error - ${err?.message}`
    }

  }
}

type TDeleteFile = Promise<{ data: boolean | null, error: string | null }>

export const deleteFileById = async (id: string): TDeleteFile => {
  try {

    const resBucket = await firebaseBucket.file(id).delete()

    console.log('resBucket', resBucket[0].statusCode)

    return {
      data: resBucket[0].statusCode <= 399,
      error: null
    }

  } catch (err) {

    console.error('uploadFile err', err)

    return {
      data: null,
      error: `uploadFile Error - ${err?.message}`
    }

  }
}
