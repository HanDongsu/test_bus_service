import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
// import fetch from "isomorphic-unfetch";
import request from "../request";

import {
  actionTypes,
  loadRouteStationDataSuccess,
  loadRouteStationDataError,
} from "./actions";

polyfill();

function* loadRouteStationDataSaga() {
  console.log("======== ROUTE_STATION SAGA ========");
  try {
    const requestURL = "/api/v1/route_station";
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    console.log(response.data);
    yield put(loadRouteStationDataSuccess(response.data.data));
  } catch (err) {
    yield put(loadRouteStationDataError(err));
  }
}

export default [
  takeLatest(actionTypes.LOAD_ROUTESTATIONDATA, loadRouteStationDataSaga),
];
