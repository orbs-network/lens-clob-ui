import { TokenDetails } from "types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Store {
  tokens: { [tokenAddress: string]: TokenDetails };
  setToken: (token: TokenDetails) => void;
  getToken: (tokenAddress: string) => TokenDetails | undefined;
}

export const useTokenCacheStore = create(
  persist<Store>(
    (set, get) => ({
      tokens: {},
      setToken: (token) => {
        set({ tokens: { ...get().tokens, [token.address]: token } });
      },
      getToken: (tokenAddress) => {
        return get().tokens[tokenAddress];
      },
    }),
    {
      name: `token_cache_store`,
    }
  )
);
