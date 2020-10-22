import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
import request from "../request";

import {
  actionTypes,
  loadRsvlistDataSuccess,
  loadRsvlistDataError,
  loadRsvNumberDataSuccess,
  loadRsvNumberDataError,
} from "./actions";

polyfill();

function* loadRsvlistDataSaga(reqData) {
  const { condition, from, to, query } = reqData;

  var condi = condition;
  var fromdate = from;
  var todate = to;
  var que = query;
  condi = condition === undefined ? 'ALL' : condition;
  fromdate = from === undefined ? '' : from;
  todate = to === undefined ? '' : to;
  que = query === undefined ? '' : query;

  var url = '';
  if(condi == "RSV_NO"){
    url = que;
  }else if(condi == "RSV_STAT"){
    url = "query?condition="+condi+"&rsv_stat=RSV_REQUEST&from="+fromdate+"&page=0&size=0&to="+todate;
  }else{
    url = "query?condition="+condi+"&from="+fromdate+"&page=0&query="+que+"&size=0&to="+todate;
  }

  try {
    const requestURL = `/api/v1/reserve/${url}`;
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    yield put(loadRsvlistDataSuccess(response.data));
  } catch (err) {
    yield put(loadRsvlistDataError(err));
  }
}

function* loadRsvNumberDataSaga(reqData) {
  const { rsvNo } = reqData;
  try {
    const requestURL = `/api/v1/reserve/${rsvNo}`;
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    yield put(loadRsvNumberDataSuccess(response.data));
  } catch (err) {
    yield put(loadRsvNumberDataError(err));
  }
}

export default [
  takeLatest(actionTypes.LOAD_RSVLISTDATA, loadRsvlistDataSaga),
  takeLatest(actionTypes.LOAD_RSV_NUMBER_DATA, loadRsvNumberDataSaga)
];
