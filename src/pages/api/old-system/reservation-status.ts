import type { NextApiRequest, NextApiResponse } from 'next'
// import { updateDoc } from 'firebase/firestore'

// import { RESERVATION_STATUS_REF } from 'lib/services/firebase/utils/refs'

// interface CustomNextApiRequest extends NextApiRequest {
//   body: {
//     changeStatus: boolean
//   }
// }

// export default async (req: CustomNextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'POST') {
//     if (req.body.changeStatus === true) {
//       updateDoc(RESERVATION_STATUS_REF, { isActive: true })
//         .then(() => {
//           res.status(200).json({
//             message: 'Habilitando Reservaciones!',
//             body: req.body.changeStatus
//           })
//         })
//         .catch(() => {
//           res.status(500).json({
//             message: 'No se pudo actualizar el estado de las reservaciones.',
//             body: req.body.changeStatus
//           })
//         })
//     }

//     if (req.body.changeStatus === false) {
//       updateDoc(RESERVATION_STATUS_REF, { isActive: false })
//         .then(() => {
//           res.status(200).json({
//             message: 'Habilitando Reservaciones!',
//             body: req.body.changeStatus
//           })
//         })
//         .catch(() => {
//           res.status(500).json({
//             message: 'No se pudo actualizar el estado de las reservaciones.',
//             body: req.body.changeStatus
//           })
//         })
//       res.status(200).json({
//         message: 'Deshabilitando Reservaciones!',
//         body: req.body.changeStatus
//       })
//     }
//   } else {
//     res.status(500).json({
//       message: 'Request not Aviable',
//       body: req.body
//     })
//   }
// }

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  res.redirect('/')
}

export default handle
