/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRANSFER_EVENT_ABI } from "abis";
import { useNetworkContext } from "context/network-context";
import { ethers } from "ethers";
import { useGetTokenDetailsCallback } from "./erc20-hooks";
import BN from "bignumber.js";
import { decodeCallData2 } from "utils/abi-decoder";
import { lhFillerAbi } from "abis/lhFiller-abi";
import axios from "axios";
const ERC20_TRANSFER_EVENT_TOPIC = ethers.utils.id(
  "Transfer(address,address,uint256)"
);

export function useGetTransactionReceiptCallback() {
  const parseERC20TransferEvents = useParseERC20TransferEventsCallback();
  const web3 = useNetworkContext().web3;

  return async (hash: string) => {
    const receipt = await web3.eth.getTransactionReceipt(hash);
    return parseERC20TransferEvents(receipt.logs);
  };
}

export const useParseERC20TransferEventsCallback = () => {
  const getTokenDetails = useGetTokenDetailsCallback();
  return async (logs: any[]) => {
    const iface = new ethers.utils.Interface(TRANSFER_EVENT_ABI);

    const transferLogs = logs.filter(
      (log) => log.topics[0] === ERC20_TRANSFER_EVENT_TOPIC
    );

    // Parse the logs
    const transfersP = transferLogs.map(async (log) => {
      return {
        parsed: iface.parseLog(log),
        address: log.address,
        token: await getTokenDetails(log.address),
      };
    });
    const transfers = await Promise.all(transfersP);

    return transfers.map((transfer) => {
      return {
        from: transfer.parsed.args.from,
        to: transfer.parsed.args.to,
        value: transfer.parsed.args.value
          .div(ethers.BigNumber.from(10).pow(transfer.token.decimals))
          .toString(),
        symbol: transfer.token.symbol,
        name: transfer.token.name,
      };
    });
  };
};

export async function useGetTransactionReceipt(hash: string) {
  const parseERC20TransferEvents = useParseERC20TransferEventsCallback();
  const web3 = useNetworkContext().web3;
  return async () => {
    const receipt = await web3.eth.getTransactionReceipt(hash);
    return parseERC20TransferEvents(receipt.logs);
  };
}

export function useClobTransactionsCallback() {
  const { config, web3 } = useNetworkContext();

  return async ({
    page,
    signal,
    offset = 20,
  }: {
    page: number;
    offset?: number;
    signal?: AbortSignal;
  }) => {
    const latestBlock = await web3.eth.getBlockNumber();
    // const weekAgo = (Date.now() - 1000 * 60 * 60 * 24 * 2);
    // const startBlock = await getClosestBlock( weekAgo - (weekAgo%3600000)  , web3)
    // console.log(startBlock, latestBlock);
    // const startBlock = await findBlock(Date.now() *(1000*60*60*24*2));
    // console.log('using find block by web3canddies ',{
    //     startBlock,
    // });
    const startBlock = 47670000; // Static launch block

    //const lhFiller = "0x64bc3532991d8147167ee028a7adbf01c05594f7"

    const response = await axios.get(
      `${config.scannerApi}/api?module=account&action=txlist&address=${config.lhFiller}&startblock=${startBlock}&endblock=${latestBlock}&sort=desc&page=${page}&offset=${offset}&apikey=${config.scannerK}`,
      { signal }
    );
    const transactions = response.data.result;

    return await Promise.all(
      transactions.map(async (transaction: any) => {
        try {
          //   console.log("@@@,", transaction.hash, transaction.input);

          const data = decodeCallData2(lhFillerAbi as any, transaction.input);

          if (!data) {
            return {
              from: transaction.from,
              to: transaction.to,
              value: transaction.value,
              input: transaction.data,
              type: "unknown",
              data: {},
            };
          }

          //   console.log(
          //     "!!!",
          //     new BN(data.args.swaps[0].amount.toString()).div("1e18").toString()
          //   );

          return {
            from: transaction.from,
            to: transaction.to,
            value: transaction.value,
            input: transaction.data,
            hash: transaction.hash,
            timeStamp: transaction.timeStamp,
            txreceiptStatus: transaction.txreceipt_status,
            cumulativeGasUsed: transaction.cumulativeGasUsed,
            isError: transaction.isError,
            functionName: transaction.functionName,
            gasPrice: transaction.gasPrice,
            type: "swap",
            data: {
              exchange: data.args.swaps[0].exchange,
              to: data.args.swaps[0].to,
              sourceToken: data.args.swaps[0].token,
              amount: new BN(data.args.swaps[0].amount.toString()),
            },
            exchange: data.args.swaps[0].exchange,
            filler: data.args.swaps[0].to,
            sourceToken: data.args.swaps[0].token,
            amount: new BN(data.args.swaps[0].amount.toString()),
            callData: data.callData,
          };
        } catch (e) {
          console.log(e);

          return {
            from: transaction.from,
            to: transaction.to,
            value: transaction.value,
            input: transaction.data,
            type: "unknown",
            data: {},
          };
        }
      })
    );
  };
}
