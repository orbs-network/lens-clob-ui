/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Transactions } from './Transactions'
import { Divider, Grid } from "@mui/material";
import { styled } from "styled-components";


export function MainPage() {
  return (
    <Container>
      {/* {<TakerStats orders={txs} />} */}
      <Grid container>
        {/* <Grid item xs={1} >Id</Grid> */}
        <Grid item xs={1}>
          Status
        </Grid>
        <Grid item xs={1}>
          Tx
        </Grid>
        <Grid item xs={2}>
          Order Time
        </Grid>
        <Grid item xs={2}>
          From
        </Grid>
        <Grid item xs={2}>
          In Amount
        </Grid>
        <Grid item xs={1}>
          Usd
        </Grid>
        <Grid item xs={1}>
          Exchange
        </Grid>
        <Grid item xs={1}>
          Gas Cost
        </Grid>
        <Grid item xs={1}>
          Gas Price
        </Grid>
        {/* <Grid item xs={1}  >{order.srcFilledAmount}</Grid> */}
      </Grid>
      <Divider></Divider>
      <Transactions />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  line-height: 2rem;
  margin-bottom: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

