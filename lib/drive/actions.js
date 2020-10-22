export const actionTypes = {
  LOAD_DRIVEDATA: "LOAD_DRIVEDATA",
  LOAD_DRIVEDATA_SUCCESS: "LOAD_DRIVEDATA_SUCCESS",
  LOAD_DRIVEDATA_ERROR: "LOAD_DRIVEDATA_ERROR",
  LOAD_DRIVE_SEARCH_CARNUM_DATA: "LOAD_DRIVE_SEARCH_CARNUM_DATA",
  LOAD_DRIVE_SEARCH_CARNUM_SUCCESS: "LOAD_DRIVE_SEARCH_CARNUM_SUCCESS",
  LOAD_DRIVE_SEARCH_CARNUM_ERROR: "LOAD_DRIVE_SEARCH_CARNUM_ERROR"
};

export function loadDriveData(condition, from, to, query) {
  return { 
    type: actionTypes.LOAD_DRIVEDATA,
    condition, 
    from, 
    to, 
    query
  };
}

export function loadDriveDataSuccess(data) {
  return {
    type: actionTypes.LOAD_DRIVEDATA_SUCCESS,
    data
  };
}

export function loadDriveDataError(error) {
  return {
    type: actionTypes.LOAD_DRIVEDATA_ERROR,
    error
  };
}
export function loadDriveSearchCarNumData(carNum) {
  return {
    type: actionTypes.LOAD_DRIVE_SEARCH_CARNUM_DATA,
    carNum
  };
}

export function loadDriveSearchCarNumDataSuccess(drv_list) {
  return {
    type: actionTypes.LOAD_DRIVE_SEARCH_CARNUM_SUCCESS,
    drv_list
  };
}

export function loadDriveSearchCarNumDataError(error) {
  return {
    type: actionTypes.LOAD_DRIVE_SEARCH_CARNUM_ERROR,
    error
  };
}
