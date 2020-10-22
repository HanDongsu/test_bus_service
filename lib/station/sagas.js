import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
import request from "../request";

import {
  actionTypes,
  loadStationSuccess,
  loadStationError,
  loadFindStationNameSuccess,
  loadFindStationNameError
} from "./actions";

polyfill();

function* loadStationSaga(reqData) {
  const { num } = reqData;
  const { search } = reqData;

  console.log("서버 DB 접근함.");

  if(search){
    try {
      const requestURL = `/api/v1/station/name?station_nm_query=${num}`;
      const options = {
        method: "GET"
      };
      const response = yield call(request, requestURL, options);
      yield put(loadStationSuccess(response.data));
    } catch (err) {
      yield put(loadStationError(err));
    }
  }else{
    try {
      const requestURL = `/api/v1/station/${num}`;
      const options = {
        method: "GET"
      };
      const response = yield call(request, requestURL, options);
      yield put(loadStationSuccess(response.data));
    } catch (err) {
      yield put(loadStationError(err));
    }
  }
}

function* loadFindStationNameSaga(reqData) {
  const { st_nm } = reqData;
  try {
    const requestURL = `/api/v1/station/name?station_nm_query=${st_nm}`;
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    yield put(loadFindStationNameSuccess(response.data));
  } catch (err) {
    yield put(loadFindStationNameError(err));
  }
}

export default [
  takeLatest(actionTypes.LOAD_STATION, loadStationSaga),
  takeLatest(actionTypes.LOAD_FIND_STATION_NAME, loadFindStationNameSaga)
];
