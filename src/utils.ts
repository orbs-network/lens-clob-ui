import { TokenDetails } from "types";
import BN from "bignumber.js";
import { parsebn } from "@defi.org/web3-candies";

export function formatTimestamp(timestamp: number) {
  return convertUTCDateToLocalDate(new Date(timestamp * 1000))
    .toISOString()
    .substring(0, 19)
    .replace("T", " ");
}

export function convertUTCDateToLocalDate(date: Date) {
  const newDate = new Date(
    date.getTime() + date.getTimezoneOffset() * 60 * 1000
  );
  const offset = date.getTimezoneOffset() / 60;
  const hours = date.getHours();
  newDate.setHours(hours - offset);
  return newDate;
}

export function addressToSolverName(address: string) {
  if (
    address.toLowerCase() ===
    "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5".toLowerCase()
  ) {
    return "Kyber";
  }
  if (
    address.toLowerCase() ===
    "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57".toLowerCase()
  ) {
    return "Paraswap";
  }
  if (
    address.toLowerCase() ===
    "0x4E3288c9ca110bCC82bf38F09A7b425c095d92Bf".toLowerCase()
  ) {
    return "Odos";
  }
  if (
    address.toLowerCase() ===
    "0x6352a56caadC4F1E25CD6c75970Fa768A3304e64".toLowerCase()
  ) {
    return "OpenOcean";
  }
  return address;
}

export const amountUi = (token: TokenDetails | undefined, amount: BN) => {
  if (!token) return "";
  const percision = BN(10).pow(token?.decimals || 0);
  const result = amount.times(percision).idiv(percision).div(percision);

  return result.toString();
};
export const amountBN = (token: TokenDetails | undefined, amount: string) =>
  parsebn(amount).times(BN(10).pow(token?.decimals || 0));

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
