import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
import request from "../request";

import {
  actionTypes,
  loadContentsSuccess,
  loadContentsError,
  loadContentsuccess,
  loadContentError
} from "./actions";

polyfill();

function* loadContentsSaga() {
  try {
    const requestURL = `/api/v1/driver`;
    const options = {
      method: "GET",
    };
    const response = yield call(request, requestURL, options);
    yield put(loadContentsSuccess(response.data));
  } catch (err) {
    yield put(loadContentsError(err));
    console.log(err);
  }
}

function* loadContentsaga(reqData) {
  const { contentsId } = reqData;
  try {
    const requestURL = `/api/content/${contentsId}`;
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    yield put(loadContentsuccess(response.data));
  } catch (err) {
    yield put(loadContentError(err));
  }
}

export default [
  takeLatest(actionTypes.LOAD_CONTENTS, loadContentsSaga),
  takeLatest(actionTypes.LOAD_CONTENT, loadContentsaga)
];
