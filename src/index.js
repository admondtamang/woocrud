import "@babel/polyfill";
import React from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { ConnectedRouter } from "connected-react-router";
import Layout from "./pages/";
import configureStore, { history } from "./store/";
import * as serviceWorker from "./serviceWorker";
import { QueryClient, QueryClientProvider } from "react-query";

import "./styles.css";
import "./styles.scss";
import "antd/dist/antd.css";

const store = configureStore();
const queryClient = new QueryClient();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

const theme = createMuiTheme({
  direction: "rtl",
  typography: {
    useNextVariants: true,
  },
});

const container = document.getElementById("root");

const root = createRoot(container);
root.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConnectedRouter history={history}>
          {/* <TranslateProvider> */}
          <Layout />
          {/* </TranslateProvider> */}
        </ConnectedRouter>
      </QueryClientProvider>
    </Provider>
  </MuiThemeProvider>
);
