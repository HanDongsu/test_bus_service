export const actionTypes = {
  LOAD_ROUTEDATA: "LOAD_ROUTEDATA",
  LOAD_ROUTEDATA_SUCCESS: "LOAD_ROUTEDATA_SUCCESS",
  LOAD_ROUTEDATA_ERROR: "LOAD_ROUTEDATA_ERROR",
  LOAD_ROUTESTATIONLISTDATA: "LOAD_ROUTESTATIONLISTDATA",
  LOAD_ROUTESTATIONLISTDATA_SUCCESS: "LOAD_ROUTESTATIONLISTDATA_SUCCESS",
  LOAD_ROUTESTATIONLISTDATA_ERROR: "LOAD_ROUTESTATIONLISTDATA_ERROR"
};

export function loadRouteData(num, search) {
  return { type: actionTypes.LOAD_ROUTEDATA,
        num,
        search
  };
}

export function loadRouteDataSuccess(data) {
  return {
    type: actionTypes.LOAD_ROUTEDATA_SUCCESS,
    data
  };
}

export function loadRouteDataError(error) {
  return {
    type: actionTypes.LOAD_ROUTEDATA_ERROR,
    error
  };
}

//  ============ Route Stations List ============  //
export function loadRouteStationListData(routeNum) {
  return {
    type: actionTypes.LOAD_ROUTESTATIONLISTDATA,
    routeNum,
  };
}

export function loadRouteStationListDataSuccess(data) {
  return {
    type: actionTypes.LOAD_ROUTESTATIONLISTDATA_SUCCESS,
    data
  };
}

export function loadRouteStationListDataError(error) {
  return {
    type: actionTypes.LOAD_ROUTESTATIONLISTDATA_ERROR,
    error
  };
}
