import { erc20Abi } from "abis";
import { useNetworkContext } from "context/network-context";
import { useTokenCacheStore } from "store/useTokenCacheStore";
import { TokenDetails } from "types";

const env = import.meta.env;


export function useGetTokenDetailsCallback() {
  const web3 = useNetworkContext().web3;
  const { getToken, setToken } = useTokenCacheStore();
  return async (tokenAddress: string): Promise<TokenDetails> => {
    const cachedToken = getToken(tokenAddress);
    if (cachedToken) return cachedToken;

    if (tokenAddress == "0x0000000000000000000000000000000000000000") {
      return {
        name: "Wrapped Matic",
        symbol: "WMATIC",
        decimals: 18,
        address: env.VITE_WRAPPED_MATIC,
      };
    }

    console.log("**** fetching token", tokenAddress);

    const contract = new web3.eth.Contract(erc20Abi as never, tokenAddress);

    const [name, symbol, decimals] = await Promise.all([
      contract.methods.name().call(),
      contract.methods.symbol().call(),
      contract.methods.decimals().call(),
    ]);

    const token = {
      name,
      symbol,
      decimals,
      address: tokenAddress,
    };
    setToken(token);
    return token;
  };
}
