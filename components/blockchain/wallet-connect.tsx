"use client"

import { HtmlHTMLAttributes, useEffect, useState } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useStargazerContext } from "@/components/providers/stargazerprovider"

export const WalletConnect = ({
  className,
  ...props
}: HtmlHTMLAttributes<HTMLSpanElement>) => {
  const { isConnected: isWagmiConnected } = useAccount()
  const {
    isConnected: isStargazerConnected,
    activate,
    error,
    isActivating,
  } = useStargazerContext()
  const [showStargazerButton, setShowStargazerButton] = useState(false)

  useEffect(() => {
    if (isWagmiConnected && !isStargazerConnected && !isActivating) {
      setShowStargazerButton(true)
    } else {
      setShowStargazerButton(false)
    }
  }, [isWagmiConnected, isStargazerConnected, isActivating])

  useEffect(() => {
    if (error) {
      toast({
        title: "Stargazer Wallet Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }, [error])

  const handleStargazerConnect = async () => {
    try {
      await activate()
      toast({
        title: "Success",
        description: "Stargazer wallet connected successfully",
      })
    } catch (err) {
      console.error("Failed to connect Stargazer wallet:", err)
      toast({
        title: "Error",
        description:
          "Failed to connect Stargazer wallet. Please make sure it's installed and try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <span className={className} {...props}>
      <div className="flex flex-row gap-2 p-2">
        {showStargazerButton && (
          <Button onClick={handleStargazerConnect} disabled={isActivating}>
            {isActivating ? "Connecting Stargazer..." : "Connect Stargazer"}
          </Button>
        )}
      </div>
      <ConnectButton
        showBalance={false}
        accountStatus={{
          smallScreen: "avatar",
          largeScreen: "avatar",
        }}
        chainStatus={{
          smallScreen: "icon",
          largeScreen: "icon",
        }}
      />
    </span>
  )
}
