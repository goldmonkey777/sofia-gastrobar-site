/**
 * Hook para obter dados do usuário do telefone
 * Usa Contacts API e dados salvos no navegador
 */

import { useState, useEffect } from 'react'

interface UserData {
  name: string | null
  email: string | null
  phone: string | null
  address: string | null
}

interface UseUserDataOptions {
  autoLoad?: boolean
}

export function useUserData(options: UseUserDataOptions = {}) {
  const { autoLoad = true } = options
  const [userData, setUserData] = useState<UserData>({
    name: null,
    email: null,
    phone: null,
    address: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFromLocalStorage = () => {
    try {
      const savedName = localStorage.getItem('user_name')
      const savedEmail = localStorage.getItem('user_email')
      const savedPhone = localStorage.getItem('user_phone')
      const savedAddress = localStorage.getItem('user_address')

      setUserData({
        name: savedName,
        email: savedEmail,
        phone: savedPhone,
        address: savedAddress,
      })
    } catch (err) {
      console.error('Error loading from localStorage:', err)
    }
  }

  const loadFromContacts = async () => {
    // Contacts API está disponível apenas em contextos seguros (HTTPS)
    // e requer permissão do usuário
    if (!('contacts' in navigator && 'ContactsManager' in window)) {
      return
    }

    try {
      const contacts = await (navigator as any).contacts.select(['name', 'email', 'tel'], {
        multiple: false,
      })

      if (contacts && contacts.length > 0) {
        const contact = contacts[0]
        setUserData((prev) => ({
          ...prev,
          name: contact.name?.[0] || prev.name,
          email: contact.email?.[0] || prev.email,
          phone: contact.tel?.[0] || prev.phone,
        }))
      }
    } catch (err: any) {
      // Usuário cancelou ou API não disponível
      if (err.name !== 'AbortError' && err.name !== 'NotSupportedError') {
        console.error('Error loading contacts:', err)
      }
    }
  }

  const saveToLocalStorage = (data: Partial<UserData>) => {
    try {
      if (data.name) localStorage.setItem('user_name', data.name)
      if (data.email) localStorage.setItem('user_email', data.email)
      if (data.phone) localStorage.setItem('user_phone', data.phone)
      if (data.address) localStorage.setItem('user_address', data.address)
    } catch (err) {
      console.error('Error saving to localStorage:', err)
    }
  }

  const loadUserData = async () => {
    setLoading(true)
    setError(null)

    // 1. Carregar do localStorage primeiro
    loadFromLocalStorage()

    // 2. Tentar carregar do Contacts API (opcional, requer permissão)
    // Comentado por padrão - descomente se quiser usar
    // await loadFromContacts()

    setLoading(false)
  }

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => {
      const newData = { ...prev, ...data }
      saveToLocalStorage(newData)
      return newData
    })
  }

  useEffect(() => {
    if (autoLoad) {
      loadUserData()
    }
  }, [autoLoad])

  return {
    userData,
    loading,
    error,
    loadUserData,
    updateUserData,
    saveToLocalStorage,
  }
}

