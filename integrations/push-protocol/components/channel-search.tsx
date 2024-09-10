import { useState } from "react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ENV } from "@/integrations/push-protocol"

import { useSearchChannels } from "../hooks"
import { ChannelCard } from "./channel-card"
import { Loadable } from "./loadable"

export function ChannelSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchEnv, setSearchEnv] = useState(ENV.PROD)

  const {
    data: channels,
    isLoading,
    isError,
  } = useSearchChannels({
    query: searchQuery || "0x",
    env: searchEnv,
  })

  if (isError) return <>Error Loading Channels...</>

  return (
    <>
      <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="grow">
          <Input
            placeholder="Search by Name or Address"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-56">
          <Select
            value={searchEnv}
            onValueChange={(value) => setSearchEnv(value as ENV)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={searchEnv === ENV.STAGING ? "Goerli" : "Mainnet"}
              >
                {searchEnv === ENV.STAGING ? "Goerli" : "Mainnet"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ENV.STAGING}>Goerli</SelectItem>
              <SelectItem value={ENV.PROD}>Mainnet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Loadable isLoading={isLoading}>
          <div className="flex flex-col space-y-6">
            {channels?.slice(0, 5).map((channel) => (
              <ChannelCard
                key={`channel-${channel.channel}`}
                channelAddress={channel.channel}
                env={searchEnv}
              />
            ))}
            {channels?.length === 0 && (
              <p className="py-14 text-center text-xl font-bold">
                No Channels Found...
              </p>
            )}
          </div>
        </Loadable>
      </div>
    </>
  )
}
