/**
 * Type definitions for Google Maps and Google Pay
 * Declarações de tipo para Google Maps API e Google Pay API
 */

declare global {
  interface Window {
    google?: {
      maps?: typeof google.maps
      payments?: {
        api: {
          PaymentsClient: new (options: { environment: 'TEST' | 'PRODUCTION' }) => {
            isReadyToPay(request: any): Promise<{ result: boolean }>
            loadPaymentData(request: any): Promise<any>
          }
        }
      }
    }
  }
}

export {}

