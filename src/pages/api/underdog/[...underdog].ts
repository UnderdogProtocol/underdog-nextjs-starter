import { NextUnderdog, NetworkEnum } from "@underdog-protocol/js";

export default NextUnderdog({
  apiKey: process.env.UNDERDOG_API_KEY!,
  network: NetworkEnum.Mainnet,
});