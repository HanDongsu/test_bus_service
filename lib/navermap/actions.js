export const actionTypes = {
  LOAD_MAPDATA: "LOAD_MAPDATA",
  LOAD_MAPDATA_SUCCESS: "LOAD_MAPDATA_SUCCESS",
  LOAD_MAPDATA_ERROR: "LOAD_MAPDATA_ERROR",
  SELECT_DEPSTATIONDATA: "SELECT_DEPSTATIONDATA",
  SELECT_DEPSTATIONDATA_SUCCESS: "SELECT_DEPSTATIONDATA_SUCCESS",
  SELECT_DEPSTATIONDATA_ERROR: "SELECT_DEPSTATIONDATA_ERROR",
  SELECT_DESTSTATIONDATA: "SELECT_DESTSTATIONDATA",
  SELECT_DESTSTATIONDATA_SUCCESS: "SELECT_DESTSTATIONDATA_SUCCESS",
  SELECT_DESTSTATIONDATA_ERROR: "SELECT_DESTSTATIONDATA_ERROR",
};
//  ============ Station ============  //
export function loadMapData() {
  return {
    type: actionTypes.LOAD_MAPDATA
  };
}

export function loadMapDataSuccess(drtstation) {
  return {
    type: actionTypes.LOAD_MAPDATA_SUCCESS,
    drtstation
  };
}

export function loadMapDataError(error) {
  return {
    type: actionTypes.LOAD_MAPDATA_ERROR,
    error
  };
}
//  ============ Selected Dep Station Info ============  //
export function selectDepStationData(depStationInfos) {
  return {
    type: actionTypes.SELECT_DEPSTATIONDATA,
    depStationInfos
  };
}

export function selectDepStationDataSuccess(depStationInfos) {
  return {
    type: actionTypes.SELECT_DEPSTATIONDATA_SUCCESS,
    depStationInfos
  };
}

export function selectDepStationDataError(error) {
  return {
    type: actionTypes.SELECT_DEPSTATIONDATA_ERROR,
    error
  };
}
//  ============ Selected Dest Station Info ============  //
export function selectDestStationData(destStationInfos) {
  return {
    type: actionTypes.SELECT_DESTSTATIONDATA,
    destStationInfos
  };
}

export function selectDestStationDataSuccess(destStationInfos) {
  return {
    type: actionTypes.SELECT_DESTSTATIONDATA_SUCCESS,
    destStationInfos
  };
}

export function selectDestStationDataError(error) {
  return {
    type: actionTypes.SELECT_DESTSTATIONDATA_ERROR,
    error
  };
}
