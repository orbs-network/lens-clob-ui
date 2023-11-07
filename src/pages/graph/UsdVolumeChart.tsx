/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetTokenDetailsCallback } from "hooks/erc20-hooks";
import _ from "lodash";
import {
  useClobTransactionsQuery,
  useGetUsdValueCallback,
  useTokenDetails,
} from "queryHooks";
import { useQuery } from "react-query";
import { amountUi } from "utils";
import BN from "bignumber.js";
import moment from "moment";
import styled from "styled-components";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFormatNumber } from "hooks";
import { useMemo } from "react";
import { GraphTitle } from "./styles";
import { CircularProgress } from "@mui/material";

const createTimestampDict = (initialTimestamp: number) => {
  const timestampDictionary: { [key: string]: { min: number; max: number } } =
    {};
  const start = moment(initialTimestamp * 1000)
    .minutes(0)
    .seconds(0);
  const currentTime = moment()
    .add(1, "hours")
    .minutes(0)
    .seconds(0)
    .milliseconds(0);

  console.log(
    start.format("MM/DD/YYYY HH:mm"),
    currentTime.format("MM/DD/YYYY HH:mm")
  );

  while (!start.isAfter(currentTime)) {
    timestampDictionary[start.valueOf()] = {
      min: start.valueOf(),
      max: moment(start.valueOf()).add(1, "hours").valueOf(),
    };
    start.add(60, "minutes");
  }

  return timestampDictionary;
};

const useGetUsdVolume = (amount: string) => {
  const { data, dataUpdatedAt } = useClobTransactionsQuery(amount);
  const { mutateAsync: getUsdValue } = useGetUsdValueCallback();
  const getTotalVolume = useGetTotalVolume();
  return useQuery(
    ["useGetUsdVolume", dataUpdatedAt],
    async () => {
      const addresses: { [key: string]: string | undefined } = _.zipObject(
        _.uniq(_.map(data, "sourceToken"))
      );

      const smallestTimestamp = _.minBy(_.map(data, "timeStamp"), (it) => it);

      const timestampDict = createTimestampDict(Number(smallestTimestamp));

      const groupedByTimestamp = _.reduce(
        data,
        (result: { [key: string]: any }, swap) => {
          _.forEach(timestampDict, (it: any, key) => {
            const momentValue = moment(Number(swap.timeStamp) * 1000);
            const min = moment(it.min);
            const max = moment(it.max);
            if (momentValue.isSameOrAfter(min) && momentValue.isBefore(max)) {
              const swaps = result[key] || [];
              result[key] = [...swaps, swap];
            }
          });
          return result;
        },
        {}
      );

      await Promise.allSettled(
        _.map(addresses, async (it, key) => {
          const res = (await getUsdValue(key)) as string;
          addresses[key] = res;
        })
      );

      const withVolumes = await Promise.all(
        _.map(groupedByTimestamp, async (swaps, key) => {
          const volume = await getTotalVolume(swaps, addresses);

          const totalVolume = _.reduce(
            volume,
            (result: BN, it) => {
              return result.plus(new BN(it));
            },
            new BN(0)
          );

          return {
            name: moment(Number(key)).format("MM/DD/YYYY HH:mm"),
            date: key,
            ...volume,
            totalVolume: totalVolume.toString(),
          };
        })
      );

      return {
        withVolumes: _.sortBy(withVolumes, (it) => it.date),
        addresses: _.keys(addresses),
      };
    },
    {
      enabled: !!data,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );
};

const useGetTotalVolume = () => {
  const getTokenDetails = useGetTokenDetailsCallback();
  return async (swaps: any[], usdValues: any) => {
    const totalValues: { [key: string]: string } = {};

    for (const it of swaps) {
      const address = it.sourceToken as string;
      const token = await getTokenDetails(address);
      const usd = usdValues[address] || "0";
      const prevValue = totalValues[address] || new BN(0);
      const newValue = new BN(prevValue).plus(
        new BN(amountUi(token, it.amount)).times(usd)
      );
      totalValues[address] = newValue.toString();
    }
    const toArr = _.map(totalValues, (it, key) => {
      return {
        address: key,
        value: it,
      };
    });

    const sorted = _.orderBy(toArr, (it) => Number(it.value), ["desc"]);

    return _.reduce(
      sorted,
      (acc, { address, value }) => ({ ...acc, [address]: value }),
      {}
    );
  };
};

const TooltipToken = ({ item }: { item: any }) => {
  const { dataKey, value } = item;
  const { data: token } = useTokenDetails(dataKey);
  const formatted = useFormatNumber({ value, decimalScale: 4 });

  return (
    <TooltipTokenContainer $color="black">
      <p>{token?.symbol}:</p>
      <p>${formatted}</p>
    </TooltipTokenContainer>
  );
};

const TooltipTokenContainer = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  p {
    color: ${(props) => props.$color};
    font-size: 14px;
  }
`;
const TooltipTotalVolume = ({ payload }: { payload: any }) => {
  const totalVolume = useMemo(
    () =>
      _.reduce(
        payload,
        (result: BN, it: any) => {
          return result.plus(new BN(it.value));
        },
        new BN(0)
      ).toString(),
    [payload]
  );

  const formatted = useFormatNumber({ value: totalVolume, decimalScale: 2 });
  return (
    <TooltipVolumeContainer>
      <p>Total Volume:</p>
      <p>${formatted}</p>
    </TooltipVolumeContainer>
  );
};

const TooltipVolumeContainer = styled.div`
  display: flex;
  align-items: center;
  p {
    font-size: 14px;
    font-weight: bold;
  }
`;

const renderTooltip = (props: any) => {
  const { payload } = props;

  return (
    <TooltipContainer>
      <TooltipTotalVolume payload={payload} />
      {payload?.map((it: any) => {
        return <TooltipToken key={it.dataKey} item={it} />;
      })}
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div`
  background-color: white;
  padding: 10px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export function UsdVolumeChart({ amount }: { amount: string }) {
  const { data } = useGetUsdVolume(amount);

  return (
    <Container>
      <GraphTitle>USD volume</GraphTitle>
      {!data ? (
        <CircularProgress />
      ) : (
        <ResponsiveContainer style={{ flex: 1 }}>
          <BarChart
            data={data?.withVolumes || []}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              style={{ fontSize: 14, fontWeight: 500 }}
              tickFormatter={tickFormatter}
            />
            <YAxis />
            <Tooltip content={renderTooltip} />

            {data?.addresses.map((it) => {
              return <Bar key={it} dataKey={it} stackId="a" fill="blue" />;
            })}
          </BarChart>
        </ResponsiveContainer>
      )}
    </Container>
  );
}

const tickFormatter = (value: any) => {
  return moment(Number(value)).format("DD/MM/YYYY HH:mm");
};

const Container = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
`;
