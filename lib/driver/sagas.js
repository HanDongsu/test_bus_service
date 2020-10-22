import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
import request from "../request";

import {
  actionTypes,
  loadDriverDataSuccess,
  loadDriverDataError
} from "./actions";

polyfill();

function* loadDriverDataSaga(reqData) {
  const { num } = reqData;
  const { condition } = reqData;
  const { query } = reqData;

  if(!query) {
    try {
      const requestURL = `/api/v1/driver/${num}`;
      const options = {
        method: "GET"
      };
      const response = yield call(request, requestURL, options);
      yield put(loadDriverDataSuccess(response.data));
    } catch (err) {
      yield put(loadDriverDataError(err));
    }

  } else {
    try {
      const requestURL = `/api/v1/driver/${condition}?${condition}=${query}`;
      const options = {
        method: "GET"
      };
      const response = yield call(request, requestURL, options);
      yield put(loadDriverDataSuccess(response.data));
    } catch (err) {
      yield put(loadDriverDataError(err));
    }

  }
}

export default [
  takeLatest(actionTypes.LOAD_DRIVERDATA, loadDriverDataSaga)
];
