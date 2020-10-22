import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
// import fetch from "isomorphic-unfetch";
import request from "../request";

import {
  actionTypes,
  loadMapDataSuccess,
  loadMapDataError,
  selectDepStationDataSuccess,
  selectDepStationDataError,
  selectDestStationDataSuccess,
  selectDestStationDataError,

} from "./actions";

polyfill();

function* loadMapDataSaga() {
  try {
    const requestURL = "/api/v1/station";
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    yield put(loadMapDataSuccess(response.data));
  } catch (err) {
    yield put(loadMapDataError(err));
    console.log(err);
  }
}

function* selectDepStationDataSaga(reqData) {
  const { depStationInfos } = reqData;
  try {
    if(depStationInfos){
      const requestURL = `/api/v1/station/${depStationInfos.id}`;
      const options = {
        method: "GET"
      };
      const response = yield call(request, requestURL, options);
      yield put(selectDepStationDataSuccess(response.data));
    } else {
      //승차정류소 선택 취소시
      yield put(selectDepStationDataSuccess(false));
    }
  } catch (err) {
    yield put(selectDepStationDataError(err));
    console.log(err);
  }
}

function* selectDestStationDataSaga(reqData) {
  const { destStationInfos } = reqData;
  try {
    if(destStationInfos) {
      console.log(destStationInfos.id);
      const requestURL = `/api/v1/station/${destStationInfos.id}`;
      const options = {
        method: "GET"
      };
      const response = yield call(request, requestURL, options);
      yield put(selectDestStationDataSuccess(response.data));
    } else {
      //하차정류소 선택 취소시
      yield put(selectDestStationDataSuccess(false));
    }
  } catch (err) {
    yield put(selectDestStationDataError(err));
    console.log(err);
  }
}

export default [
  takeLatest(actionTypes.LOAD_MAPDATA, loadMapDataSaga),
  takeLatest(actionTypes.SELECT_DEPSTATIONDATA, selectDepStationDataSaga),
  takeLatest(actionTypes.SELECT_DESTSTATIONDATA, selectDestStationDataSaga),
];
