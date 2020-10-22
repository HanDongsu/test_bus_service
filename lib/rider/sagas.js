import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
import request from "../request";

import {
  actionTypes,
  loadRiderDataSuccess,
  loadRiderDataError
} from "./actions";

polyfill();

function* loadRiderDataSaga(reqData) {
  const { num } = reqData;
  const { condition } = reqData;
  const { query } = reqData;

  if(!query){
    try {
      const requestURL = `/api/v1/rider/${num}`;
      const options = {
        method: "GET"
      };
      const response = yield call(request, requestURL, options);
      yield put(loadRiderDataSuccess(response.data));
    } catch (err) {
      yield put(loadRiderDataError(err));
    }

  } else {
    try {
      var api_param = '';
      if(condition == 'name') api_param = 'rider_nm';
      else if(condition == 'phone') api_param = 'rider_phone';
      else api_param = 'rider_email';
      const requestURL = `/api/v1/rider/${condition}?${api_param}=${query}`;
      const options = {
        method: "GET"
      };
      const response = yield call(request, requestURL, options);
      yield put(loadRiderDataSuccess(response.data));
    } catch (err) {
      yield put(loadRiderDataError(err));
    }

  }
}

export default [
  takeLatest(actionTypes.LOAD_RIDERDATA, loadRiderDataSaga)
];
