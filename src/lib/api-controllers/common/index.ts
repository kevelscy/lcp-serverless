import { NextApiRequest, NextApiResponse } from 'next'
import { ErrorHandler, NoMatchHandler } from 'next-connect'

export const onError: ErrorHandler<NextApiRequest, NextApiResponse> = async (err, req, res, next) => {
  console.error('onError', err)

  res.status(500).json({
    data: null,
    error: `ERROR_500_${JSON.stringify(err)}`
  })
}

export const onNoMatch: NoMatchHandler<NextApiRequest, NextApiResponse> = async (req, res) => {
  res.status(404).json({
    data: null,
    error: 'NOT_FOUND'
  })
}
