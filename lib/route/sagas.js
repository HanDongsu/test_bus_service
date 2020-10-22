import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
import request from "../request";

import {
  actionTypes,
  loadRouteDataSuccess,
  loadRouteDataError,
  loadRouteStationListDataSuccess,
  loadRouteStationListDataError
} from "./actions";

polyfill();

function* loadRouteDataSaga(reqData) {
  const { num } = reqData;
  const { search } = reqData;
  if(search){
    try {
      const requestURL = `/api/v1/route/query?route_nm_query=${num}`;
      const options = {
        method: "GET"
      };
      const response = yield call(request, requestURL, options);
      yield put(loadRouteDataSuccess(response.data));
    } catch (err) {
      yield put(loadRouteDataError(err));
    }
  }else{
      try {
        const requestURL = `/api/v1/route/${num}`;
        const options = {
          method: "GET"
        };
        const response = yield call(request, requestURL, options);
        yield put(loadRouteDataSuccess(response.data));
      } catch (err) {
        yield put(loadRouteDataError(err));
      }
  }
}
function* loadRouteStationListDataSaga(reqData) {
  try {
    yield put(loadRouteStationListDataSuccess(response.data));
  } catch (err) {
    yield put(loadRouteStationListDataError(err));
  }
}

export default [
  takeLatest(actionTypes.LOAD_ROUTEDATA, loadRouteDataSaga),
  takeLatest(actionTypes.LOAD_ROUTESTATIONLISTDATA, loadRouteStationListDataSaga)
];
