export const actionTypes = {
  LOAD_STATION: "LOAD_STATION",
  LOAD_STATION_SUCCESS: "LOAD_STATION_SUCCESS",
  LOAD_STATION_ERROR: "LOAD_STATION_ERROR",
  LOAD_FIND_STATION_NAME: "LOAD_FIND_STATION_NAME",
  LOAD_FIND_STATION_NAME_SUCCESS: "LOAD_FIND_STATION_NAME_SUCCESS",
  LOAD_FIND_STATION_NAME_ERROR: "LOAD_FIND_STATION_NAME_ERROR"
};

export function loadStation(num , search) {
  return { type: actionTypes.LOAD_STATION,
      num,
      search
  };
}

export function loadStationSuccess(data) {
  return {
    type: actionTypes.LOAD_STATION_SUCCESS,
    data
  };
}

export function loadStationError(error) {
  return {
    type: actionTypes.LOAD_STATION_ERROR,
    error
  };
}

//  ============ Search Statin Name ============  //
export function loadFindStationName(st_nm) {
  return { type: actionTypes.LOAD_FIND_STATION_NAME,
    st_nm
  };
}

export function loadFindStationNameSuccess(find_st_nm) {
  return {
    type: actionTypes.LOAD_FIND_STATION_NAME_SUCCESS,
    find_st_nm
  };
}

export function loadFindStationNameError(error) {
  return {
    type: actionTypes.LOAD_FIND_STATION_NAME_ERROR,
    error
  };
}

