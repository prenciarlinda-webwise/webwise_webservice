'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import WhatsAppModal from './WhatsAppModal'

export default function FloatingWhatsApp() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />

        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with us
        </span>

        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
      </button>

      {/* Modal */}
      <WhatsAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultMessage="Hi, I'd like to learn more about your services."
      />
    </>
  )
}
