/**
 * QR Code Genérico - Para qualquer URL
 */

'use client'

import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  value: string
  size?: number
  className?: string
  showLabel?: boolean
  label?: string
}

export function QRCode({
  value,
  size = 200,
  className = '',
  showLabel = true,
  label,
}: QRCodeProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <QRCodeSVG
          value={value}
          size={size}
          level="M"
          includeMargin={true}
          fgColor="#000000"
          bgColor="#ffffff"
        />
      </div>
      {showLabel && label && (
        <p className="mt-4 text-sm text-white/60 text-center max-w-[200px]">
          {label}
        </p>
      )}
    </div>
  )
}

