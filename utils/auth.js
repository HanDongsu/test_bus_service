import React, { useEffect } from "react";
// import Router from "next/router";
import nextCookie from "next-cookies";
import cookie from "js-cookie";

export const accessTokenName = "accessTokenDuruta";
let accessToken = "";
export const login = ({ token }) => {
  cookie.set(accessTokenName, token, { expires: 10 });
  window.localStorage.setItem(accessTokenName, token);
  // Router.push("/");
  location.href = "/";
};

export const getAccessToken = () => {
  accessToken = window.localStorage.getItem(accessTokenName)
  return accessToken;
};

export const setAccessToken = token => {
  accessToken = token;
};

export const auth = ctx => {
  const { accessTokenDuruta } = nextCookie(ctx);
  // console.log("]-----] auth.token [----[ ", accessTokenDuruta);
  const token = accessTokenDuruta

  /*
   * If `ctx.req` is available it means we are on the server.
   * Additionally if there's no token it means the user is not logged in.
   */
  
  // 첫화면 signin을 타서 주석 처리함.  + // Router.push("/signin"); 3개
  if (ctx.req && !token) {
    ctx.res.writeHead(302, { Location: "/signin" });
    ctx.res.end();
  }

  // We already checked for server. This should only happen on client.
  //if (!token) {
    // Router.push("/signin");
    // useEffect(() => {
    // location.href = "/";
    // ctx.res.writeHead(302, { Location: "/content" });
    // ctx.res.end();
    // }, []);
  // };
  
  return token;
};

export const logout = () => {
  cookie.remove(accessTokenName);
  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now());
  window.localStorage.removeItem(accessTokenName);
  // Router.push("/signin");
  location.href = "/signin";
};

export const withAuthSync = WrappedComponent => {
  const Wrapper = props => {
    const syncLogout = event => {
      if (event.key === "logout") {
        console.log("logged out from storage!");
        // Router.push("/signin");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, [null]);

    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async ({ ctx }) => {
    const token = auth(ctx);

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps, token };
  };

  return Wrapper;
};
