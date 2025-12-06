import { NextRequest, NextResponse } from 'next/server'
import {
  createCustomer,
  getCustomerByPhone,
  getCustomerByEmail,
  addCustomerPoints,
  incrementCustomerVisits,
} from '@/lib/db/mock'
import type { CreateCustomerInput } from '@/lib/db/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.name || !body.email || !body.phone || !body.language) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, email, phone, language' },
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

    // Validar idioma
    const validLanguages = ['pt', 'es', 'en']
    if (!validLanguages.includes(body.language)) {
      return NextResponse.json(
        { error: `Idioma inválido. Idiomas válidos: ${validLanguages.join(', ')}` },
        { status: 400 }
      )
    }

    // Verificar se já existe cliente com este telefone ou email
    const existingByPhone = await getCustomerByPhone(body.phone.trim())
    const existingByEmail = await getCustomerByEmail(body.email.trim().toLowerCase())

    if (existingByPhone || existingByEmail) {
      const existing = existingByPhone || existingByEmail
      return NextResponse.json({
        success: true,
        message: 'Cliente já cadastrado no Clube Sofia!',
        customer: existing,
        isNew: false,
      })
    }

    const input: CreateCustomerInput = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      language: body.language,
      consentMarketing: body.consentMarketing || false,
      consentTerms: body.consentTerms || false,
    }

    const customer = await createCustomer(input)

    // Adicionar pontos de boas-vindas
    await addCustomerPoints(customer.id, 10)

    // TODO: Enviar mensagem de boas-vindas via WhatsApp (n8n)
    // TODO: Adicionar tags iniciais baseadas em preferências
    // TODO: Integrar com CRM externo

    return NextResponse.json({
      success: true,
      message: 'Cadastro realizado com sucesso! Bem-vindo ao Clube Sofia!',
      customer,
      isNew: true,
      welcomePoints: 10,
    })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Erro ao criar cadastro', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const phone = searchParams.get('phone')
    const email = searchParams.get('email')

    if (phone) {
      const customer = await getCustomerByPhone(phone)
      if (!customer) {
        return NextResponse.json(
          { error: 'Cliente não encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        customer,
      })
    }

    if (email) {
      const customer = await getCustomerByEmail(email)
      if (!customer) {
        return NextResponse.json(
          { error: 'Cliente não encontrado' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        customer,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Use ?phone=PHONE ou ?email=EMAIL para buscar um cliente',
    })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar cliente', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, action, value } = body

    if (!customerId || !action) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: customerId, action' },
        { status: 400 }
      )
    }

    let customer

    switch (action) {
      case 'addPoints':
        if (typeof value !== 'number' || value <= 0) {
          return NextResponse.json(
            { error: 'value deve ser um número positivo' },
            { status: 400 }
          )
        }
        customer = await addCustomerPoints(customerId, value)
        if (!customer) {
          return NextResponse.json(
            { error: 'Cliente não encontrado' },
            { status: 404 }
          )
        }
        return NextResponse.json({
          success: true,
          message: `Pontos adicionados: ${value}`,
          customer,
        })

      case 'incrementVisits':
        customer = await incrementCustomerVisits(customerId)
        if (!customer) {
          return NextResponse.json(
            { error: 'Cliente não encontrado' },
            { status: 404 }
          )
        }
        return NextResponse.json({
          success: true,
          message: 'Visita registrada',
          customer,
        })

      default:
        return NextResponse.json(
          { error: `Ação inválida. Ações válidas: addPoints, incrementVisits` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar cliente', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

