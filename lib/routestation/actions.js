export const actionTypes = {
  LOAD_ROUTESTATIONDATA: "LOAD_ROUTESTATIONDATA",
  LOAD_ROUTESTATIONDATA_SUCCESS: "LOAD_ROUTESTATIONDATA_SUCCESS",
  LOAD_ROUTESTATIONDATA_ERROR: "LOAD_ROUTESTATIONDATA_ERROR",
};
//  ============ Route Stations Data ============  //
export function loadRouteStationData() {
  return { type: actionTypes.LOAD_ROUTESTATIONDATA };
}

export function loadRouteStationDataSuccess(data) {
  return {
    type: actionTypes.LOAD_ROUTESTATIONDATA_SUCCESS,
    data
  };
}

export function loadRouteStationDataError(error) {
  return {
    type: actionTypes.LOAD_ROUTESTATIONDATA_ERROR,
    error
  };
}