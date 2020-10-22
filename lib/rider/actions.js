export const actionTypes = {
  LOAD_RIDERDATA: "LOAD_RIDERDATA",
  LOAD_RIDERDATA_SUCCESS: "LOAD_RIDERDATA_SUCCESS",
  LOAD_RIDERDATA_ERROR: "LOAD_RIDERDATA_ERROR"
};

export function loadRiderData(num, condition, query) {
  return { type: actionTypes.LOAD_RIDERDATA,
    num,
    condition,
    query
  };
}

export function loadRiderDataSuccess(data) {
  return {
    type: actionTypes.LOAD_RIDERDATA_SUCCESS,
    data
  };
}

export function loadRiderDataError(error) {
  return {
    type: actionTypes.LOAD_RIDERDATA_ERROR,
    error
  };
}