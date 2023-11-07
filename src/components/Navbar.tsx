import { InputLabel, NativeSelect } from "@mui/material";
import { useUrlParams } from "hooks";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Layout } from "styles";

export function Navbar() {
  const { search } = useLocation();

  return (
    <StyledNavbar>
      <NavbarContent>
        <h1 style={{ fontFamily: "monospace" }}>🔍 Lens Explorer</h1>
        <Right>
          <SetNetwork />
          <NavigationContainer>
            <Link to={`/${search}`}>Main</Link>
            <Link to={`/graph${search}`}>Graph</Link>
            <Link to={`/taker-stats${search}`}>Taker stats</Link>
          </NavigationContainer>
        </Right>
      </NavbarContent>
    </StyledNavbar>
  );
}

const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 40px;
`;

const NavbarContent = styled(Layout)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0px;
  flex-direction: row;
`;

const NavigationContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const StyledNavbar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: #fff;
  z-index: 100;
`;

const SetNetwork = () => {
  const { setNetwork } = useUrlParams();

  return (
    <div>
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        Network
      </InputLabel>
      <NativeSelect
        onChange={(e) => {
          setNetwork(e.target.value);
        }}
        inputProps={{
          id: "uncontrolled-native",
        }}
      >
        <option value={127}>Polygon</option>
        <option value={56}>BSC</option>
        <option value={250}>Fantom</option>
        <option value={42161}>Arbitrum</option>
        <option value={43114}>Avalanche</option>
      </NativeSelect>
    </div>
  );
};
