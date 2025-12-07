/**
 * SumUp Mobile Deep Links
 * Suporte para iOS URL Scheme e Android App Links
 *
 * Referência: https://github.com/sumup/sumup-ios-url-scheme
 */

export interface SumUpMobilePaymentParams {
  amount: number
  currency?: string
  title?: string
  callbackSuccess?: string
  callbackFail?: string
  receiptEmail?: string
  receiptPhone?: string
  foreignTxId?: string
  skipScreenSuccess?: boolean
}

/**
 * Detecta se o usuário está em iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false

  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

/**
 * Detecta se o usuário está em Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false

  return /Android/.test(navigator.userAgent)
}

/**
 * Detecta se está em mobile (iOS ou Android)
 */
export function isMobile(): boolean {
  return isIOS() || isAndroid()
}

/**
 * Verifica se o app SumUp está instalado (iOS)
 * Nota: Não é 100% confiável devido a limitações de privacidade do iOS
 */
export function isSumUpAppInstalled(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isIOS()) {
      resolve(false)
      return
    }

    // Tentar abrir URL Scheme com timeout
    const timeout = setTimeout(() => {
      resolve(false)
    }, 1000)

    // Criar iframe invisível para testar
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = 'sumupmerchant://ping'

    document.body.appendChild(iframe)

    // Se conseguir abrir, o app está instalado
    window.addEventListener('blur', () => {
      clearTimeout(timeout)
      resolve(true)
      document.body.removeChild(iframe)
    }, { once: true })
  })
}

/**
 * Cria URL Scheme para iOS SumUp App
 *
 * Exemplo: sumupmerchant://pay/1.0?amount=10.00&currency=EUR&affiliate-key=KEY
 */
export function createIOSDeepLink(params: SumUpMobilePaymentParams): string {
  const affiliateKey = process.env.NEXT_PUBLIC_SUMUP_AFFILIATE_KEY || ''

  if (!affiliateKey) {
    throw new Error('SUMUP_AFFILIATE_KEY não configurado')
  }

  const {
    amount,
    currency = 'EUR',
    title,
    callbackSuccess,
    callbackFail,
    receiptEmail,
    receiptPhone,
    foreignTxId,
    skipScreenSuccess = true,
  } = params

  const urlParams = new URLSearchParams({
    amount: amount.toFixed(2),
    currency,
    'affiliate-key': affiliateKey,
  })

  if (title) {
    urlParams.append('title', title)
  }

  if (callbackSuccess) {
    urlParams.append('callbacksuccess', callbackSuccess)
  }

  if (callbackFail) {
    urlParams.append('callbackfail', callbackFail)
  }

  if (receiptEmail) {
    urlParams.append('receipt-email', receiptEmail)
  }

  if (receiptPhone) {
    urlParams.append('receipt-mobilephone', receiptPhone)
  }

  if (foreignTxId) {
    urlParams.append('foreign-tx-id', foreignTxId)
  }

  if (skipScreenSuccess) {
    urlParams.append('skip-screen-success', 'true')
  }

  return `sumupmerchant://pay/1.0?${urlParams.toString()}`
}

/**
 * Cria URL para Android App (SumUp Merchant Scheme)
 *
 * Android usa sumupmerchant:// scheme (igual ao iOS)
 * Referência: https://github.com/sumup/sumup-android-api
 */
export function createAndroidDeepLink(params: SumUpMobilePaymentParams): string {
  const affiliateKey = process.env.NEXT_PUBLIC_SUMUP_AFFILIATE_KEY || ''
  const appId = process.env.NEXT_PUBLIC_APP_PACKAGE_NAME || 'com.sofiagastrobar.app'

  if (!affiliateKey) {
    throw new Error('SUMUP_AFFILIATE_KEY não configurado')
  }

  const {
    amount,
    currency = 'EUR',
    title,
    callbackSuccess,
    callbackFail,
    receiptEmail,
    receiptPhone,
    foreignTxId,
    skipScreenSuccess = true,
  } = params

  // Android usa o mesmo scheme que iOS: sumupmerchant://pay/1.0
  const urlParams = new URLSearchParams({
    'affiliate-key': affiliateKey,
    'app-id': appId,
    'total': amount.toFixed(2),
    'currency': currency,
  })

  if (title) {
    urlParams.append('title', title)
  }

  // Android usa 'callback' para o URL de retorno
  // Diferente do iOS que tem callbacksuccess/callbackfail separados
  if (callbackSuccess) {
    urlParams.append('callback', callbackSuccess)
  }

  if (receiptEmail) {
    urlParams.append('receipt-email', receiptEmail)
  }

  if (receiptPhone) {
    urlParams.append('receipt-mobilephone', receiptPhone)
  }

  if (foreignTxId) {
    urlParams.append('foreign-tx-id', foreignTxId)
  }

  if (skipScreenSuccess) {
    urlParams.append('skip-screen-success', 'true')
  }

  return `sumupmerchant://pay/1.0?${urlParams.toString()}`
}

/**
 * Cria deep link apropriado baseado no device
 */
export function createMobileDeepLink(params: SumUpMobilePaymentParams): string | null {
  if (isIOS()) {
    return createIOSDeepLink(params)
  }

  if (isAndroid()) {
    return createAndroidDeepLink(params)
  }

  return null
}

/**
 * Abre payment usando deep link se possível, senão fallback para web
 */
export async function openPaymentWithDeepLink(
  params: SumUpMobilePaymentParams,
  webPaymentUrl: string
): Promise<void> {
  // Se não for mobile, usar web
  if (!isMobile()) {
    window.location.href = webPaymentUrl
    return
  }

  try {
    const deepLink = createMobileDeepLink(params)

    if (!deepLink) {
      // Não conseguiu criar deep link, usar web
      window.location.href = webPaymentUrl
      return
    }

    // Tentar abrir deep link
    window.location.href = deepLink

    // Fallback para web se app não abrir em 2 segundos
    setTimeout(() => {
      // Se ainda estamos na mesma página, o app não abriu
      if (document.hasFocus()) {
        window.location.href = webPaymentUrl
      }
    }, 2000)
  } catch (error) {
    console.error('Erro ao abrir deep link:', error)
    // Fallback para web
    window.location.href = webPaymentUrl
  }
}

/**
 * Estratégia inteligente de pagamento
 *
 * 1. Mobile + App instalado → Deep Link (mais rápido)
 * 2. Mobile + App não instalado → Web Payment Link (com prompt para instalar)
 * 3. Desktop → Web Payment Link
 */
export async function smartPaymentRedirect(
  params: SumUpMobilePaymentParams,
  webPaymentUrl: string,
  options?: {
    preferDeepLink?: boolean
    showInstallPrompt?: boolean
  }
): Promise<void> {
  const { preferDeepLink = true, showInstallPrompt = true } = options || {}

  // Desktop sempre usa web
  if (!isMobile()) {
    window.location.href = webPaymentUrl
    return
  }

  // Mobile - verificar se prefere deep link
  if (!preferDeepLink) {
    window.location.href = webPaymentUrl
    return
  }

  // Tentar deep link com fallback
  await openPaymentWithDeepLink(params, webPaymentUrl)
}

/**
 * Parse callback URL do iOS/Android
 *
 * iOS - Exemplo de sucesso:
 * sofiagastrobar://payment?success=true&txcode=TRANSACTION_CODE&foreign-tx-id=res_123
 *
 * iOS - Exemplo de falha:
 * sofiagastrobar://payment?success=false&code=ERROR_CODE
 *
 * Android - Exemplo de sucesso:
 * sofiagastrobar://payment?smp-status=success&smp-tx-code=TRANSACTION_CODE&smp-receipt-sent=true
 *
 * Android - Exemplo de falha:
 * sofiagastrobar://payment?smp-status=failed&smp-failure-cause=transaction-failed
 */
export function parseCallbackURL(url: string): {
  success: boolean
  transactionCode?: string
  foreignTxId?: string
  errorCode?: string
  receiptSent?: boolean
} {
  try {
    const urlObj = new URL(url)
    const params = new URLSearchParams(urlObj.search)

    // Detectar se é callback iOS ou Android
    const isAndroidCallback = params.has('smp-status')

    if (isAndroidCallback) {
      // Parse callback Android
      return {
        success: params.get('smp-status') === 'success',
        transactionCode: params.get('smp-tx-code') || undefined,
        foreignTxId: params.get('foreign-tx-id') || undefined,
        errorCode: params.get('smp-failure-cause') || undefined,
        receiptSent: params.get('smp-receipt-sent') === 'true',
      }
    } else {
      // Parse callback iOS
      return {
        success: params.get('success') === 'true',
        transactionCode: params.get('txcode') || undefined,
        foreignTxId: params.get('foreign-tx-id') || undefined,
        errorCode: params.get('code') || undefined,
      }
    }
  } catch (error) {
    console.error('Erro ao fazer parse do callback URL:', error)
    return { success: false }
  }
}

/**
 * Hook para React - Detecta device e configuração
 */
export function usePaymentDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = React.useState({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    canUseDeepLink: false,
  })

  React.useEffect(() => {
    const mobile = isMobile()
    const ios = isIOS()
    const android = isAndroid()

    setDeviceInfo({
      isMobile: mobile,
      isIOS: ios,
      isAndroid: android,
      canUseDeepLink: mobile && (ios || android),
    })
  }, [])

  return deviceInfo
}

// Exportar para uso no React
import * as React from 'react'
