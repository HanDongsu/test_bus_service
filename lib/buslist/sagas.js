import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
import request from "../request";

import {
  actionTypes,
  loadBusDataSuccess,
  loadBusDataError,
  loadCarNumRSVDateDataSuccess,
  loadCarNumRSVDateDataError
} from "./actions";

polyfill();

function* loadBusDataSaga() {
  try {
    const requestURL = `/api/v1/car`;
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    // console.log(response.data);
    yield put(loadBusDataSuccess(response.data));
  } catch (err) {
    yield put(loadBusDataError(err));
  }
}

function* loadBusDataSagaFind(reqData) {
  const { num } = reqData;
  const { condition } = reqData;
  const { query } = reqData;
  if(!query){
    try {
      const requestURL = `/api/v1/car/${num}`;
      const options = {
        method: "GET"
      };
      const response = yield call(request, requestURL, options);
      // console.log(response.data);
      yield put(loadBusDataSuccess(response.data));
    } catch (err) {
      yield put(loadBusDataError(err));
    }
  } else{
    
    if( condition == 'name'){
      try { 
        const requestURL = `/api/v1/car/${condition}?${condition}=${query}`;
        const options = {
          method: "GET"
        };
        const response = yield call(request, requestURL, options);
        // console.log(response.data);
        yield put(loadBusDataSuccess(response.data));
      } catch (err) {
        yield put(loadBusDataError(err));
      }
    }else{
      try { 
        const requestURL = `/api/v1/car/${condition}?plate_no=${query}`;
        const options = {
          method: "GET"
        };
        const response = yield call(request, requestURL, options);
        // console.log(response.data);
        yield put(loadBusDataSuccess(response.data));
      } catch (err) {
        yield put(loadBusDataError(err));
      }
    }
    
}
}

function* loadCarNumRSVDateDataSaga(reqData) {
  const { carNum, rsvDate } = reqData;
  try {
    const requestURL = `/api/v1/car/${carNum}/${rsvDate}`;
    // const requestURL = `/api/v1/car/1/20200320`;
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    yield put(loadCarNumRSVDateDataSuccess(response.data));
  } catch (err) {
    yield put(loadCarNumRSVDateDataError(err));
  }
}

export default [
  takeLatest(actionTypes.LOAD_BUSDATA, loadBusDataSaga),
  takeLatest(actionTypes.LOAD_BUSDATAFIND, loadBusDataSagaFind),
  takeLatest(actionTypes.LOAD_CARNUMRSVDATEDATA, loadCarNumRSVDateDataSaga),
];
