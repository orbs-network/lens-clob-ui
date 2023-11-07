/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  useClobTransactionsInfiniteQuery,
  useTokenDetails,
  useTxReceiptMutation,
  useUsdValueQuery,
} from "queryHooks";
import _ from "lodash";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import {
  addressToSolverName,
  amountUi,
  formatTimestamp,
} from "utils";
import { addressToLogo, addressToName } from "utils/gaurdians";
import BN from "bignumber.js";
import styled from "styled-components";
import { useFormatNumber } from "hooks";
import { useNetworkContext } from "context/network-context";

const Row = (props: any) => {
  const { index, style } = props;

  const data = props.data[index];

  return (
    <div className="ListItem" style={style}>
      {data && <Tx swap={data} />}
    </div>
  );
};

export function Transactions() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useClobTransactionsInfiniteQuery();

  const flatData = useMemo(
    () => _.flatMap(data?.pages, (page) => page),
    [data?.pages]
  );
  const itemsCount = hasNextPage ? _.size(flatData) + 1 : _.size(flatData);

  const fetch = () => {
    if (isFetchingNextPage) return;
    fetchNextPage();
  };

  if (!data) {
    return <CircularProgress />
  }
    return (
      <Container>
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => (
            <InfiniteLoader
              isItemLoaded={(index) => index < itemsCount - 1}
              itemCount={itemsCount}
              loadMoreItems={fetch}
            >
              {({ onItemsRendered, ref }) => (
                <List
                  ref={ref}
                  itemData={flatData}
                  itemCount={itemsCount}
                  onItemsRendered={onItemsRendered}
                  itemSize={40}
                  width={width}
                  overscanCount={4}
                  height={height}
                >
                  {Row}
                </List>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </Container>
    );
}

const Container = styled.div`
  flex: 1;
`;

const GasCost = ({ cumulativeGasUsed }: { cumulativeGasUsed: string }) => {
  const value = useFormatNumber({
    value: new BN(cumulativeGasUsed).div(new BN(1e9)).toString(),
    decimalScale: 6,
  });
  return (
    <Grid item xs={1}>
      {value}
    </Grid>
  );
};

const GasPrice = ({ gasPrice }: { gasPrice: string }) => {
  const value = useFormatNumber({
    value: new BN(gasPrice).div(new BN(1e9)).toString(),
    decimalScale: 6,
  });
  return (
    <Grid item xs={1}>
      {value}
    </Grid>
  );
};

const InAmount = ({ address, amount }: { address: string; amount: BN }) => {
  const { data } = useTokenDetails(address);

  const decimals = data?.decimals || 0;

  const value = useFormatNumber({
    value: decimals && amount.dividedBy(10 ** decimals).toString(),
    decimalScale: 5,
  });

  return (
    <Grid item xs={2} title={data?.symbol}>
      {value || "-"}
      <b> {data?.symbol || "x"}</b>
    </Grid>
  );
};

const Status = ({ isError }: { isError?: boolean }) => {
  return (
    <Grid item xs={1}>
      {!isError ? (
        <span style={{ color: "green" }}>Success</span>
      ) : (
        <span style={{ color: "red" }}>Failed</span>
      )}
    </Grid>
  );
};

const UsdValue = ({ address, amount }: { address: string; amount: BN }) => {
  const { data: token } = useTokenDetails(address);

  const { data: usdValue } = useUsdValueQuery(address);

  const value = useMemo(() => {
    if (token && usdValue) {
      return amountUi(token, new BN(usdValue).times(amount));
    }
  }, [token, usdValue, amount]);

  const parsedValue = useFormatNumber({
    value,
    decimalScale: 5,
  });

  return (
    <Grid item xs={1}>
      {`$${parsedValue}` || "-"}
    </Grid>
  );
};

// let once = {};
const ReceiptButton = ({ swap }: { swap: any }) => {
  const { mutate: getReceipt, data: txReceipt } = useTxReceiptMutation();

  if (swap.functionName.indexOf("fill") <= -1) {
    return null;
  }
  return (
    <>
      <Grid item xs={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => getReceipt(swap.txHash)}
        >
          getLogs
        </Button>
      </Grid>
      <div>
        {txReceipt?.map((log: any, i: number) => {
          // if (log.value === "0" || once[`${log.symbol}-${log.value}`]) {
          //   return null;
          // }
          // once[`${log.symbol}-${log.value}`] = 1;
          return (
            <Box key={`${log.symbol}-${log.value}`}>
              <div className="box">
                <span>{log.value} </span>
                <span>
                  <b>{log.symbol}</b>
                </span>
                {i == txReceipt.length ? <span>➡️</span> : null}
              </div>
            </Box>
          );
        })}
      </div>
    </>
  );
};

const OutToken = ({ address }: { address: any }) => {
  const { data: token } = useTokenDetails(address);


  return  <Grid item xs={2}>
    {token?.symbol || "-"}
  </Grid>

}

function Tx({ swap }: { swap: any }) {
  const { config } = useNetworkContext();

  const scannerDomain = useMemo(
    () => config.scannerDomain.replace("api.", ""),
    [config.scannerDomain]
  );

  

  return (
    <div key={swap?.hash}>
      <Grid container className="row">
        {/* <Grid item xs={1} >
        <span>{orderId}</span>
        </Grid> */}
        <Status isError={swap?.isError !== "0"} />
        <Grid item xs={1}>
          <a
            target="_blank"
            href={`${scannerDomain}/tx/${swap?.hash}`}
            className="href"
          >
            {swap.hash.substring(0, 10) || "-"}
          </a>
        </Grid>
        <Grid item xs={2}>
          {formatTimestamp(swap.timeStamp)}
        </Grid>
        <Grid item xs={2}>
          <a
            target="_blank"
            href={`${scannerDomain}/tx/${swap?.from}`}
            className="href"
          >
            {addressToLogo(swap.from)} {addressToName(swap.from)}
          </a>
        </Grid>

        <InAmount amount={swap.amount} address={swap.sourceToken} />
        <UsdValue amount={swap.amount} address={swap.sourceToken} />
        {/* <OutToken address={} /> */}

        <Grid item xs={1}>
          {addressToSolverName(swap.filler) || "-"}
        </Grid>
        <GasCost cumulativeGasUsed={swap.cumulativeGasUsed} />
        <GasPrice gasPrice={swap.gasPrice} />

        <ReceiptButton swap={swap} />
        {/* <Grid item xs={1} > 
            {swap.data.to || "-"}
        </Grid>
        <Grid item xs={1} > 
            {swap.data.token || "-"}
        </Grid>
         */}
      </Grid>
    </div>
  );
}
