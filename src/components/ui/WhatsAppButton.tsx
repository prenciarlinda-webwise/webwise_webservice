'use client'

import { useState, ReactNode } from 'react'
import WhatsAppModal from './WhatsAppModal'

interface WhatsAppButtonProps {
  children: ReactNode
  className?: string
  defaultMessage?: string
}

export default function WhatsAppButton({ children, className = '', defaultMessage = '' }: WhatsAppButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        {children}
      </button>

      <WhatsAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultMessage={defaultMessage}
      />
    </>
  )
}
