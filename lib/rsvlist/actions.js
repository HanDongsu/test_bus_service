export const actionTypes = {
  LOAD_RSVLISTDATA: "LOAD_RSVLISTDATA",
  LOAD_RSVLISTDATA_SUCCESS: "LOAD_RSVLISTDATA_SUCCESS",
  LOAD_RSVLISTDATA_ERROR: "LOAD_RSVLISTDATA_ERROR",
  LOAD_RSV_NUMBER_DATA: "LOAD_RSV_NUMBER_DATA",
  LOAD_RSV_NUMBER_DATA_SUCCESS: "LOAD_RSV_NUMBER_DATA_SUCCESS",
  LOAD_RSV_NUMBER_DATA_ERROR: "LOAD_RSV_NUMBER_DATA_ERROR"
};

export function loadRsvlistData(condition, from, to, query) {
  return { type: actionTypes.LOAD_RSVLISTDATA,
    condition, 
    from, 
    to, 
    query
  };
}

export function loadRsvlistDataSuccess(data) {
  return {
    type: actionTypes.LOAD_RSVLISTDATA_SUCCESS,
    data
  };
}

export function loadRsvlistDataError(error) {
  return {
    type: actionTypes.LOAD_RSVLISTDATA_ERROR,
    error
  };
}

export function loadRsvNumberData(rsvNo) {
  return { type: actionTypes.LOAD_RSV_NUMBER_DATA,
    rsvNo
  };
}

export function loadRsvNumberDataSuccess(rsvNoData) {
  return {
    type: actionTypes.LOAD_RSV_NUMBER_DATA_SUCCESS,
    rsvNoData
  };
}

export function loadRsvNumberDataError(error) {
  return {
    type: actionTypes.LOAD_RSV_NUMBER_DATA_ERROR,
    error
  };
}