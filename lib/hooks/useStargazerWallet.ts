import { useState, useCallback, useEffect } from 'react'
import { activateStargazerProviders, getDAGAccounts } from '@/lib/utils/stargazer'

export const useStargazerWallet = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isActivating, setIsActivating] = useState(false)

  const activate = useCallback(async () => {
    if (isActivating) return
    setIsActivating(true)
    setError(null)

    try {
      const { dagProvider } = await activateStargazerProviders()
      const accounts = await getDAGAccounts(dagProvider)
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
      } else {
        throw new Error('No Constellation accounts found')
      }
    } catch (err) {
      console.error('Failed to activate Stargazer wallet:', err)
      setError(err instanceof Error ? err : new Error('Failed to connect Stargazer wallet'))
      setIsConnected(false)
    } finally {
      setIsActivating(false)
    }
  }, [isActivating])
  
  const deactivate = useCallback(() => {
    setIsConnected(false)
    setAddress(null)
    setError(null)
  }, [])

  useEffect(() => {
    // Check if Stargazer is installed
    if (typeof window !== 'undefined' && !window.stargazer) {
      setError(new Error('Stargazer wallet is not installed'))
    }
  }, [])

  return { 
    isConnected, 
    address, 
    error, 
    activate, 
    deactivate, 
    isActivating 
  }
}

export type IStargazerWalletHookState = ReturnType<typeof useStargazerWallet>