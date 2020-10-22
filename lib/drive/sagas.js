import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
import request from "../request";
import {
  actionTypes,
  loadDriveDataSuccess,
  loadDriveDataError,
  loadDriveSearchCarNumDataSuccess,
  loadDriveSearchCarNumDataError
} from "./actions";

polyfill();

function* loadDriveDataSaga(reqData) {
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
  if(condi == "DRV_NO"){
    url = que;
  }else if(condi == "DRV_STAT"){
    url = "query?condition="+condi+"&drv_stat="+que+"&from="+fromdate+"&page=0&size=0&to="+todate;
  }else{
    url = "query?condition="+condi+"&from="+fromdate+"&page=0&query="+que+"&size=0&to="+todate;
  }

  try {
    const requestURL = `/api/v1/drive/${url}`;
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    yield put(loadDriveDataSuccess(response.data));
  } catch (err) {
    yield put(loadDriveDataError(err));
  }
}
function* loadDriveSearchCarNUmDataSaga(reqData) {
  const { carNum } = reqData;
  try {
    const requestURL = `/api/v1/drive/car/${carNum}`;
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    yield put(loadDriveSearchCarNumDataSuccess(response.data));
  } catch (err) {
    yield put(loadDriveSearchCarNumDataError(err));
  }
}

export default [
  takeLatest(actionTypes.LOAD_DRIVEDATA, loadDriveDataSaga),
  takeLatest(actionTypes.LOAD_DRIVE_SEARCH_CARNUM_DATA, loadDriveSearchCarNUmDataSaga)
];
