import { useMemo } from "react";

import { UnderdogClient, createUnderdogClient } from "@underdog-protocol/js";
import { NetworkEnum } from "@underdog-protocol/js";

export const devnetUnderdogClient = createUnderdogClient({
  network: NetworkEnum.Devnet,
  baseUrl: "/api/underdog/devnet",
});

export const mainnetUnderdogClient = createUnderdogClient({
  network: NetworkEnum.Mainnet,
  baseUrl: "/api/underdog/mainnet",
});

export const networkToUnderdogClient: Record<NetworkEnum, UnderdogClient> = {
  [NetworkEnum.Devnet]: devnetUnderdogClient,
  [NetworkEnum.Mainnet]: mainnetUnderdogClient,
  [NetworkEnum.Localnet]: devnetUnderdogClient,
};

export const useUnderdogClient = (network: NetworkEnum) => {
  const underdogClient = useMemo(() => networkToUnderdogClient[network], [network]);
  return underdogClient;
};
