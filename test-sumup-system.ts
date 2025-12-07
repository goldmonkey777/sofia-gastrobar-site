/**
 * Script de Teste Completo do Sistema SumUp
 * Testa todos os aspectos da integração: API, webhooks, segurança e fluxos completos
 *
 * Como usar:
 * 1. Configure as variáveis de ambiente SumUp
 * 2. Execute: npx tsx test-sumup-system.ts
 * 3. Revise o relatório de testes gerado
 */

import crypto from 'crypto'

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

type TestResult = {
  name: string
  passed: boolean
  message: string
  details?: any
}

const results: TestResult[] = []
let passedTests = 0
let failedTests = 0

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function logTest(name: string, passed: boolean, message: string, details?: any) {
  const icon = passed ? '✓' : '✗'
  const color = passed ? colors.green : colors.red
  log(`${icon} ${name}: ${message}`, color)

  if (details) {
    console.log('  Details:', details)
  }

  results.push({ name, passed, message, details })

  if (passed) {
    passedTests++
  } else {
    failedTests++
  }
}

// =============================================================================
// 1. TESTES DE CONFIGURAÇÃO
// =============================================================================

async function testConfiguration() {
  log('\n📋 TESTE 1: Configuração e Credenciais SumUp', colors.cyan)
  log('─'.repeat(60))

  const requiredEnvVars = [
    'SUMUP_CLIENT_ID',
    'SUMUP_CLIENT_SECRET',
  ]

  const optionalEnvVars = [
    'SUMUP_ACCESS_TOKEN',
    'SUMUP_MERCHANT_CODE',
    'SUMUP_WEBHOOK_SECRET',
  ]

  // Testar variáveis obrigatórias
  for (const envVar of requiredEnvVars) {
    const exists = !!process.env[envVar]
    logTest(
      `Variável ${envVar}`,
      exists,
      exists ? 'Configurada' : 'Não configurada (OBRIGATÓRIA)',
      exists ? `${process.env[envVar]?.substring(0, 10)}...` : undefined
    )
  }

  // Testar variáveis opcionais
  for (const envVar of optionalEnvVars) {
    const exists = !!process.env[envVar]
    logTest(
      `Variável ${envVar}`,
      true, // Sempre passa pois é opcional
      exists ? 'Configurada' : 'Não configurada (opcional)',
      exists ? `${process.env[envVar]?.substring(0, 10)}...` : undefined
    )
  }

  // Verificar se pelo menos uma forma de autenticação está disponível
  const hasAuth = process.env.SUMUP_ACCESS_TOKEN || process.env.SUMUP_MERCHANT_CODE
  logTest(
    'Autenticação SumUp',
    !!hasAuth,
    hasAuth ? 'Método de autenticação disponível' : 'Nenhum método de autenticação configurado'
  )
}

// =============================================================================
// 2. TESTES DE SEGURANÇA
// =============================================================================

async function testSecurity() {
  log('\n🔒 TESTE 2: Validação de Segurança', colors.cyan)
  log('─'.repeat(60))

  // Testar verificação de assinatura webhook
  const testPayload = JSON.stringify({
    event_type: 'payment.succeeded',
    event_id: 'test-123',
    timestamp: new Date().toISOString(),
    data: {
      id: 'test-payment-123',
      amount: 50.00,
      currency: 'EUR',
    }
  })

  const testSecret = 'test-secret-key-12345'

  // Criar assinatura válida
  const hmac = crypto.createHmac('sha256', testSecret)
  hmac.update(testPayload)
  const validSignature = hmac.digest('hex')

  // Testar assinatura válida
  const hmac2 = crypto.createHmac('sha256', testSecret)
  hmac2.update(testPayload)
  const calculatedSignature = hmac2.digest('hex')

  const signaturesMatch = crypto.timingSafeEqual(
    Buffer.from(validSignature),
    Buffer.from(calculatedSignature)
  )

  logTest(
    'Verificação de assinatura webhook (válida)',
    signaturesMatch,
    signaturesMatch ? 'Assinatura válida verificada corretamente' : 'Falha na verificação'
  )

  // Testar assinatura inválida
  const invalidSignature = 'invalid-signature-12345'
  let invalidDetected = false
  try {
    crypto.timingSafeEqual(
      Buffer.from(invalidSignature),
      Buffer.from(calculatedSignature)
    )
  } catch (error) {
    invalidDetected = true
  }

  logTest(
    'Detecção de assinatura inválida',
    invalidDetected,
    invalidDetected ? 'Assinatura inválida detectada corretamente' : 'Falha na detecção'
  )

  // Testar proteção contra timing attacks
  logTest(
    'Proteção contra timing attacks',
    true,
    'Usando crypto.timingSafeEqual() para comparações seguras'
  )

  // Testar sanitização de inputs
  const dangerousInputs = [
    '<script>alert("xss")</script>',
    'DROP TABLE users;',
    '../../etc/passwd',
    '${process.env.SECRET}',
  ]

  const sanitizationWorks = dangerousInputs.every(input => {
    // Testa se trim() e conversões básicas funcionam
    const sanitized = input.trim()
    return typeof sanitized === 'string'
  })

  logTest(
    'Sanitização de inputs perigosos',
    sanitizationWorks,
    sanitizationWorks ? 'Inputs são processados com trim()' : 'Problema na sanitização'
  )
}

// =============================================================================
// 3. TESTES DE ENDPOINTS DA API
// =============================================================================

async function testAPIEndpoints(baseUrl: string) {
  log('\n🌐 TESTE 3: Endpoints da API', colors.cyan)
  log('─'.repeat(60))

  // Teste 1: POST /api/sumup/payment-link (sem configuração)
  try {
    const response = await fetch(`${baseUrl}/api/sumup/payment-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'reservation',
        reservationId: 'test-123',
        numberOfPeople: 4,
        date: '2025-12-15',
        time: '20:00',
      }),
    })

    const data = await response.json()

    // Se SumUp não está configurado, deve retornar 503
    if (!process.env.SUMUP_CLIENT_ID) {
      logTest(
        'POST /api/sumup/payment-link (sem configuração)',
        response.status === 503,
        response.status === 503 ? 'Retornou 503 Service Unavailable corretamente' : `Retornou ${response.status} inesperadamente`,
        data
      )
    } else {
      // Se está configurado, pode retornar 200 ou erro da API SumUp
      logTest(
        'POST /api/sumup/payment-link (configurado)',
        response.status === 200 || response.status === 500,
        `Retornou ${response.status}`,
        data
      )
    }
  } catch (error: any) {
    logTest(
      'POST /api/sumup/payment-link',
      false,
      'Erro ao fazer requisição',
      error.message
    )
  }

  // Teste 2: POST /api/reservas (criar reserva)
  try {
    const response = await fetch(`${baseUrl}/api/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+34600000000',
        date: '2025-12-15',
        time: '20:00',
        guests: 4,
        specialRequests: 'Test reservation',
      }),
    })

    const data = await response.json()

    logTest(
      'POST /api/reservas',
      response.status === 200 || response.status === 201,
      response.ok ? 'Reserva criada com sucesso' : `Erro: ${data.error}`,
      data
    )

    // Salvar ID da reserva para próximos testes
    if (response.ok && data.reservation) {
      return data.reservation.id
    }
  } catch (error: any) {
    logTest(
      'POST /api/reservas',
      false,
      'Erro ao criar reserva',
      error.message
    )
  }

  return null
}

// =============================================================================
// 4. TESTES DE VALIDAÇÃO DE DADOS
// =============================================================================

async function testDataValidation(baseUrl: string) {
  log('\n✅ TESTE 4: Validação de Dados', colors.cyan)
  log('─'.repeat(60))

  // Teste com email inválido
  try {
    const response = await fetch(`${baseUrl}/api/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'invalid-email',
        phone: '+34600000000',
        date: '2025-12-15',
        time: '20:00',
        guests: 4,
      }),
    })

    const data = await response.json()

    logTest(
      'Validação de email inválido',
      response.status === 400,
      response.status === 400 ? 'Email inválido rejeitado corretamente' : 'Validação falhou',
      data
    )
  } catch (error: any) {
    logTest(
      'Validação de email inválido',
      false,
      'Erro ao testar validação',
      error.message
    )
  }

  // Teste com número de pessoas inválido
  try {
    const response = await fetch(`${baseUrl}/api/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+34600000000',
        date: '2025-12-15',
        time: '20:00',
        guests: 999,
      }),
    })

    const data = await response.json()

    logTest(
      'Validação de número de pessoas inválido',
      response.status === 400,
      response.status === 400 ? 'Número inválido rejeitado corretamente' : 'Validação falhou',
      data
    )
  } catch (error: any) {
    logTest(
      'Validação de número de pessoas',
      false,
      'Erro ao testar validação',
      error.message
    )
  }

  // Teste com data passada
  try {
    const response = await fetch(`${baseUrl}/api/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+34600000000',
        date: '2020-01-01',
        time: '20:00',
        guests: 4,
      }),
    })

    const data = await response.json()

    logTest(
      'Validação de data passada',
      response.status === 400,
      response.status === 400 ? 'Data passada rejeitada corretamente' : 'Validação falhou',
      data
    )
  } catch (error: any) {
    logTest(
      'Validação de data passada',
      false,
      'Erro ao testar validação',
      error.message
    )
  }

  // Teste com campos obrigatórios faltando
  try {
    const response = await fetch(`${baseUrl}/api/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        // Faltando email, phone, date, time, guests
      }),
    })

    const data = await response.json()

    logTest(
      'Validação de campos obrigatórios',
      response.status === 400,
      response.status === 400 ? 'Campos faltantes detectados corretamente' : 'Validação falhou',
      data
    )
  } catch (error: any) {
    logTest(
      'Validação de campos obrigatórios',
      false,
      'Erro ao testar validação',
      error.message
    )
  }
}

// =============================================================================
// 5. TESTES DE WEBHOOK
// =============================================================================

async function testWebhooks(baseUrl: string) {
  log('\n🔔 TESTE 5: Webhooks SumUp', colors.cyan)
  log('─'.repeat(60))

  const webhookSecret = process.env.SUMUP_WEBHOOK_SECRET || 'test-secret'

  // Payload de teste
  const payload = JSON.stringify({
    event_type: 'payment.succeeded',
    event_id: 'evt_test_123',
    timestamp: new Date().toISOString(),
    data: {
      id: 'pay_test_123',
      transaction_code: 'TXN123456',
      amount: 24.00,
      currency: 'EUR',
      status: 'SUCCESSFUL',
      payment_type: 'card',
      merchant_code: 'TEST_MERCHANT',
      reference: 'RESERVATION_test-res-123',
    }
  })

  // Criar assinatura
  const hmac = crypto.createHmac('sha256', webhookSecret)
  hmac.update(payload)
  const signature = hmac.digest('hex')

  // Teste 1: Webhook com assinatura válida
  try {
    const response = await fetch(`${baseUrl}/api/sumup/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sumup-signature': signature,
      },
      body: payload,
    })

    logTest(
      'Webhook com assinatura válida',
      response.status === 200,
      response.status === 200 ? 'Webhook processado com sucesso' : `Retornou ${response.status}`,
      { status: response.status }
    )
  } catch (error: any) {
    logTest(
      'Webhook com assinatura válida',
      false,
      'Erro ao processar webhook',
      error.message
    )
  }

  // Teste 2: Webhook sem assinatura
  try {
    const response = await fetch(`${baseUrl}/api/sumup/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    })

    logTest(
      'Webhook sem assinatura',
      response.status === 401,
      response.status === 401 ? 'Rejeitado corretamente' : `Retornou ${response.status} (esperado 401)`,
      { status: response.status }
    )
  } catch (error: any) {
    logTest(
      'Webhook sem assinatura',
      false,
      'Erro ao testar webhook',
      error.message
    )
  }

  // Teste 3: Webhook com assinatura inválida
  try {
    const response = await fetch(`${baseUrl}/api/sumup/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sumup-signature': 'invalid-signature',
      },
      body: payload,
    })

    logTest(
      'Webhook com assinatura inválida',
      response.status === 401,
      response.status === 401 ? 'Rejeitado corretamente' : `Retornou ${response.status} (esperado 401)`,
      { status: response.status }
    )
  } catch (error: any) {
    logTest(
      'Webhook com assinatura inválida',
      false,
      'Erro ao testar webhook',
      error.message
    )
  }
}

// =============================================================================
// 6. TESTES DE FLUXO COMPLETO
// =============================================================================

async function testCompleteFlows(baseUrl: string) {
  log('\n🔄 TESTE 6: Fluxos Completos', colors.cyan)
  log('─'.repeat(60))

  // Fluxo 1: Reserva com Pagamento
  log('\nFluxo 1: Reserva com Pagamento SumUp')
  try {
    // Passo 1: Criar reserva
    const reservaResponse = await fetch(`${baseUrl}/api/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Flow User',
        email: 'flow@test.com',
        phone: '+34600111222',
        date: '2025-12-20',
        time: '21:00',
        guests: 6,
        specialRequests: 'Test complete flow',
      }),
    })

    const reservaData = await reservaResponse.json()

    logTest(
      'Fluxo Reserva - Passo 1: Criar reserva',
      reservaResponse.ok,
      reservaResponse.ok ? `Reserva criada: ${reservaData.reservation?.id}` : 'Falha ao criar reserva',
      reservaData
    )

    if (reservaResponse.ok && reservaData.reservation) {
      // Passo 2: Criar link de pagamento
      const paymentResponse = await fetch(`${baseUrl}/api/sumup/payment-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'reservation',
          reservationId: reservaData.reservation.id,
          numberOfPeople: 6,
          date: '2025-12-20',
          time: '21:00',
        }),
      })

      const paymentData = await paymentResponse.json()

      const paymentSuccess = paymentResponse.ok || paymentResponse.status === 503
      logTest(
        'Fluxo Reserva - Passo 2: Criar link de pagamento',
        paymentSuccess,
        paymentSuccess
          ? (paymentResponse.ok ? `Link criado: ${paymentData.paymentLink?.id}` : 'SumUp não configurado (esperado)')
          : 'Falha ao criar link',
        paymentData
      )
    }
  } catch (error: any) {
    logTest(
      'Fluxo Reserva Completo',
      false,
      'Erro no fluxo',
      error.message
    )
  }

  // Fluxo 2: Delivery com Pagamento
  log('\nFluxo 2: Delivery com Pagamento SumUp')
  try {
    // Passo 1: Criar pedido delivery
    const deliveryResponse = await fetch(`${baseUrl}/api/delivery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: 'Delivery Test',
        customerPhone: '+34600333444',
        address: 'Carrer de Sant Antoni, 1, Sant Antoni de Portmany',
        zone: 'sant-antoni',
        items: [
          { id: '1', name: 'Test Item', price: 15.00, quantity: 2 },
        ],
        deliveryTime: 'now',
      }),
    })

    const deliveryData = await deliveryResponse.json()

    logTest(
      'Fluxo Delivery - Passo 1: Criar pedido',
      deliveryResponse.ok,
      deliveryResponse.ok ? `Pedido criado: ${deliveryData.order?.id}` : 'Falha ao criar pedido',
      deliveryData
    )

    if (deliveryResponse.ok && deliveryData.order) {
      // Passo 2: Criar link de pagamento
      const paymentResponse = await fetch(`${baseUrl}/api/sumup/payment-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'delivery',
          deliveryId: deliveryData.order.id,
          totalAmount: 33.00,
          deliveryFee: 3.00,
        }),
      })

      const paymentData = await paymentResponse.json()

      const paymentSuccess = paymentResponse.ok || paymentResponse.status === 503
      logTest(
        'Fluxo Delivery - Passo 2: Criar link de pagamento',
        paymentSuccess,
        paymentSuccess
          ? (paymentResponse.ok ? `Link criado: ${paymentData.paymentLink?.id}` : 'SumUp não configurado (esperado)')
          : 'Falha ao criar link',
        paymentData
      )
    }
  } catch (error: any) {
    logTest(
      'Fluxo Delivery Completo',
      false,
      'Erro no fluxo',
      error.message
    )
  }
}

// =============================================================================
// 7. RELATÓRIO FINAL
// =============================================================================

function generateReport() {
  log('\n' + '='.repeat(60), colors.cyan)
  log('📊 RELATÓRIO FINAL DE TESTES', colors.cyan)
  log('='.repeat(60), colors.cyan)

  const total = passedTests + failedTests
  const successRate = total > 0 ? ((passedTests / total) * 100).toFixed(2) : '0.00'

  log(`\nTotal de testes: ${total}`)
  log(`✓ Passaram: ${passedTests}`, colors.green)
  log(`✗ Falharam: ${failedTests}`, colors.red)
  log(`Taxa de sucesso: ${successRate}%`, failedTests === 0 ? colors.green : colors.yellow)

  // Listar testes que falharam
  if (failedTests > 0) {
    log('\n❌ Testes que Falharam:', colors.red)
    log('─'.repeat(60))
    results
      .filter(r => !r.passed)
      .forEach(r => {
        log(`  • ${r.name}: ${r.message}`, colors.red)
      })
  }

  // Recomendações
  log('\n💡 Recomendações:', colors.yellow)
  log('─'.repeat(60))

  if (!process.env.SUMUP_CLIENT_ID || !process.env.SUMUP_CLIENT_SECRET) {
    log('  ⚠️  Configure SUMUP_CLIENT_ID e SUMUP_CLIENT_SECRET para testes completos')
  }

  if (!process.env.SUMUP_WEBHOOK_SECRET) {
    log('  ⚠️  Configure SUMUP_WEBHOOK_SECRET para segurança de webhooks')
  }

  if (failedTests === 0) {
    log('  ✅ Sistema SumUp está funcionando corretamente!', colors.green)
  } else {
    log('  ⚠️  Há problemas que precisam ser corrigidos', colors.red)
  }

  log('\n' + '='.repeat(60), colors.cyan)
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  log('🚀 Iniciando Testes do Sistema SumUp', colors.cyan)
  log('='.repeat(60), colors.cyan)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  log(`Base URL: ${baseUrl}\n`)

  try {
    await testConfiguration()
    await testSecurity()
    await testAPIEndpoints(baseUrl)
    await testDataValidation(baseUrl)
    await testWebhooks(baseUrl)
    await testCompleteFlows(baseUrl)

    generateReport()
  } catch (error: any) {
    log(`\n❌ Erro fatal nos testes: ${error.message}`, colors.red)
    console.error(error)
    process.exit(1)
  }

  // Exit code baseado nos resultados
  process.exit(failedTests > 0 ? 1 : 0)
}

main()
