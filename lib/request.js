// import fetch from "isomorphic-unfetch";
import axios from "axios";
import { accessTokenName, getAccessToken } from "../utils/auth";
// import cookie from "js-cookie";
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  // return response.json();
  return response;
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  console.log(error);
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
const isServer = typeof window === "undefined";
export default async function request(url, optionsReq) {
  // console.log("]-----] isServer [-----[", isServer);
  // console.log("]-----] initialState [-----[", initialState);

  const options = {
    method: optionsReq.method,
    headers: {
      Accept: "application/json;charset=UTF-8",
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      // Accept: "application/json;charset=UTF-8",
      // "Content-Type": "application/json;charset=UTF-8",
      // "Access-Control-Allow-Origin": "*"

  //     Accept: "application/json;charset=UTF-8",
  //     "Access-Control-Allow-Origin": "*",
  //     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  //  "Access-Control-Max-Age": 3600,
  //  "Access-Control-Allow-Headers": "Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization",

      // *** 원본 설정 ***
      // Accept: "application/json;charset=UTF-8",
      // "Content-Type": "application/json;charset=UTF-8",
      // "Access-Control-Allow-Origin": "*",
      // Authorization: isServer
      //   ? getAccessToken()
      //   : localStorage.getItem(accessTokenName)
    }
  };
  // console.log(options);
  if (optionsReq.method === "POST") {
    options.data = optionsReq.data;
  }
  if (optionsReq.method === "PUT") {
    options.data = optionsReq.data;
  }

  // id&pw 로그인 요청
  if (optionsReq.basicAuth) {
    options.headers.Authorization = optionsReq.basicAuth;
  }
  // console.log("API_URL ==[ ", process.env);
  // console.log("NODE_ENV ==[ ", process.env.NODE_ENV);
  const fetchResponse = await axios(`${process.env.API_URL}${url}`, options);
  // console.log(fetchResponse);
  const response = await checkStatus(fetchResponse);
  return parseJSON(response);
}
