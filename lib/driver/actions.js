export const actionTypes = {
  LOAD_DRIVERDATA: "LOAD_DRIVERDATA",
  LOAD_DRIVERDATA_SUCCESS: "LOAD_DRIVERDATA_SUCCESS",
  LOAD_DRIVERDATA_ERROR: "LOAD_DRIVERDATA_ERROR"
};

export function loadDriverData(num, condition, query) {
  return { type: actionTypes.LOAD_DRIVERDATA,
    num,
    condition,
    query
  };
}

export function loadDriverDataSuccess(driverList) {
  return {
    type: actionTypes.LOAD_DRIVERDATA_SUCCESS,
    driverList
  };
}

export function loadDriverDataError(error) {
  return {
    type: actionTypes.LOAD_DRIVERDATA_ERROR,
    error
  };
}