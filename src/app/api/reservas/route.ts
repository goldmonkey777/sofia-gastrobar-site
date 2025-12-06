import { NextRequest, NextResponse } from 'next/server'
import { createReservation, getReservationsByDate } from '@/lib/db/mock'
import type { CreateReservationInput } from '@/lib/db/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.name || !body.email || !body.phone || !body.date || !body.time || !body.guests) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, email, phone, date, time, guests' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar número de pessoas
    const guests = parseInt(body.guests, 10)
    if (isNaN(guests) || guests < 1 || guests > 20) {
      return NextResponse.json(
        { error: 'Número de pessoas deve ser entre 1 e 20' },
        { status: 400 }
      )
    }

    // Validar data (deve ser futura)
    const reservationDate = new Date(body.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (reservationDate < today) {
      return NextResponse.json(
        { error: 'Data deve ser futura' },
        { status: 400 }
      )
    }

    const input: CreateReservationInput = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      date: body.date,
      time: body.time,
      guests,
      area: body.area,
      specialRequests: body.specialRequests?.trim(),
    }

    const reservation = await createReservation(input)

    // TODO: Enviar notificação WhatsApp via n8n
    // TODO: Enviar para ChefIApp OS

    return NextResponse.json({
      success: true,
      message: 'Reserva criada com sucesso!',
      reservation,
    })
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { error: 'Erro ao criar reserva', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')

    if (date) {
      const reservations = await getReservationsByDate(date)
      return NextResponse.json({
        success: true,
        date,
        reservations,
        count: reservations.length,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Use ?date=YYYY-MM-DD para buscar reservas de uma data específica',
    })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar reservas', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

