// import { youngReservationsDB } from 'services/firebase'
import type { NextApiRequest, NextApiResponse } from 'next'
// import fetch from 'node-fetch'

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//     const snapshot = await youngReservationsDB.get()
//     const usersReservations = await snapshot.docs.map(doc => {
//       return Object.values({
//         date: doc.data().date,
//         fullName: doc.data().fullName,
//         phone: doc.data().phone,
//         email: doc.data().email,
//         age: doc.data().age,
//         birth: doc.data().birth,
//         instagram: doc.data().instagram,
//       })
//     })

//     const sendReservationsToExcelRes = await fetch('https://enjy8lvy9j8xen5.m.pipedream.net',{
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({reservations: usersReservations})
//     })

//     if (!sendReservationsToExcelRes.ok) {
//       return res.status(500).json({
//         data: null,
//         error: 'Error al enviar las reservaciones a pipedream'
//       })
//     }

//     res.status(200).json({
//       data: 'Reservaciones registradas en pipedream!',
//       error: null
//     })

// }

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  res.redirect('/')
}

export default handle
