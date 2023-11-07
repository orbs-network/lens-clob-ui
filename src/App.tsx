import styled from "styled-components";
import { NetworkContextProvider } from "context/network-context";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import { Outlet } from "react-router-dom";
import { Layout } from "styles";
import { Navbar } from "components";

function App() {
  return (
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <NetworkContextProvider>
        <Container>
        <Navbar />
          <Outlet />
        </Container>
      </NetworkContextProvider>
    </QueryParamProvider>
  );
}

export default App;




const Container = styled(Layout)`

  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 80px;

`;
