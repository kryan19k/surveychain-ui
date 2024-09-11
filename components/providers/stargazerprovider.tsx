import React, { createContext, ReactNode, useContext } from "react"

import {
  IStargazerWalletHookState,
  useStargazerWallet,
} from "@/lib/hooks/useStargazerWallet"

const StargazerContext = createContext<IStargazerWalletHookState | undefined>(
  undefined
)

export function StargazerProvider({ children }: { children: ReactNode }) {
  const stargazerState = useStargazerWallet()

  return (
    <StargazerContext.Provider value={stargazerState}>
      {children}
    </StargazerContext.Provider>
  )
}

export function useStargazerContext() {
  const context = useContext(StargazerContext)
  if (context === undefined) {
    throw new Error(
      "useStargazerContext must be used within a StargazerProvider"
    )
  }
  return context
}
