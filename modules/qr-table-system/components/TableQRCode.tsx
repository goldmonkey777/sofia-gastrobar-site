/**
 * QR Table System - TableQRCode Component
 * Componente para exibir QR code da mesa
 */

'use client'

import { QRCodeSVG } from 'qrcode.react'
import { generateQRData } from '../utils/tableHelpers'

interface TableQRCodeProps {
  tableId: string
  size?: number
  className?: string
  showLabel?: boolean
}

export function TableQRCode({
  tableId,
  size = 200,
  className = '',
  showLabel = true,
}: TableQRCodeProps) {
  const qrData = generateQRData(tableId)

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <QRCodeSVG
          value={qrData}
          size={size}
          level="M"
          includeMargin={true}
          fgColor="#000000"
          bgColor="#ffffff"
        />
      </div>
      {showLabel && (
        <p className="mt-4 text-sm text-gray-600 text-center max-w-[200px]">
          Escaneie para acessar o menu e serviços da mesa
        </p>
      )}
    </div>
  )
}

