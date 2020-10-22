const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD
} = require("next/constants");

const webpack = require('webpack');

// This uses phases as outlined here: https://nextjs.org/docs/#custom-configuration
module.exports = phase => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  // when `next build` or `npm run build` is used
  const isProd =
  phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== "1";
  // when `next build` or `npm run build` is used
  const isStaging = PHASE_PRODUCTION_BUILD && process.env.STAGING === "1";
  
  console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`);
  
  webpack: (config, { dev }) => {
      config.plugins.push(
          new webpack.ProvidePlugin({
              '$': 'jquery',
              'jQuery': 'jquery',
          })
      )
      return config
  }

  const env = {
    API_URL: (() => {
      if (isDev) return "http://27.96.131.196:5406";
      // if (isDev) return "http://127.0.0.1:8080";
      if (isProd) {
        // 개발 DB
        return "http://27.96.131.196:5406";
        // 라이브 DB
        // return "http://49.50.163.120:5407";
      }
      if (isStaging) return "https://admin-dev.projectwith.com";
      return "RESTURL_SPEAKERS:not (isDev,isProd && !isStaging,isProd && isStaging)";
    })()
  };

  // next.config.js object
  return {
    env
  };
};
