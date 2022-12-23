import { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'

import { uploadResource, deleteResourceByPublicId } from 'lib/services/cloudinary'
import { AuthorModel } from 'lib/db/models/Author'
import { PostModel } from 'lib/db/models/Post'

import { config } from 'config'

const { HTTP: { STATUS_CODE } } = config

export const getAllPosts = async (req: NextApiRequest, res: NextApiResponse) => {
  const allPosts = await PostModel.find().populate({
    path: 'author',
    populate: {
      path: 'user',
      model: 'User'
    }
  })

  return res.status(200).json({
    data: allPosts,
    error: null
  })
}

export const getPostById = async (req: NextApiRequest, res: NextApiResponse) => {
  const postId = req.query.id as string
  const postFinded = await PostModel.findById(postId).populate({
    path: 'author',
    populate: {
      path: 'user',
      model: 'User'
    }
  }).exec()

  if (!postFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  return res.status(200).json({
    data: postFinded,
    error: null
  })
}

export const createPost = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const postCreated = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) return res.status(500).json({
          data: null,
          error: 'CREATE_POST_FORMIDABLE_PARSE'
        })

        const { title, authorId, slug, content, type, category, published } = fields
        const image = files?.image as any || null
      
        if (!title || !authorId || !slug || !image || !content || !type || !category) {
          return res.status(config.HTTP.STATUS_CODE.FIELDS_REQUIRED)
            .json({ data: null, error: 'FIELDS_REQUIRED' })
        }
      
        const authorFinded = await AuthorModel.findById(authorId).exec()
      
        if (!authorFinded) {
          return res.status(STATUS_CODE.NOT_FOUND).json({
            data: null,
            error: 'AUTHOR_NOT_EXISTS'
          })
        }
      
        const imageUploaded = await uploadResource({ filePath: image?.tempFilePath, folderPath: 'posts' })
      
        const postToCreate = {
          title,
          slug,
          content,
          type,
          category,
          published: published === undefined ? false : published,
          author: authorFinded.id,
          image: {
            publicId: imageUploaded.public_id,
            url: imageUploaded.secure_url,
            width: imageUploaded.width,
            height: imageUploaded.height
          }
        }
      
        const postCreated = await PostModel.create(postToCreate)
      
        if (!postCreated) {
          return res.status(STATUS_CODE.CONFLICT_TO_CREATE_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_CREATE_THIS_RESOURCE'
          })
        }
      
        await authorFinded.updateOne({ $push: { posts: postCreated.id } })
      
        // remove temp local image file
        // await fs.unlink(image?.tempFilePath)
      
        return resolve(postCreated)
      })
    })

    return res.status(200).json({
      data: postCreated,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `CREATE_POST - ${JSON.stringify(err)}`
    })
  }
}

export const updatePostById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const postUpdated = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm()

      form.parse(req, async (formError, fields, files) => {
        if (formError) return res.status(500).json({
          data: null,
          error: 'CREATE_POST_FORMIDABLE_PARSE'
        })

        const postId = req.query.id
        const image = files?.image as any || null
        const { title, authorId, slug, content, type, category, published } = fields
      
        const postFinded = await PostModel.findById(postId).exec()
      
        if (!postFinded) {
          return res.status(STATUS_CODE.NOT_FOUND).json({
            data: null,
            error: 'NOT_FOUND'
          })
        }

        const imageUploaded = image ? await uploadResource({ filePath: image?.tempFilePath, folderPath: 'posts' }) : null

        // remove temp local image file
        // imageUploaded && await fs.unlink(image?.tempFilePath)

        const postToUpdate = {
          title: title || postFinded.title,
          slug: slug || postFinded.slug,
          content: content || postFinded.content,
          type: type || postFinded.type,
          category: category || postFinded.category,
          published: published || postFinded.published,
          author: authorId || postFinded.author,
          image: {
            publicId: imageUploaded ? imageUploaded.public_id : postFinded.image.publicId,
            url: imageUploaded ? imageUploaded.secure_url : postFinded.image.url,
            width: imageUploaded ? imageUploaded.width : postFinded.image.width,
            height: imageUploaded ? imageUploaded.height : postFinded.image.height
          }
        }

        const postUpdated = await postFinded.updateOne(postToUpdate)
      
        if (!postUpdated) {
          return res.status(STATUS_CODE.CONFLICT_TO_EDIT_THIS_RESOURCE).json({
            data: null,
            error: 'CONFLICT_TO_EDIT_THIS_RESOURCE'
          })
        }

        return resolve(postUpdated)
      })
    })

    return res.status(200).json({
      data: postUpdated,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `UPDATE_POST - ${JSON.stringify(err)}`
    })
  }
}

export const deletePostById = async (req: NextApiRequest, res: NextApiResponse) => {
  const postId = req.query.id as string
  const postDeleted = await PostModel.findByIdAndDelete(postId).exec()

  if (!postDeleted) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'NOT_FOUND'
    })
  }

  const { result } = await deleteResourceByPublicId(postDeleted.image.publicId)

  if (result !== 'ok') {
    console.error('user picture failed to delete')    
  }

  const authorFinded = await AuthorModel.findById(postDeleted.author).exec()

  if (!authorFinded) {
    return res.status(STATUS_CODE.NOT_FOUND).json({
      data: null,
      error: 'AUTHOR_NOT_EXISTS'
    })
  }

  await authorFinded.updateOne({ $pull: { devotionals: postDeleted.id } })

  return res.status(200).json({
    data: postDeleted,
    error: null
  })
}
