export const actionTypes = {
  LOAD_MEMBERDATA: "LOAD_MEMBERDATA",
  LOAD_MEMBERDATA_SUCCESS: "LOAD_MEMBERDATA_SUCCESS",
  LOAD_MEMBERDATA_ERROR: "LOAD_MEMBERDATA_ERROR",
  LOAD_MEMBER_SEARCH_PHONE_DATA: "LOAD_MEMBER_SEARCH_PHONE",
  LOAD_MEMBER_SEARCH_PHONE_SUCCESS: "LOAD_MEMBER_SEARCH_PHONE_SUCCESS",
  LOAD_MEMBER_SEARCH_PHONE_ERROR: "LOAD_MEMBER_SEARCH_PHONE_ERROR",
  LOAD_MEMBER_SEARCH_CURSTATION_DATA: "LOAD_MEMBER_SEARCH_CURSTATION_DATA",
  LOAD_MEMBER_SEARCH_CURSTATION_SUCCESS: "LOAD_MEMBER_SEARCH_CURSTATION_SUCCESS",
  LOAD_MEMBER_SEARCH_CURSTATION_ERROR: "LOAD_MEMBER_SEARCH_CURSTATION_ERROR",
  SAVE_CALLED_RIDER_INFO_DATA: "SAVE_CALLED_RIDER_INFO_DATA",
  SAVE_CALLED_RIDER_INFO_DATA_SUCCESS: "SAVE_CALLED_RIDER_INFO_DATA_SUCCESS",
  SAVE_CALLED_RIDER_INFO_DATA_ERROR: "SAVE_CALLED_RIDER_INFO_DATA_ERROR",
  LOAD_CALL_2_CALL_EVENT_DATA: "LOAD_CALL_2_CALL_EVENT_DATA",
};
//  ============ Member ============  //
export function loadMemberData() {
  return { type: actionTypes.LOAD_MEMBERDATA};
}

export function loadMemberDataSuccess(data) {
  return {
    type: actionTypes.LOAD_MEMBERDATA_SUCCESS,
    data
  };
}

export function loadMemberDataError(error) {
  return {
    type: actionTypes.LOAD_MEMBERDATA_ERROR,
    error
  };
}
//  ============ MemberSearchPhone ============  //
export function loadMemberSearchPhoneData(memberPhone) {
  return {
    type: actionTypes.LOAD_MEMBER_SEARCH_PHONE_DATA,
    memberPhone
  };
}

export function loadMemberSearchPhoneDataSuccess(memberInfo) {
  return {
    type: actionTypes.LOAD_MEMBER_SEARCH_PHONE_SUCCESS,
    memberInfo
  };
}

export function loadMemberSearchPhoneDataError(error) {
  return {
    type: actionTypes.LOAD_MEMBER_SEARCH_PHONE_ERROR,
    error
  };
}
//  ============ MemberSearchCurStation ============  //
export function loadMemberSearchCurStationData(memberNum) {
  return {
    type: actionTypes.LOAD_MEMBER_SEARCH_CURSTATION_DATA,
    memberNum
  };
}

export function loadMemberSearchCurStationDataSuccess(curStation) {
  console.log("~~~~~~~~~~~~~~member action");
  return {
    type: actionTypes.LOAD_MEMBER_SEARCH_CURSTATION_SUCCESS,
    curStation
  };
}

export function loadMemberSearchCurStationDataError(error) {
  return {
    type: actionTypes.LOAD_MEMBER_SEARCH_CURSTATION_ERROR,
    error
  };
}

//  ============ Save Member Datas ============  //
export function saveCalledRiderInfoData(riderInfoSave) {
  return {
    type: actionTypes.SAVE_CALLED_RIDER_INFO_DATA,
    riderInfoSave
  };
}

export function saveCalledRiderInfoDataSuccess(saveDatas) {
  console.log("~~~~~~~~~~~~~~member action");
  return {
    type: actionTypes.SAVE_CALLED_RIDER_INFO_DATA_SUCCESS,
    saveDatas
  };
}

export function saveCalledRiderInfoDataError(error) {
  return {
    type: actionTypes.SAVE_CALLED_RIDER_INFO_DATA_ERROR,
    error
  };
}

//  ============ Call 2 Call 전화 걸기 ============  //
export function loadCall2CallEventData(call2callNum, call2callName) {
  return {
    type: actionTypes.LOAD_CALL_2_CALL_EVENT_DATA,
    call2callNum,
    call2callName
  };
}

