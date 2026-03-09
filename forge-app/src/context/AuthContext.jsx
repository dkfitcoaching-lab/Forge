import { createContext, useContext, useState } from 'react'
import { storage } from '../utils/storage'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => storage.get('auth', false))
  const [hasOnboarded, setHasOnboarded] = useState(() => storage.get('onboarded', false))
  const [user, setUser] = useState(() => storage.get('user', null))

  const login = (userData) => {
    const u = userData || { name: 'Athlete', email: '' }
    setUser(u)
    setIsLoggedIn(true)
    storage.set('auth', true)
    storage.set('user', u)
  }

  const completeOnboarding = (profile) => {
    setHasOnboarded(true)
    storage.set('onboarded', true)
    if (profile) {
      const updated = { ...user, ...profile }
      setUser(updated)
      storage.set('user', updated)
    }
  }

  const logout = () => {
    setIsLoggedIn(false)
    setHasOnboarded(false)
    setUser(null)
    storage.clear()
  }

  const updateUser = (data) => {
    const updated = { ...user, ...data }
    setUser(updated)
    storage.set('user', updated)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, hasOnboarded, user, login, completeOnboarding, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
