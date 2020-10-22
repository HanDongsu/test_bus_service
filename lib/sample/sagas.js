import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
// import fetch from "isomorphic-unfetch";
import request from "../request";

import { actionTypes, loadDataSuccess, loadDataError } from "./actions";

polyfill();

function* loadDataSaga() {
  console.log("loadData Sample saga call");
  try {
    // const requestURL = "/api/sample/1";
    const requestURL = "/api/v1/buses";
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    // console.log(response.data);
    yield put(loadDataSuccess(response.data));
  } catch (err) {
    yield put(loadDataError(err));
  }
}

export default [takeLatest(actionTypes.LOAD_DATA, loadDataSaga)];
