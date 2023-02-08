import dotenv from 'dotenv'

dotenv.config()

interface IConfig {
  PORT: string
  DB: {
    URI: string
  }
  JWT: {
    ACCESS_SECRET: string
    REFRESH_SECRET: string
  }
  CORS: {
    PROD: string[]
    DEV: string[]
  }
  CLOUDINARY: {
    CLOUD_NAME: string
    API_KEY: string
    API_SECRET: string
  },
  HTTP: {
    STATUS_CODE: {
      SUCCESSFUL: 200
      METHOD_NOT_ALLOWED: 405
      INCORRECT_CREDENTIALS: 401
      USER_NOT_FOUND: 404
      FIELDS_REQUIRED: 400
      CONFLICT_TO_CREATE_THIS_RESOURCE: 409
      CONFLICT_TO_UPDATE_THIS_RESOURCE: 409
      CONFLICT_TO_DELETE_THIS_RESOURCE: 409
      CONFLICT_TO_EDIT_THIS_RESOURCE: 409
      RESOURCE_ALREADY_EXIST: 409
      NOT_EXIST: 404
      REFRESH_TOKEN_REQUIRED: 400
      TOKEN_REQUIRED: 400
      SERVER_ERROR: 500
      NOT_FOUND: 404
    }
  }
}

export const config: IConfig = {
  PORT: process.env.PORT || '8000',
  DB: {
    URI: process.env.MONGO_DB_URI
  },
  JWT: {
    ACCESS_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET
  },
  CORS: {
    PROD: ['https://lcpcaracas.org', 'https://www.lcpcaracas.org', 'https://admin.lcpcaracas.org', 'https://www.admin.lcpcaracas.org', 'https://admin-dev.lcpcaracas.org', 'https://www.admin-dev.lcpcaracas.org'],
    DEV: ['http://localhost:3000']
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET
  },
  HTTP: {
    STATUS_CODE: {
      SUCCESSFUL: 200,
      METHOD_NOT_ALLOWED: 405,
      INCORRECT_CREDENTIALS: 401,
      USER_NOT_FOUND: 404,
      FIELDS_REQUIRED: 400,
      CONFLICT_TO_CREATE_THIS_RESOURCE: 409,
      CONFLICT_TO_UPDATE_THIS_RESOURCE: 409,
      CONFLICT_TO_DELETE_THIS_RESOURCE: 409,
      CONFLICT_TO_EDIT_THIS_RESOURCE: 409,
      RESOURCE_ALREADY_EXIST: 409,
      NOT_EXIST: 404,
      REFRESH_TOKEN_REQUIRED: 400,
      TOKEN_REQUIRED: 400,
      SERVER_ERROR: 500,
      NOT_FOUND: 404
    }
  }
}
