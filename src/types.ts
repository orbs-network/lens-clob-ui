import { TokenData } from "@orbs-network/twap";
import { chainData, DEFAULT_NETWORK } from "consts";

export type NetworkConfig = (typeof chainData)[typeof DEFAULT_NETWORK];

export interface TokenDetails extends TokenData {
  name: string;
}
