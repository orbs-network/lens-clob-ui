/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import { useClobTransactionsQuery } from "queryHooks";
import React from "react";
import { useQuery } from "react-query";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { addressToSolverName } from "utils";
import styled from "styled-components";
import { GraphTitle } from "./styles";
import { CircularProgress } from "@mui/material";

const useProviderStatus = (amount: string) => {
  const { data, dataUpdatedAt } = useClobTransactionsQuery(amount);

  return useQuery(
    ["useProviderStatus", dataUpdatedAt],
    () => {
      const mapped = _.mapValues(
        _.groupBy(data, (item) => item.filler),
        (value) => {
          return _.groupBy(value, (item) => item.isError);
        }
      );
      const successCount = _.find(data, (item) => item.isError === '0');
      const failureCount = _.find(data, (item) => item.isError === "1");

      const total = {
        solver: "Total",
        total: _.size(data),
        graphData: [
            { name: "success", value: _.size(successCount) },
            { name: "error", value: _.size(failureCount) },
        ]
      };

      const result = _.map(mapped, (it, key) => {
        return {
          solver: addressToSolverName(key),
          total: _.size(it["0"]) + _.size(it["1"]),
          graphData: [
            { name: "success", value: _.size(it["0"]) },
            { name: "error", value: _.size(it["1"]) },
          ],
        };
      });


      return [...result, total];
    },
    {
      enabled: !!data,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );
};
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      fontSize="14px"
      pointerEvents="none"
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function ProviderStatusChart({ amount }: { amount: string }) {
  const { data } = useProviderStatus(amount);

  return (
    <Container>
      <GraphTitle>Provider Status</GraphTitle>
      {!data ? (
        <CircularProgress />
      ) : (
        <GraphsContainer>
          {data?.map((it) => {
            return (
              <SolverContainer key={it.solver}>
                <SolverName>{it.solver}</SolverName>
                <TotalTx>Total: {it.total}</TotalTx>
                <PieChart width={200} height={200}>
                  <Pie
                    data={it.graphData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    dataKey="value"
                    label={renderCustomizedLabel}
                  >
                    <Cell key={`cell-1`} fill="green" />
                    <Cell key={`cell-2`} fill="red" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </SolverContainer>
            );
          })}
        </GraphsContainer>
      )}
    </Container>
  );
}
const TotalTx = styled.p`
  text-align: center;
  width: 100%;
  font-size: 15px;
  margin-top: 10px;
  font-weight: 500;
`;
const SolverName = styled.p`
  text-align: center;
  width: 100%;
  font-size: 17px;
  font-weight: bold;
`;
const SolverContainer = styled.div``;

const Container = styled.div``;

const GraphsContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  gap: 20px;
  justify-content: space-evenly;
  .recharts-pie-label-line {
    stroke: none;
  }
`;
