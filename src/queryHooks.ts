import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import _ from "lodash";
import { useNetworkContext } from "context/network-context";
import {
  useClobTransactionsCallback,
  useGetTransactionReceiptCallback,
} from "hooks/lens-hooks";
import { useGetTokenDetailsCallback } from "hooks/erc20-hooks";
import BN from "bignumber.js";
import { zeroAddress } from "@orbs-network/twap";

export function useClobTransactionsInfiniteQuery() {
  const networkName = useNetworkContext().config.networkName;
  const clobTransactionsFn = useClobTransactionsCallback();

  return useInfiniteQuery(
    ["useClobTransactionsInfiniteQuery", networkName],
    async ({ pageParam = 1, signal }) => {
      return clobTransactionsFn({
        page: pageParam,
        signal,
        offset: 30,
      });
    },
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, pages) => {
        return _.size(pages) + 1;
      },
      staleTime: Infinity,
      select: (data) => ({
        pages: [...data.pages],
        pageParams: [...data.pageParams],
      }),
    }
  );
}

export const useClobTransactionsQuery = (offset = "40") => {
  const networkName = useNetworkContext().config.networkName;
  const clobTransactionsFn = useClobTransactionsCallback();

  return useQuery(
    ["useClobTransactionsQuery", networkName, offset],
    ({ signal }) => {
      return clobTransactionsFn({ page: 1, signal, offset: Number(offset) });
    },
    { refetchOnWindowFocus: false }
  );
};

export const useTokenDetails = (tokenAddress: string) => {
  const getTokenDetails = useGetTokenDetailsCallback();
  return useQuery(
    ["useTokenDetails", tokenAddress],
    async () => getTokenDetails(tokenAddress),
    {
      staleTime: Infinity,
    }
  );
};

export const useGetUsdValueCallback = () => {
  const lib = useNetworkContext().lib;
  const getTokenDetails = useGetTokenDetailsCallback();
  const queryClient = useQueryClient();

  return useMutation(async (address: string) => {
    const token = await getTokenDetails(address);
    const cachedValue = queryClient.getQueryData(["usdUsdValueQuery", address]);
    if (cachedValue) return cachedValue;
    const value = (await lib.priceUsd(token)).toString();
    queryClient.setQueryData(["usdUsdValueQuery", address], value);
    return value;
  });
};

export const useUsdValueQuery = (address?: string) => {
  const getTokenDetails = useGetTokenDetailsCallback();
  const lib = useNetworkContext().lib;

  return useQuery(
    ["usdUsdValueQuery", address],
    async () => {
      const token =
        address === zeroAddress
          ? lib.config.nativeToken
          : await getTokenDetails(address ?? "");
      return new BN(await lib.priceUsd(token)).toString();
    },
    {
      staleTime: Infinity,
      enabled: !!address,
    }
  );
};

export const useTxReceiptMutation = () => {
  const getTransactionReceipt = useGetTransactionReceiptCallback();
  return useMutation((hash?: string) => {
    return getTransactionReceipt(hash ?? "");
  });
};
