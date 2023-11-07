import { Divider, Grid } from "@mui/material";
import { Page } from "components";
import { useNetworkContext } from "context/network-context";
import _ from "lodash";
import { useClobTransactionsQuery, useUsdValueQuery } from "queryHooks";
import React, { useMemo } from "react";
import { addressToSolverName } from "utils";
import { addressToName } from "utils/gaurdians";
import BN from "bignumber.js";
import { zeroAddress } from "@orbs-network/twap";
import styled from "styled-components";
export function TakerStatsPage() {
  return (
    <Page>
      <TakerStats />
    </Page>
  );
}

type SolversDictionary = { [key: string]: number };

function Solvers(props: { solvers: SolversDictionary }) {
  let solvers = props.solvers;

  return (
    <SolversContainer>
      {Object.keys(solvers).map((solver: any) => {
        return (
          <SolverContainer key={solver}>
            <p>{solver}: </p>
            <p>{solvers[solver]}</p>
          </SolverContainer>
        );
      })}
    </SolversContainer>
  );
}
const SolverContainer = styled.div`
  display: flex;
  align-items: center;
`;
const SolversContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const useTakersData = () => {
  const { data: orders, dataUpdatedAt } = useClobTransactionsQuery("100");
  const config = useNetworkContext().config;

  const { data: nativeTokenUsd } = useUsdValueQuery(zeroAddress);

  console.log({ nativeTokenUsd });

  return useMemo(() => {
    const total = _.size(orders);
    const backUpTakers = _.size(
      orders?.filter((order: any) => {
        return addressToName(order.from).toLowerCase().indexOf("taker") > -1;
      })
    );
    const l3Takers = _.size(
      orders?.filter((order: any) => {
        return addressToName(order.from).toLowerCase().indexOf("taker") === -1;
      })
    );
    const success = _.size(
      orders?.filter((order: any) => {
        return order.isError === "0";
      })
    );

    let failed = _.size(
      orders?.filter((order: any) => {
        return order.isError !== "0";
      })
    );
    const totalGas = orders?.reduce((sum: any, order: any) => {
      return sum + parseInt(order.gasPrice);
    }, 0);
    const totalGasFee = orders?.reduce((sum: any, order: any) => {
      return sum + parseInt(order.gasPrice) * parseInt(order.gasUsed);
    }, 0);

    const avgGas = (totalGas / total / 1e9).toFixed(2);

    let successRate = ((success / total) * 100).toFixed(2);
    let failedRate = ((failed / total) * 100).toFixed(2);
    const avgGasFee = (totalGasFee / total / 1e18).toFixed(2);

    let solvers: SolversDictionary = {};

    let gasSum = new BN(0);
    orders?.forEach((order: any) => {
      gasSum = gasSum.plus(
        new BN(order.gasPrice).multipliedBy(new BN(order.cumulativeGasUsed))
      );

      const solverName = addressToSolverName(order.data.to);
      if (!solvers[solverName]) {
        solvers[solverName] = 0;
      }
      solvers[solverName] += 1;
    }, 0);

    const gasMatic = gasSum.div(new BN(10).pow(new BN(18))).toString();
    let gasUSD = nativeTokenUsd
      ? gasSum
          .div(new BN(10).pow(new BN(18)))
          .multipliedBy(new BN(nativeTokenUsd))
      : new BN(0);
    let avgGasFeeUSD = gasSum.div(new BN(total)).toFixed(2);

    const gasUsdTotal = gasUSD.div(new BN(total));

    return {
      successRate,
      failedRate,
      totalGas,
      avgGas,
      totalGasFee,
      avgGasFee,
      avgGasFeeUSD,
      gasUSD: gasUSD.toString(),
      gasMatic,
      solvers,
      total,
      success,
      failed,
      backUpTakers,
      l3Takers,
      gasUsdTotal: gasUsdTotal.toString(),
    };
  }, [dataUpdatedAt, nativeTokenUsd]);
};

function TakerStats() {
  const {
    solvers,
    total,
    success,
    failed,
    successRate,
    backUpTakers,
    l3Takers,
    gasMatic,
    gasUSD,
    avgGas,
    gasUsdTotal,
  } = useTakersData();

  return (
    <div>
      <h2>Solver Stats</h2>
      <Divider></Divider>
      <Grid container>
        <div>
          <Solvers solvers={solvers} />
        </div>
      </Grid>
      <Divider></Divider>
      <Grid container>
        <Grid item xs={1}>
          Total
        </Grid>
        <Grid item xs={1}>
          Success/Failed
        </Grid>
        <Grid item xs={1}>
          Avg Gas Price (Gwei)
        </Grid>
        <Grid item xs={1}>
          BackUp/L3 Takers
        </Grid>
        <Grid item xs={1}>
          Gas Fees $
        </Grid>
        <Grid item xs={1}>
          Avg Tx Gas Cost $
        </Grid>
      </Grid>

      <Divider></Divider>
      <Grid container>
        <Grid item xs={1}>
          {total}
        </Grid>
        <Grid item xs={1}>
          {success} / {failed} ({successRate}%)
        </Grid>
        <Grid item xs={1}>
          {avgGas}
        </Grid>
        <Grid item xs={1}>
          {backUpTakers}/{l3Takers} (
          {((backUpTakers / (backUpTakers + l3Takers)) * 100).toFixed()}%)
        </Grid>
        <Grid item xs={1}>
          {gasMatic + " | " + gasUSD} $
        </Grid>
        <Grid item xs={1}>
          {" "}
          {gasUsdTotal}
        </Grid>
      </Grid>
    </div>
  );
}
