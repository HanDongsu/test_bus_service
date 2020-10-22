import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
import request from "../request";

import { actionTypes, loadConsultantSuccess, loadConsultantError,
  loadConsultantOneSuccess, loadConsultantOneError,
} from "./actions";

polyfill();

function* loadConsultantSaga(reqData) {
  const { condition } = reqData;
  const { query } = reqData;
  if(!query) {
    try {
      const requestURL = `/api/v1/operator/${reqData.num}`;
      const options = {
        method: "GET"
      };
      const response = yield call(request, requestURL, options);
      yield put(loadConsultantSuccess(response.data));
    } catch (err) {
      yield put(loadConsultantError(err));
    }
  } else {
    try {
      const requestURL = `/api/v1/operator/${condition}?${condition}=${query}`;
      const options = {
        method: "GET"
      };
      const response = yield call(request, requestURL, options);
      yield put(loadConsultantSuccess(response.data));
    } catch (err) {
      yield put(loadConsultantError(err));
    }

  }
}

function* loadConsultantOneSaga(reqData) {
  try {
    const requestURL = `/api/v1/operator/${reqData.num}`;
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    yield put(loadConsultantOneSuccess(response.data));
  } catch (err) {
    yield put(loadConsultantOneError(err));
  }
}

export default [
  takeLatest(actionTypes.LOAD_CONSULTANT, loadConsultantSaga),
  takeLatest(actionTypes.LOAD_CONSULTANTONE, loadConsultantOneSaga),
];
