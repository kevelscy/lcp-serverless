import { NextApiRequest, NextApiResponse } from 'next'

export type THandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>
export type TMiddleware = (handler: THandler) => (req: NextApiRequest, res: NextApiResponse) => Promise<void>
