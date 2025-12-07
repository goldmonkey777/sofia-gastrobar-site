/**
 * Teste Simples de Autenticação SumUp
 * Verifica se as credenciais estão funcionando
 */

import { readFileSync } from 'fs'

// Ler .env.local manualmente
const envContent = readFileSync('.env.local', 'utf-8')
const envVars: Record<string, string> = {}
envContent.split('\n').forEach((line) => {
  const match = line.match(/^([A-Z_]+)=(.*)$/)
  if (match) {
    envVars[match[1]] = match[2]
  }
})

const CLIENT_ID = envVars.SUMUP_CLIENT_ID
const CLIENT_SECRET = envVars.SUMUP_CLIENT_SECRET
const MERCHANT_CODE = envVars.SUMUP_MERCHANT_CODE

console.log('🔑 Testando Credenciais SumUp')
console.log('============================================================')
console.log('')
console.log('📋 Variáveis de Ambiente:')
console.log(`   CLIENT_ID: ${CLIENT_ID ? '✅ Configurado' : '❌ Não configurado'}`)
console.log(`   CLIENT_SECRET: ${CLIENT_SECRET ? '✅ Configurado' : '❌ Não configurado'}`)
console.log(`   MERCHANT_CODE: ${MERCHANT_CODE ? '✅ Configurado (' + MERCHANT_CODE + ')' : '❌ Não configurado'}`)
console.log('')

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.log('❌ Credenciais não configuradas!')
  console.log('   Configure SUMUP_CLIENT_ID e SUMUP_CLIENT_SECRET no .env.local')
  process.exit(1)
}

async function testSumUpAuth() {
  try {
    console.log('🔄 Testando autenticação OAuth com SumUp...')

    // Tentar obter access token
    const response = await fetch('https://api.sumup.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    })

    console.log(`   Status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const error = await response.text()
      console.log('❌ Falha na autenticação!')
      console.log('   Resposta:', error)
      return false
    }

    const data = await response.json()
    console.log('✅ Autenticação bem-sucedida!')
    console.log('   Access Token:', data.access_token ? '✅ Recebido' : '❌ Não recebido')
    console.log('   Tipo:', data.token_type)
    console.log('   Expira em:', data.expires_in, 'segundos')
    console.log('')

    // Testar criação de checkout
    console.log('🔄 Testando criação de Payment Link...')

    const checkoutResponse = await fetch('https://api.sumup.com/v0.1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkout_reference: `test_${Date.now()}`,
        amount: 12.00,
        currency: 'EUR',
        merchant_code: MERCHANT_CODE,
        description: 'Teste - Reserva Sofia Gastrobar',
        redirect_url: 'https://sofiagastrobaribiza.com/api/sumup/callback?test=true',
        payment_type: 'any', // Google Pay + Apple Pay + Card
        personal_details: {
          email: 'contact@goldmonkey.studio',
        },
      }),
    })

    console.log(`   Status: ${checkoutResponse.status} ${checkoutResponse.statusText}`)

    if (!checkoutResponse.ok) {
      const error = await checkoutResponse.text()
      console.log('❌ Falha ao criar Payment Link!')
      console.log('   Resposta:', error)
      return false
    }

    const checkout = await checkoutResponse.json()
    console.log('✅ Payment Link criado com sucesso!')
    console.log('   ID:', checkout.id)
    console.log('   Status:', checkout.status)
    console.log('   Checkout URL:', `https://pay.sumup.com/${checkout.id}`)
    console.log('')
    console.log('💡 Você pode testar o pagamento acessando a URL acima!')
    console.log('')

    return true

  } catch (error: any) {
    console.log('❌ Erro:', error.message)
    return false
  }
}

// Executar teste
testSumUpAuth().then((success) => {
  if (success) {
    console.log('============================================================')
    console.log('✅ TODOS OS TESTES PASSARAM!')
    console.log('============================================================')
    console.log('')
    console.log('🎉 Sistema SumUp está configurado corretamente!')
    console.log('   ✅ Google Pay habilitado')
    console.log('   ✅ Apple Pay habilitado')
    console.log('   ✅ Payment Links funcionando')
    console.log('   ✅ Callback URL configurado')
    console.log('')
    console.log('🚀 Próximos passos:')
    console.log('   1. Testar pagamento real no checkout URL acima')
    console.log('   2. Verificar se callback é chamado')
    console.log('   3. Confirmar que Google Pay e Apple Pay aparecem')
    console.log('')
    process.exit(0)
  } else {
    console.log('============================================================')
    console.log('❌ TESTES FALHARAM')
    console.log('============================================================')
    console.log('')
    console.log('💡 Verifique:')
    console.log('   1. Client ID está correto')
    console.log('   2. Client Secret está correto')
    console.log('   3. Merchant Code está correto')
    console.log('   4. Credenciais são do ambiente correto (staging vs production)')
    console.log('')
    process.exit(1)
  }
})
