import React , { useEffect }from "react";
import App from "next/app";
import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";

import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import createStore from "../lib/store";
import theme from "../utils/theme";
import Layout from "../components/Layout";
import nextCookie from "next-cookies";
import { isSignin } from "../lib/auth/actions";
import { setAccessToken , getAccessToken } from "../utils/auth";

class MyApp extends App {

  //원본 
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    const { store, isServer, req } = ctx;
    // console.log("]-----] _app.ctx [----[ ", ctx);
    
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx, req });
    }

    const { accessTokenDuruta } = nextCookie(ctx);
    if (accessTokenDuruta) {
      store.dispatch(isSignin(accessTokenDuruta));
      setAccessToken(accessTokenDuruta);
    } 
    return { pageProps };
  }

  
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Provider store={store}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}
export default withRedux(createStore)(withReduxSaga(MyApp));
