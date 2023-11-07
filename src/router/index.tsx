import App from "App";
import { GraphPage, MainPage, TakerStatsPage } from "pages";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/graph",
        element: <GraphPage />,
      },
      {
        path: "/taker-stats",
        element: <TakerStatsPage />,
      },
    ],
  },
]);
