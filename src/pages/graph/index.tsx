import { Page } from "components";
import React, { useState } from "react";
import { ProviderStatusChart } from "./ProviderStatusChart";
import { UsdVolumeChart } from "./UsdVolumeChart";
import styled from "styled-components";
import { Button, TextField } from "@mui/material";

export function GraphPage() {
  const [amount, setAmount] = useState("40");
  return (
    <Page>
      <Container>
        <AmountControll onSubmit={setAmount} />
        <UsdVolumeChart amount={amount} />
        <ProviderStatusChart amount={amount} />
      </Container>
    </Page>
  );
}

const AmountControll = ({
  onSubmit,
}: {
  onSubmit: (value: string) => void;
}) => {
  const [value, setValue] = useState("40");
  return (
    <AmountControllContainer>
      <TextField
        fullWidth
        type="number"
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        InputProps={{
          endAdornment: (
            <Button variant="contained" onClick={() => onSubmit(value)}>
              Submit
            </Button>
          ),
        }}
      />
    </AmountControllContainer>
  );
};

const AmountControllContainer = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;
