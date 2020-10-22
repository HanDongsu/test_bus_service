import { call, put, takeLatest } from "redux-saga/effects";
import { polyfill } from "es6-promise";
// import fetch from "isomorphic-unfetch";
import request from "../request";

import {
  actionTypes,
  loadMemberDataSuccess,
  loadMemberDataError,
  loadMemberSearchPhoneDataSuccess,
  loadMemberSearchPhoneDataError,
  loadMemberSearchCurStationDataSuccess,
  loadMemberSearchCurStationDataError
} from "./actions";

polyfill();
//  ============ Member ============  //
function* loadMemberDataSaga() {
  console.log(' ==== loadMemberDataSaga ===');
  
  try {
    const requestURL = "/api/v1/rider/";
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    // console.log(response.data);
    yield put(loadMemberDataSuccess(response.data));
  } catch (err) {
    yield put(loadMemberDataError(err));
  }
}
//  ============ MemberSearchPhone ============  //
function* loadMemberSearchPhoneDataSaga(reqData) {
  const { memberPhone } = reqData;
  console.log("loadMemberSearchPhoneDataSaga=================== "+memberPhone);
  try {
    const requestURL = `/api/v1/rider/phone?rider_phone=${memberPhone}`;
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    // console.log(response.data);
    yield put(loadMemberSearchPhoneDataSuccess(response.data));
  } catch (err) {
    yield put(loadMemberSearchPhoneDataError(err));
  }
}
//  ============ MemberSearchCurStation ============  //
function* loadMemberSearchCurStationDataSaga(reqData) {
  const { memberNum } = reqData;
  console.log("MemberSearchCurStationMemberSearchCurStation =============== "+memberNum);
  try {
    const requestURL = `/api/v1/rider/${memberNum}/station`;
    const options = {
      method: "GET"
    };
    const response = yield call(request, requestURL, options);
    console.log("MemberSearchCurStation ==> " +response.data);
    yield put(loadMemberSearchCurStationDataSuccess(response.data));
  } catch (err) {
    yield put(loadMemberSearchCurStationDataError(err));
  }
}

export default [
  takeLatest(actionTypes.LOAD_MEMBERDATA, loadMemberDataSaga),
  takeLatest(actionTypes.LOAD_MEMBER_SEARCH_PHONE_DATA, loadMemberSearchPhoneDataSaga),
  takeLatest(actionTypes.LOAD_MEMBER_SEARCH_CURSTATION_DATA, loadMemberSearchCurStationDataSaga)
];
