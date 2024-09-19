// src/lib/stargazerConnector.ts
import { StargazerConnector } from "@/components/providers/StargazerConnector";
import { SUPPORTED_CHAIN_IDS } from "@/lib/consts/constants";

export const stargazerConnector = new StargazerConnector({
  chains: SUPPORTED_CHAIN_IDS,
});