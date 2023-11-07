/* eslint-disable react-refresh/only-export-components */
import { chainData, DEFAULT_NETWORK } from "consts";
import { useUrlParams } from "hooks";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { NetworkConfig } from "types";
import Web3 from "web3";
import { setWeb3Instance } from "@defi.org/web3-candies";
import { Config, TWAPLib } from "@orbs-network/twap";

interface ContextArgs {
  network: number;
  web3: Web3;
  config: NetworkConfig;
  lib: TWAPLib;
}

const Context = createContext({} as ContextArgs);

const NetworkContextProvider = (props: { children: ReactNode }) => {
  const params = useUrlParams();
  const network = useMemo(
    () => Number(params.network || DEFAULT_NETWORK.toString()),
    [params]
  );
  const { web3, config, lib } = useMemo(() => {
    const config =
      chainData[network as keyof typeof chainData] ||
      chainData[DEFAULT_NETWORK];
    const web3 = new Web3(config.rpcUrl);
    const lib = new TWAPLib(
      config.libConfig,
      "0xB5c4b45ea98644bA13d7e664e32494b633973F3B",
      web3
    );

    setWeb3Instance(web3);
    return { web3, config, lib };
  }, [network]);

  return (
    <Context.Provider
      value={{
        network,
        config,
        web3,
        lib,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

const useNetworkContext = () => useContext(Context);

export { NetworkContextProvider, useNetworkContext };
