import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

import { firebaseStore } from 'lib/services/firebase'

const handleBautizos = async (req: NextApiRequest, res: NextApiResponse) => {
  const usersReservationSnapshot = await firebaseStore.collection('events/bautizos/usersReservation').get()

  const usersReservations = usersReservationSnapshot.docs.map(doc => {
    return Object.values({
      date: doc.data().date,
      fullName: doc.data().fullName,
      phone: doc.data().phone,
      email: doc.data().email,
      zone: doc.data().zone,
      dateBirth: doc.data().dateBirth,
      civilState: doc.data().civilState,
      profestion: doc.data().profestion,
      timeConverted: doc.data().timeConverted,
      lcpAsisted: doc.data().lcpAsisted
    })
  })

  const sendReservationsToExcelRes = await fetch('https://en6d9u19uybfzdn.m.pipedream.net', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ reservations: usersReservations })
  })

  if (!sendReservationsToExcelRes.ok) {
    return res.status(500).json({
      data: null,
      error: 'Error al enviar las reservaciones a pipedream'
    })
  }

  res.status(200).json({
    data: 'Reservaciones registradas en pipedream!',
    error: null
  })
}

export default handleBautizos
